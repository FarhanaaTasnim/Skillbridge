/**
 * Matching Accuracy Evaluation (v2 - real production scores)
 * -------------------------------------------------------------
 * Evaluates your ACTUAL live algorithm's output (algorithmScore, captured
 * from your real app's responses) against your own hand-labeled judgment
 * of whether each job was truly a good fit (humanJudgment).
 *
 * This is different from v1: instead of re-deriving a score from jobTags
 * (which most of your real jobs don't have, since Jobicy mostly returns
 * hasRealTags:false), this evaluates what your algorithm actually did in
 * production - the real matchScore your app computed and displayed.
 *
 * USAGE:
 *   node matching-eval.js test-cases-real.json
 *
 * Each test case needs:
 *   - algorithmScore: the real matchScore your app returned (0-100)
 *   - humanJudgment: "good" | "bad" - your honest call on true fit
 *
 * THRESHOLD: a case counts as "predicted good" if algorithmScore >= THRESHOLD.
 * 50 is a reasonable default (matches your app's apparent midpoint), but
 * you can override it with a second argument, e.g.:
 *   node matching-eval.js test-cases-real.json 40
 */

const fs = require('fs');
const path = require('path');

const THRESHOLD = Number(process.argv[3]) || 50;

function evaluate(testCases) {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  const errors = { falsePositives: [], falseNegatives: [] };

  for (const c of testCases) {
    const score = c.algorithmScore;
    const predictedGood = score >= THRESHOLD;
    const actualGood = c.humanJudgment === 'good';

    if (predictedGood && actualGood) tp++;
    else if (predictedGood && !actualGood) {
      fp++;
      errors.falsePositives.push({ id: c.id, score });
    } else if (!predictedGood && !actualGood) tn++;
    else {
      fn++;
      errors.falseNegatives.push({ id: c.id, score });
    }
  }

  const total = testCases.length;
  const accuracy = (tp + tn) / total;
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  return { total, tp, fp, tn, fn, accuracy, precision, recall, f1, errors };
}

function run() {
  const testFile = process.argv[2];
  if (!testFile) {
    console.error('Usage: node matching-eval.js test-cases-real.json [threshold]');
    process.exit(1);
  }

  const testCases = JSON.parse(fs.readFileSync(path.resolve(testFile), 'utf8'));
  console.log(`Loaded ${testCases.length} labeled test cases.`);
  console.log(`Threshold for "predicted good": algorithmScore >= ${THRESHOLD}\n`);

  const results = evaluate(testCases);

  console.log('=== Overall Results ===');
  console.log(`Total cases:        ${results.total}`);
  console.log(`True positives:     ${results.tp}  (algorithm said good, human agreed)`);
  console.log(`False positives:    ${results.fp}  (algorithm said good, human said bad)`);
  console.log(`True negatives:     ${results.tn}  (algorithm said bad, human agreed)`);
  console.log(`False negatives:    ${results.fn}  (algorithm said bad, human said good)`);
  console.log('');
  console.log(`Accuracy:  ${(results.accuracy * 100).toFixed(1)}%`);
  console.log(`Precision: ${(results.precision * 100).toFixed(1)}%  (of jobs algorithm called "good", how many really were)`);
  console.log(`Recall:    ${(results.recall * 100).toFixed(1)}%  (of jobs that really were "good", how many algorithm caught)`);
  console.log(`F1 score:  ${(results.f1 * 100).toFixed(1)}%`);

  if (results.errors.falseNegatives.length > 0) {
    console.log('\n=== False Negatives (algorithm under-scored a real good fit) ===');
    for (const e of results.errors.falseNegatives) {
      console.log(`  ${e.id}: scored ${e.score}%`);
    }
  }

  if (results.errors.falsePositives.length > 0) {
    console.log('\n=== False Positives (algorithm over-scored a real bad fit) ===');
    for (const e of results.errors.falsePositives) {
      console.log(`  ${e.id}: scored ${e.score}%`);
    }
  }

  console.log('\n=== What this means for your resume ===');
  console.log(`Your live matching algorithm achieved ${(results.accuracy * 100).toFixed(1)}% accuracy`);
  console.log(`against a hand-labeled test set of ${results.total} real job/resume pairs`);
  console.log(`(3 tailored versions of the same resume, ${results.errors.falseNegatives.length} false negatives,`);
  console.log(`${results.errors.falsePositives.length} false positives identified and categorized).`);
  console.log('\nThis number is defensible because: it is your ACTUAL algorithm\'s output,');
  console.log('scored against your own honest fit judgments, with every ambiguous case');
  console.log('checked against the real job description before labeling.');
}

run();
