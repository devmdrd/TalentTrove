import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaEye, FaComments } from "react-icons/fa";
import api from "../../utils/axios";
import Header from "../../components/company/Header";
import Footer from "../../components/company/Footer";
import CandidateProfileModal from "../../components/company/CandidateProfileModal";
import SkillTestResultModal from "../../components/company/SkillTestResultModal";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState("applications");
  const [data, setData] = useState({
    job: {},
    skillTest: {},
    applications: [],
  });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedJob, setSelectedJob] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const handleViewResults = (job) => {
    setSelectedJob(job);
    setShowResultModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/company/jobs/${id}/details`);
        setData({
          job: res.data.job,
          skillTest: res.data.skillTest,
          applications: res.data.applications,
        });
      } catch (err) {
        console.error("Failed to fetch job details:", err);
      }
    };

    fetchData();
  }, [id]);

  const { job, applications, skillTest } = data;

  const filteredApplications = statusFilter === "all" 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await api.put(`/company/jobs/${applicationId}/status`, { status: newStatus });
      const updatedApplications = applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      );
      setData({ ...data, applications: updatedApplications });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const openModal = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <span className="text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {job.location}
                </span>
                <span className="text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {new Date(job.lastDateToApply).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                {job.jobType}
              </span>
              <span className="ml-2 inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                ₹{job.salary?.min} - ₹{job.salary?.max}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {["applications", "job-info", "skill-test"].map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  tab === item 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.replace("-", " ")}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {tab === "applications" && (
            <div>
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Applications ({filteredApplications.length})</h3>
                <div className="flex space-x-2">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              {filteredApplications.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                  <p className="mt-1 text-sm text-gray-500">No candidates match the selected filter.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredApplications.map((app, i) => (
                    <div key={i} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {app.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{app.user?.name}</h4>
                            <p className="text-sm text-gray-500">{app.user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-500">{app.user?.mobile}</div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            app.status === "pending" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : app.status === "accepted" 
                                ? "bg-green-100 text-green-800" 
                                : app.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}>
                            {app.status}
                          </span>
                          <button
                            onClick={() => openModal(app)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                          >
                            View Profile
                          </button>
                          {app.isTestCompleted && (
                            <>
                              <button
                                onClick={() => handleViewResults(app)}
                                className="p-2 text-white bg-green-500 rounded-full shadow hover:bg-green-600"
                                title="View Test Result"
                              >
                                <FaEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => navigate(`/company/${app.company}/chat/${app.user._id}`)}
                                className="p-2 text-white bg-purple-500 rounded-full shadow hover:bg-purple-600"
                                title="Chat"
                              >
                                <FaComments className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "job-info" && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Job Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Description</h4>
                  <p className="text-gray-700 mb-6">{job.description}</p>
                  
                  <h4 className="text-md font-medium text-gray-900 mb-4">Skills Required</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skillsRequired?.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Job Overview</h4>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Experience</span>
                        <span className="font-medium">{job.experienceRequired}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Job Type</span>
                        <span className="font-medium">{job.jobType}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Open Positions</span>
                        <span className="font-medium">{job.numberOfPosts}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Salary</span>
                        <span className="font-medium">₹{job.salary?.min} - ₹{job.salary?.max}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Last Date</span>
                        <span className="font-medium">{new Date(job.lastDateToApply).toLocaleDateString()}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "skill-test" && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">{skillTest?.testName || "No Skill Test Assigned"}</h3>
                <p className="text-gray-600 mt-1">
                  Time Limit: {skillTest?.timeLimit} minutes
                </p>
              </div>

              {skillTest?.questions?.length > 0 ? (
                <div className="space-y-6">
                  {skillTest.questions.map((q, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">
                        <span className="text-blue-600">Q{idx + 1}:</span> {q.question}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {q.options.map((opt, i) => (
                          <li
                            key={i}
                            className={`px-3 py-2 rounded-md ${
                              i === q.correctAnswer
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-white border border-gray-200"
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="mr-2">{String.fromCharCode(65 + i)}.</span>
                              {opt}
                              {i === q.correctAnswer && (
                                <svg className="ml-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No questions available</h3>
                  <p className="mt-1 text-sm text-gray-500">Add questions to create a skill test for this job.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {isModalOpen && selectedCandidate && (
        <CandidateProfileModal
          candidate={selectedCandidate}
          onClose={closeModal}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
      {showResultModal && (
        <SkillTestResultModal
          job={selectedJob}
          onClose={() => setShowResultModal(false)}
        />
      )}
    </div>
  );
}

export default JobDetails;