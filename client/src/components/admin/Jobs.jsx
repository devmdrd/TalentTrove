import React, { useState, useEffect } from 'react';
import api from '../../utils/axios.js';
import {
  FiBriefcase, FiMapPin, FiX
} from 'react-icons/fi';
import {
  FaRupeeSign, FaBuilding, FaRegClock, FaRegCalendarAlt
} from 'react-icons/fa';
import { GiSkills } from 'react-icons/gi';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/admin/jobs');
        setJobs(response.data);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Openings</h1>
        <p className="text-gray-600">Browse through available job positions</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading job listings...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <FiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">There are currently no job openings</p>
        </div>
      ) : (
        <div className="max-h-screen overflow-y-auto space-y-4 pr-2">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                        <FiBriefcase className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500">
                          <span className="flex items-center mr-4">
                            <FaBuilding className="mr-1.5 h-4 w-4" />
                            {job.company?.name || 'N/A'}
                          </span>
                          <span className="flex items-center mr-4">
                            <FiMapPin className="mr-1.5 h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center mr-4">
                            <FaRupeeSign className="mr-1.5 h-4 w-4" />
                            {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(job)}
                    className="ml-4 px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {job.jobType}
                  </span>
                  {job.skillsRequired?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {skill}
                    </span>
                  ))}
                  {job.skillsRequired?.length > 3 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{job.skillsRequired.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaRegCalendarAlt className="mr-1.5 h-4 w-4" />
                    <span>Apply before: {formatDate(job.lastDateToApply)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRegClock className="mr-1.5 h-4 w-4" />
                    <span>Posted: {formatDate(job.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <FaBuilding className="mr-2 text-blue-600" />
                    Company Details
                  </h3>
                  <p className="text-gray-700">{selectedJob.company?.name || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <FiMapPin className="mr-2 text-blue-600" />
                    Job Location
                  </h3>
                  <p className="text-gray-700">{selectedJob.location}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <FaRupeeSign className="mr-2 text-blue-600" />
                    Salary Range
                  </h3>
                  <p className="text-gray-700">
                    ₹{selectedJob.salary.min.toLocaleString()} - ₹{selectedJob.salary.max.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <FaRegClock className="mr-2 text-blue-600" />
                    Job Type
                  </h3>
                  <p className="text-gray-700">{selectedJob.jobType}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Job Description</h3>
                <div className="prose max-w-none text-gray-700">{selectedJob.description}</div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <GiSkills className="mr-2 text-blue-600" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skillsRequired?.map((skill, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <FaRegCalendarAlt className="mr-2 text-blue-600" />
                  Important Dates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Posted on</p>
                    <p className="font-medium">{formatDate(selectedJob.createdAt)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Last date to apply</p>
                    <p className="font-medium">{formatDate(selectedJob.lastDateToApply)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
