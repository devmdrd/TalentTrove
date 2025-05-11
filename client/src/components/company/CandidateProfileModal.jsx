import React, { useState } from "react";
import { STATIC_URL } from "../../utils/axios";

const CandidateProfileModal = ({ candidate, onClose, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(candidate.status);

  const handleStatusChange = async () => {
    await onStatusUpdate(candidate._id, selectedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div 
            className="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity" 
            onClick={onClose}
          ></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-middle bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {candidate.user?.name}'s Profile
                </h3>
                <p className="mt-1 text-gray-500">Application details and candidate information</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 space-y-6">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-4xl font-bold mb-4 shadow-inner">
                    {candidate.user?.name?.charAt(0)}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">{candidate.user?.name}</h4>
                  <p className="text-center text-gray-600 mt-2">{candidate.user?.candidateProfile?.about}</p>
                </div>
                
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                  <h5 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h5>
                  <div className="flex items-start text-gray-600 space-y-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{candidate.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">{candidate.user?.mobile}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h5 className="font-semibold text-gray-900 border-b pb-2 mb-3">Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {candidate.user?.candidateProfile?.skills?.map((skill, i) => (
                      <span 
                        key={i} 
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full font-medium"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="col-span-2 space-y-6">
                <div className="p-5 bg-gray-50 rounded-xl">
                  <h5 className="font-semibold text-gray-900 border-b pb-2 mb-4">Experience</h5>
                  {candidate.user?.candidateProfile?.experiencesId?.length > 0 ? (
                    candidate.user?.candidateProfile?.experiencesId?.map((exp, i) => (
                      <div key={i} className="mb-5 last:mb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h6 className="font-medium text-gray-900">{exp.title}</h6>
                            <p className="text-gray-700">{exp.company_name}</p>
                          </div>
                          <span className="text-sm bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                            {new Date(exp.start_date).toLocaleDateString()} - {exp.is_currently_working ? "Present" : new Date(exp.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No experience listed</p>
                  )}
                </div>
                
                <div className="p-5 bg-gray-50 rounded-xl">
                  <h5 className="font-semibold text-gray-900 border-b pb-2 mb-4">Education</h5>
                  {candidate.user?.candidateProfile?.educationsId?.length > 0 ? (
                    candidate.user?.candidateProfile?.educationsId?.map((edu, i) => (
                      <div key={i} className="mb-5 last:mb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h6 className="font-medium text-gray-900">{edu.degree}</h6>
                            <p className="text-gray-700">{edu.institution}</p>
                          </div>
                          <span className="text-sm bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                            {new Date(edu.start_date).toLocaleDateString()} - {edu.is_currently_studying ? "Present" : new Date(edu.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{edu.field_of_study}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No education listed</p>
                  )}
                </div>
                
                <div className="p-5 bg-gray-50 rounded-xl">
                  <h5 className="font-semibold text-gray-900 border-b pb-2 mb-4">Projects</h5>
                  {candidate.user?.candidateProfile?.projectsId?.length > 0 ? (
                    candidate.user?.candidateProfile?.projectsId?.map((proj, i) => (
                      <div key={i} className="mb-5 last:mb-0">
                        <div className="flex justify-between items-start">
                          <h6 className="font-medium text-gray-900">{proj.name}</h6>
                          <span className="text-sm bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                            {new Date(proj.start_date).toLocaleDateString()} - {new Date(proj.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{proj.description}</p>
                        {proj.url && (
                          <a 
                            href={proj.url} 
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2 transition-colors"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            View Project
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No projects listed</p>
                  )}
                </div>
                
                {candidate.user?.candidateProfile?.resumeOrCv && (
                  <div className="flex justify-end">
                    <a
                      href={`${STATIC_URL}/public/${candidate.user?.candidateProfile?.resumeOrCv}`} 
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 shadow-sm px-4 py-2.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                    >
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Resume
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 sm:px-6 sm:flex sm:flex-row-reverse">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5 px-3 border"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={handleStatusChange}
                  className="inline-flex items-center justify-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Update Status
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileModal;