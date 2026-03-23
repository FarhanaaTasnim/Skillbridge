import { useState } from "react";

const ResumeUpload = () => {

  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);

  const handleUpload = async (e) => {

    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("http://localhost:5000/api/resume/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    setSkills(data.detectedSkills);

    // Fetch jobs using detected skills
    const skillString = data.detectedSkills.join(",");

    const jobsRes = await fetch(
      `http://localhost:5000/api/jobs/search?skills=${skillString}`
    );

    const jobsData = await jobsRes.json();

    setJobs(jobsData);

  };

  return (
    <div className="p-8">

      <h2 className="text-2xl font-bold mb-4">
        Upload Resume
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        className="mb-6"
      />

      {skills.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2">
            Detected Skills
          </h3>

          <div className="flex gap-2 flex-wrap mb-6">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </>
      )}

      {jobs.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-4">
            Jobs Matching Your Resume
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {jobs.map((job, i) => (

              <div
                key={i}
                className="p-5 bg-white dark:bg-gray-900 shadow rounded-xl"
              >

                <h4 className="font-bold text-lg">
                  {job.title}
                </h4>

                <p className="text-gray-500">
                  {job.company}
                </p>

                <p className="mt-2 font-semibold text-green-600">
                  Match: {job.match}%
                </p>

                {job.missingSkills?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold">
                      Missing Skills
                    </p>

                    <ul className="text-red-500 text-sm">
                      {job.missingSkills.map((s, idx) => (
                        <li key={idx}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <a
                  href={job.url}
                  target="_blank"
                  className="mt-3 inline-block bg-purple-600 text-white px-4 py-2 rounded-lg"
                >
                  Apply
                </a>

              </div>

            ))}

          </div>
        </>
      )}

    </div>
  );
};

export default ResumeUpload;