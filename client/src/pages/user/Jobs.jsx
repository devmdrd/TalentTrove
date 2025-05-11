import React, { useEffect, useState } from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import api from "../../utils/axios";
import { motion } from "framer-motion";
import SearchHero from "../../components/user/jobs/SearchHero";
import Filters from "../../components/user/jobs/Filters";
import MobileFilters from "../../components/user/jobs/MobileFilters";
import JobCard from "../../components/user/jobs/JobCard";
import Pagination from "../../components/user/jobs/Pagination";
import { FiFilter } from 'react-icons/fi';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    jobKey: "",
    locationKey: "",
    experience: "",
    salary: "",
    jobType: "",
    skills: ""
  });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [expandedJob, setExpandedJob] = useState(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/jobs", {
        params: {
          ...filters,
          sortBy,
          sortOrder,
          currentPage: page,
          jobsPerPage: 5
        }
      });
      setJobs(res.data.currentJobs);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const saved = JSON.parse(localStorage.getItem('savedJobs')) || [];
    setSavedJobs(saved);
  }, [filters, sortBy, sortOrder, page]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
  };

  const resetFilters = () => {
    setFilters({
      jobKey: "",
      locationKey: "",
      experience: "",
      salary: "",
      jobType: "",
      skills: ""
    });
    setPage(1);
  };

  const toggleJobExpand = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SearchHero 
            jobKey={filters.jobKey} 
            handleChange={handleChange} 
          />

          <div className="flex flex-col md:flex-row gap-6">
            <Filters 
              filters={filters} 
              handleChange={handleChange} 
              resetFilters={resetFilters} 
            />

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <FiFilter /> Filters
                  </button>
                  {isLoading ? (
                    <div className="h-4 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                  ) : (
                    <span className="text-sm text-gray-500">{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                  >
                    <option value="createdAt">Newest</option>
                    <option value="salary.min">Salary (Low to High)</option>
                    <option value="salary.max">Salary (High to Low)</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>

              <MobileFilters 
                showMobileFilters={showMobileFilters}
                setShowMobileFilters={setShowMobileFilters}
                filters={filters}
                handleChange={handleChange}
                resetFilters={resetFilters}
              />

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center"
                >
                  <div className="max-w-md mx-auto">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 mt-3">No jobs found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Reset Filters
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  {jobs.map(job => (
                    <JobCard 
                      key={job._id}
                      job={job}
                      expandedJob={expandedJob}
                      toggleJobExpand={toggleJobExpand}
                      savedJobs={savedJobs}
                      toggleSaveJob={toggleSaveJob}
                    />
                  ))}
                </motion.div>
              )}

              {jobs.length > 0 && (
                <Pagination 
                  page={page}
                  totalPages={totalPages}
                  setPage={setPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Jobs;