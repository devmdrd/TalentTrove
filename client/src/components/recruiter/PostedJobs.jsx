import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPostedJobs } from "../../services/recruiterServices";

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate()
  const handleNavigation = (jobId) => {
    console.log("clickeed")
    navigate(`/recruiter/jobs/${jobId}`);
  };
  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const response = await getPostedJobs();
        if (response.success) {
          setJobs(response.postedJobs);
        }
      } catch (error) {
        console.error("Error fetching posted jobs:", error);
      }
    };

    fetchPostedJobs();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-4">Posted Jobs</h2>
      <div className="flex items-center mt-4 gap-x-3 mb-4">
        <Link
          to="/recruiter/job-post"
          className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Add Job</span>
        </Link>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              S.No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vacancy
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jobs.map((job, index) => (
            <tr key={job._id}>
              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => handleNavigation(job._id)}
                >
                  {job.title}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {job.numberOfPosts}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostedJobs;
