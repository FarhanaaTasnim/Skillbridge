/**
 * API Response Time Benchmark (gentle / single-user mode)
 * ----------------------------
 * Measures REALISTIC latency for a backend endpoint — one request at a
 * time, small total count — so you don't trip third-party rate limits
 * (Jobicy/Arbeitnow) and end up benchmarking error responses instead of
 * real request handling.
 *
 * SETUP:
 *   cd skillbridge-backend
 *   npm install --save-dev autocannon
 *
 * USAGE:
 *   1. Start your backend locally (npm run dev)
 *   2. Run this BEFORE making any optimization:
 *        node scripts/benchmark.cjs before
 *   3. Make your optimization (e.g. cache the Jobicy/Arbeitnow response)
 *   4. Run it again AFTER:
 *        node scripts/benchmark.cjs after
 *   5. Compare the two JSON result files it writes to ./benchmark-results/
 *
 * NOTE: This sends only 10 total requests, one at a time, with a pause
 * between each. It will take about 15-20 seconds to run. This is
 * intentional — it's simulating a single real user, not a burst.
 */

const autocannon = require('autocannon');
const fs = require('fs');
const path = require('path');

const LABEL = process.argv[2] || 'run';
const BASE_URL = process.env.BENCHMARK_URL || 'http://localhost:5000';
const ENDPOINT = process.env.BENCHMARK_ENDPOINT || '/api/jobs/remote';
const AUTH_TOKEN = process.env.BENCHMARK_TOKEN || '';

const TOTAL_REQUESTS = 10;   // small, fixed count instead of a timed burst
const DELAY_MS = 1500;       // pause between each request

console.log("SCRIPT STARTED");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendOneRequest() {
  const start = Date.now();

  const res = await fetch(`${BASE_URL}${ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
    },
    body: JSON.stringify({
      skills: ['javascript', 'react', 'node', 'python', 'mongodb', 'express']
    }),
  });

  const elapsed = Date.now() - start;
  return { statusCode: res.status, latencyMs: elapsed };
}

async function run() {
  console.log(`\nBenchmarking ${BASE_URL}${ENDPOINT}  [label: ${LABEL}]\n`);
  console.log(`Sending ${TOTAL_REQUESTS} requests, one at a time, ${DELAY_MS}ms apart...\n`);

  const results = [];
  const statusCounts = {};

  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    try {
      const { statusCode, latencyMs } = await sendOneRequest();
      results.push(latencyMs);
      statusCounts[statusCode] = (statusCounts[statusCode] || 0) + 1;
      console.log(`Request ${i + 1}/${TOTAL_REQUESTS}: status ${statusCode}, ${latencyMs}ms`);
    } catch (err) {
      console.error(`Request ${i + 1}/${TOTAL_REQUESTS} failed:`, err.message);
      statusCounts['error'] = (statusCounts['error'] || 0) + 1;
    }

    if (i < TOTAL_REQUESTS - 1) {
      await sleep(DELAY_MS);
    }
  }

  finishRun(results, statusCounts);
}

function percentile(sortedArr, p) {
  const idx = Math.ceil((p / 100) * sortedArr.length) - 1;
  return sortedArr[Math.max(0, Math.min(idx, sortedArr.length - 1))];
}

function finishRun(results, statusCounts) {
  const non2xxCount = Object.entries(statusCounts)
    .filter(([code]) => code === 'error' || Number(code) < 200 || Number(code) >= 300)
    .reduce((sum, [, count]) => sum + count, 0);

  if (non2xxCount > 0) {
    console.warn(
      `\n⚠️  WARNING: ${non2xxCount} of ${TOTAL_REQUESTS} requests were non-2xx/errors.\n` +
      `Status code breakdown: ${JSON.stringify(statusCounts, null, 2)}\n` +
      `Results below only reflect what was measured; treat with caution if non2xx > 0.\n`
    );
  }

  const sorted = [...results].sort((a, b) => a - b);
  const avg = sorted.length
    ? sorted.reduce((a, b) => a + b, 0) / sorted.length
    : null;

  const summary = {
    label: LABEL,
    endpoint: ENDPOINT,
    timestamp: new Date().toISOString(),
    mode: 'gentle-single-user',
    total_requests: TOTAL_REQUESTS,
    successful_requests: sorted.length,
    latency_avg_ms: avg !== null ? Number(avg.toFixed(1)) : null,
    latency_p50_ms: sorted.length ? percentile(sorted, 50) : null,
    latency_p95_ms: sorted.length ? percentile(sorted, 95) : null,
    latency_min_ms: sorted.length ? sorted[0] : null,
    latency_max_ms: sorted.length ? sorted[sorted.length - 1] : null,
    status_codes: statusCounts,
  };

  const outDir = path.join(__dirname, 'benchmark-results');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${LABEL}.json`);
  fs.writeFileSync(outFile, JSON.stringify(summary, null, 2));

  console.log('\nResult summary:');
  console.table(summary);
  console.log(`\nSaved to ${outFile}`);

  const beforeFile = path.join(outDir, 'before.json');
  const afterFile = path.join(outDir, 'after.json');
  if (LABEL === 'after' && fs.existsSync(beforeFile) && fs.existsSync(afterFile)) {
    const before = JSON.parse(fs.readFileSync(beforeFile));
    const after = JSON.parse(fs.readFileSync(afterFile));
    if (before.latency_avg_ms && after.latency_avg_ms) {
      const pctChange = (((before.latency_avg_ms - after.latency_avg_ms) / before.latency_avg_ms) * 100).toFixed(1);
      console.log(`\n=== BEFORE vs AFTER ===`);
      console.log(`Avg latency: ${before.latency_avg_ms}ms -> ${after.latency_avg_ms}ms`);
      console.log(`Improvement: ${pctChange}%  <-- this is your real, defensible resume number`);
    } else {
      console.log('\n⚠️  Cannot compute before/after comparison — one or both runs had no successful requests.');
    }
  }
}

run().catch((err) => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});