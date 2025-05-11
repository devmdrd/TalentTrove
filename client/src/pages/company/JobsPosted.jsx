import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import api from '../../utils/axios';
import Header from "../../components/company/Header";
import Footer from "../../components/company/Footer";

const JobsPosted = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const handleNavigation = (jobId) => {
    navigate(`/company/jobs/${jobId}`);
  };

  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const response = await api.get('/company/jobs');
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching posted jobs:", error);
      }
    };

    fetchPostedJobs();
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto py-8 px-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Jobs Posted</h2>

        <div className="flex justify-end mb-6">
          <Link
            to="/company/job-post"
            className="flex items-center justify-center px-5 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Add New Job
          </Link>
        </div>

        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Location</th>
                <th className="px-4 py-3 text-left font-medium">Salary</th>
                <th className="px-4 py-3 text-left font-medium">Experience</th>
                <th className="px-4 py-3 text-left font-medium">Last Date</th>
                <th className="px-4 py-3 text-left font-medium">Vacancy</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-100 transition-all duration-300">
                  <td className="px-4 py-4 text-blue-600">{job.title}</td>
                  <td className="px-4 py-4 text-gray-800">{job.jobType}</td>
                  <td className="px-4 py-4 text-gray-800">{job.location}</td>
                  <td className="px-4 py-4 text-gray-800">
                    ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-gray-800">{job.experienceRequired} yrs</td>
                  <td className="px-4 py-4 text-gray-800">
                    {new Date(job.lastDateToApply).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-gray-800">{job.numberOfPosts}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleNavigation(job._id)}
                      className="p-2 text-white bg-blue-500 rounded-full shadow hover:bg-blue-600 transition-all duration-300"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobsPosted;
