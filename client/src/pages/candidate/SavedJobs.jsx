import React, { useEffect, useState } from 'react';
import api from "../../utils/axios";
import { FaBookmark, FaRegBookmark, FaRegClock, FaRegTrashAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { MdOutlineWork, MdLocationOn, MdBusiness } from 'react-icons/md';
import { AiOutlineDollarCircle, AiOutlineFieldTime } from 'react-icons/ai';
import Header from '../../components/candidate/Header';
import Footer from '../../components/candidate/Footer';
import ApplyJobModal from '../../components/candidate/jobs/ApplyJobModal';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  console.log(selectedJob)

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await api.get('/saved-jobs');
        setSavedJobs(response.data.savedJobs);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const unsaveJob = async (jobId) => {
    try {
      await api.post(`/jobs/save/${jobId}`);
      setSavedJobs(savedJobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error unsaving job:', error);
    }
  };

  const filteredJobs = activeTab === 'all' 
    ? savedJobs 
    : activeTab === 'expiring' 
      ? savedJobs.filter(job => new Date(job.lastDateToApply) > new Date())
      : savedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Saved Jobs</h1>
            <p className="text-lg text-gray-600">
              {savedJobs.length} {savedJobs.length === 1 ? 'opportunity' : 'opportunities'} saved
            </p>
          </div>

          <div className="mb-8 flex justify-center border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                All Saved Jobs
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'recent' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Recently Added
              </button>
              <button
                onClick={() => setActiveTab('expiring')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'expiring' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Expiring Soon
              </button>
            </nav>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <FaRegBookmark className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {activeTab === 'all' ? "No saved jobs yet" : `No jobs in this category`}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {activeTab === 'all' 
                  ? "Bookmark interesting jobs to view them here later" 
                  : activeTab === 'recent'
                  ? "No recently saved jobs"
                  : "No jobs expiring soon"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      {job.company.logo ? (
                        <img
                          src={`${STATIC_URL}/public/${job.company.logo}`}
                          alt={job.company.name}
                          className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                          <MdBusiness className="text-2xl" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-indigo-600 font-medium mb-2">{job.company.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => unsaveJob(job.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove saved job"
                          >
                            <FaRegTrashAlt />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {job.jobType}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {job.experienceRequired || 'Experience not specified'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MdLocationOn className="flex-shrink-0" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AiOutlineDollarCircle className="flex-shrink-0" />
                          <span>
                            {job.salary?.min ? `₹${job.salary.min.toLocaleString()}` : 'Not specified'} - 
                            {job.salary?.max ? `₹${job.salary.max.toLocaleString()}` : 'Not specified'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AiOutlineFieldTime className="flex-shrink-0" />
                          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaRegClock className="flex-shrink-0" />
                          <span>Apply by {new Date(job.lastDateToApply).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {job.skillsRequired?.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Skills Required:</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skillsRequired.map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-100 pt-4">
                    <div className="text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MdBusiness className="text-gray-400" />
                        {job.company.industry || 'Industry not specified'} • {job.company.size || 'Size not specified'}
                      </span>
                    </div>
                    <button
                    onClick={() => {
                        setSelectedJob(job);
                        setModalOpen(true);
                    }}
                    className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                    Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
        <ApplyJobModal 
            isOpen={modalOpen} 
            onRequestClose={() => setModalOpen(false)} 
            job={selectedJob} 
        />
      <Footer />
    </>
  );
};

export default SavedJobs;