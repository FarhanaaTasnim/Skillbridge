const JobCard = ({ job }) => {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">

      <h2 className="text-xl font-semibold mb-1">{job.title}</h2>

      <p className="text-gray-600 dark:text-gray-400 mb-3">
        {job.company}
      </p>

      <div className="mb-3">
        <span className="font-semibold">Match:</span>{" "}
        <span className="text-green-600 font-bold">
          {job.match}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
  <div
    className="bg-green-500 h-2 rounded-full"
    style={{ width: `${job.match}%` }}
  ></div>
</div>

      {job.missingSkills?.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold mb-1">Missing Skills:</p>

          <ul className="list-disc list-inside text-sm text-red-500">
            {job.missingSkills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Apply
      </a>
    </div>
  );
};

export default JobCard;