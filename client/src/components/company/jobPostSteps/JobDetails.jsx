import React from "react";
import { FaChevronRight, FaEdit, FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign } from "react-icons/fa";

const JobDetails = ({ jobDetails, handleJobDetailsChange, handleSalaryChange, nextStep }) => {
  const isFormComplete =
    jobDetails.title &&
    jobDetails.jobType &&
    jobDetails.numberOfPosts &&
    jobDetails.location &&
    jobDetails.experienceRequired &&
    jobDetails.lastDateToApply &&
    jobDetails.salary.min &&
    jobDetails.salary.max;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Job Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FaEdit className="mr-2" />
            Job Title*
          </label>
          <input
            type="text"
            name="title"
            value={jobDetails.title}
            onChange={handleJobDetailsChange}
            required
            placeholder="e.g. Senior Frontend Developer"
            className="w-full px-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FaEdit className="mr-2" />
            Job Type*
          </label>
          <select
            name="jobType"
            value={jobDetails.jobType}
            onChange={handleJobDetailsChange}
            required
            className="w-full px-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            {["Full-time", "Part-time", "Internship", "Contract", "Freelance", "Remote"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FaEdit className="mr-2" />
            Number of Openings*
          </label>
          <input
            type="number"
            name="numberOfPosts"
            value={jobDetails.numberOfPosts}
            onChange={handleJobDetailsChange}
            min={1}
            required
            className="w-full px-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            Location*
          </label>
          <input
            type="text"
            name="location"
            value={jobDetails.location}
            onChange={handleJobDetailsChange}
            required
            placeholder="e.g. New York, NY or Remote"
            className="w-full px-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FaEdit className="mr-2" />
            Experience Required*
          </label>
          <input
            type="text"
            name="experienceRequired"
            value={jobDetails.experienceRequired}
            onChange={handleJobDetailsChange}
            required
            placeholder="e.g. 3-5 years"
            className="w-full px-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FaCalendarAlt className="mr-2" />
            Application Deadline*
          </label>
          <input
            type="date"
            name="lastDateToApply"
            value={jobDetails.lastDateToApply}
            onChange={handleJobDetailsChange}
            required
            className="w-full px-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FaRupeeSign className="mr-2" />
            Minimum Salary*
          </label>
          <input
            type="number"
            name="salary.min"
            value={jobDetails.salary.min}
            onChange={handleSalaryChange}
            required
            placeholder="0"
            className="w-full px-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FaRupeeSign className="mr-2" />
            Maximum Salary*
          </label>
          <input
            type="number"
            name="salary.max"
            value={jobDetails.salary.max}
            onChange={handleSalaryChange}
            required
            placeholder="0"
            className="w-full px-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          type="button"
          onClick={nextStep}
          disabled={!isFormComplete}
          className={`flex items-center px-6 py-2.5 font-medium rounded-lg transition-colors
            ${isFormComplete ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        >
          Next: Skills & Requirements <FaChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
