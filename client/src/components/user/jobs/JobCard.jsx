import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiClock, FiCalendar, FiStar, FiX } from "react-icons/fi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import Modal from 'react-modal';
import { STATIC_URL } from '../../../utils/axios';
import ApplyJobModal from './ApplyJobModal';
import api from "../../../utils/axios";

Modal.setAppElement('#root');

const JobCard = ({ job, expandedJob, toggleJobExpand, savedJobs, toggleSaveJob }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(savedJobs.includes(job._id));

  const handleSaveJob = async (jobId) => {
    try {
      const response = await api.post(`/jobs/save/${jobId}`);

      if (response.status === 200) {
        setIsSaved(response.data.saved);
        toggleSaveJob(jobId, response.data.saved);
      } else {
        console.error("Failed to save the job:", response.data);
      }
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex justify-between">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-xl">
              {job.company?.logo ? (
                <img src={`${STATIC_URL}/public/${job.company.logo}`} alt="Company Logo" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                job.company?.name?.charAt(0) || 'J'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900 truncate">{job.title}</h2>
                {job.featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <FiStar className="mr-1" /> Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{job.company?.name || 'Confidential'}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <FiBriefcase className="mr-1" /> {job.jobType}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FiMapPin className="mr-1" /> {job.location}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()}
                </span>
                {job.remote && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Remote
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleSaveJob(job._id)} 
            className="text-gray-400 hover:text-yellow-500 transition-colors duration-200"
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            {isSaved ? (
              <FaBookmark className="h-5 w-5 text-yellow-500" />
            ) : (
              <FaRegBookmark className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <p className={`mt-3 text-gray-600 ${expandedJob === job._id ? '' : 'line-clamp-2'}`}>
          {job.description}
        </p>
        
        {job.description.length > 150 && (
          <button 
            onClick={() => toggleJobExpand(job._id)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {expandedJob === job._id ? 'Show less' : 'Read more'}
          </button>
        )}
        
        <div className="mt-4 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiClock className="text-gray-400" />
            <span>{job.experienceRequired || "0+"} years exp</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiCalendar className="text-gray-400" />
            <span>Apply before {new Date(job.lastDateToApply).toLocaleDateString()}</span>
          </div>
        <button
          onClick={() => setModalOpen(true)}
          className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          Apply Now
        </button>
        </div>
      </motion.div>

      <ApplyJobModal 
        isOpen={modalOpen} 
        onRequestClose={() => setModalOpen(false)} 
        job={job} 
      />
    </>
  );
};

export default JobCard;