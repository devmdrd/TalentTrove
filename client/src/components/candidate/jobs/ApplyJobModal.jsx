import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import api, { STATIC_URL } from '../../../utils/axios';
import {
  FiX, FiFileText, FiAlertCircle, FiCheckCircle, FiBriefcase,
  FiDollarSign, FiMapPin, FiCalendar, FiClock, FiEdit2, FiExternalLink
} from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


Modal.setAppElement('#root');

const ApplyJobModal = ({ isOpen, onRequestClose, job }) => {
  const [step, setStep] = useState(1);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorFetchingProfile, setErrorFetchingProfile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [profileErrors, setProfileErrors] = useState([]);
    
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && step === 2) fetchUserProfile();
    if (!isOpen) {
      setStep(1);
      setUserProfile(null);
      setCoverLetter('');
      setProfileErrors([]);
    }
  }, [isOpen, step]);

  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await api.get('/profile');
      setUserProfile(response.data);
      validateProfile(response.data);
      setLoadingProfile(false);
    } catch (error) {
      setErrorFetchingProfile('Failed to load profile. Please try again.');
      setLoadingProfile(false);
    }
  };

  const validateProfile = (profile) => {
    const errors = [];
    if (!profile?.name) errors.push('Full name is required');
    if (!profile?.email) errors.push('Email address is required');
    if (!profile?.mobile) errors.push('Mobile number is required');
    if (!profile?.resume) errors.push('Resume/CV is required in your profile');
    setProfileErrors(errors);
    return errors.length === 0;
  };

  const handleNextStep = () => setStep(2);
  const handlePreviousStep = () => setStep(1);

  const handleSubmit = async () => {
    if (profileErrors.length > 0) {
      toast.error('Please complete your profile before applying');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('jobId', job._id || job.id);
      formData.append('coverLetter', coverLetter);
      await api.post('/job', formData);

      toast.success('Application submitted successfully!');

      setTimeout(() => {
        onRequestClose();
      }, 2500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    }
  };
  
  const renderProfileField = (label, value, required = false) => (
    <div className={`p-3 rounded-lg border text-sm ${required && !value ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-xs text-gray-500">{label}</h4>
          <p className={`mt-0.5 ${value ? 'text-gray-800' : 'text-red-500'}`}>
            {value || 'Not provided'}
          </p>
        </div>
        <div className="ml-2">
          {required && !value ? <FiAlertCircle className="text-red-500 text-lg" /> : <FiCheckCircle className="text-green-500 text-lg" />}
        </div>
      </div>
    </div>
  );

  return (
    <>
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Job Application Modal"
      className="modal-content bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-auto p-0 relative overflow-hidden"
      overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
      closeTimeoutMS={200}
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600" />

      <button 
        onClick={onRequestClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
      >
        <FiX className="h-5 w-5" />
      </button>

      <div
        className="p-6 max-h-[75vh] overflow-y-auto mt-6"
        style={{
            scrollbarWidth: 'none',        
            msOverflowStyle: 'none'        
        }}
        >
        <style>{`
            div::-webkit-scrollbar {
            display: none;          
            }
        `}</style>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {step === 1 ? 'Job Application' : 'Complete Your Application'}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {step === 1 ? 'Review the job details before applying' : 'Verify your information and submit'}
        </p>

        <div className="mb-4">
          <div className="flex items-center w-full">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className={`${step >= 1 ? 'text-blue-600 font-medium' : ''}`}>Job Details</span>
            <span className={`${step >= 2 ? 'text-blue-600 font-medium' : ''}`}>Your Profile</span>
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start mb-4">
                {job?.company?.logo && (
                  <div className="mr-4 flex-shrink-0">
                    <img 
                      src={`${STATIC_URL}/public/${job?.company?.logo}`} 
                      alt={job?.company?.name} 
                      className="h-12 w-12 object-contain rounded border"
                      onError={(e) => {e.target.src = '/default-company-logo.png'}}
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{job?.title}</h3>
                  <p className="text-blue-600 text-sm font-medium">{job?.company?.name}</p>
                  <div className="flex flex-wrap items-center mt-2 gap-2 text-xs">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full flex items-center">
                      <FiBriefcase className="mr-1" /> {job?.jobType}
                    </span>
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center">
                      <FiMapPin className="mr-1" /> {job?.location}
                    </span>
                    <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full flex items-center">
                      <FiDollarSign className="mr-1" /> ₹{job?.salary?.min.toLocaleString()} - ₹{job?.salary?.max.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <h4 className="text-gray-500">Experience Required</h4>
                  <p className="text-gray-900 font-medium">{job?.experienceRequired}</p>
                </div>
                <div>
                  <h4 className="text-gray-500">Application Deadline</h4>
                  <p className="text-gray-900 font-medium">
                    {new Date(job?.lastDateToApply).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-1">Job Description</h4>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{job?.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Required Skills</h4>
                <div className="flex flex-wrap gap-2 text-sm">
                  {job?.skillsRequired?.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-0.5 rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button onClick={onRequestClose} className="px-5 py-2 text-sm border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleNextStep} className="px-5 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center">
                Continue to Apply
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {loadingProfile ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
              </div>
            ) : errorFetchingProfile ? (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-600 flex items-center text-sm">
                <FiAlertCircle className="mr-2" /> {errorFetchingProfile}
              </div>
            ) : (
              <>
                <div className="border rounded-xl p-4 bg-white space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Your Profile</h3>
                   <button
                    onClick={() => navigate('/profile')}
                    className="text-blue-600 hover:underline text-sm flex items-center"
                    >
                    <FiEdit2 className="mr-1" /> Edit Profile
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {renderProfileField('Full Name', userProfile?.name, true)}
                    {renderProfileField('Email Address', userProfile?.email, true)}
                    {renderProfileField('Mobile Number', userProfile?.mobile, true)}
                    {renderProfileField(
                        'Resume/CV',
                        userProfile?.resume ? (
                        <div className="flex items-center space-x-2">
                            <span>Resume available</span>
                            <a
                            href={`${STATIC_URL}/public/${userProfile.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm inline-flex items-center hover:underline"
                            >
                            <FiExternalLink className="mr-1" /> View
                            </a>
                        </div>
                        ) : ''
                    )}
                  </div>
                  {profileErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-600 space-y-1">
                      <div className="flex items-center font-medium">
                        <FiAlertCircle className="mr-2" /> Profile Incomplete
                      </div>
                      <ul className="list-disc pl-5">
                        {profileErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="border rounded-xl p-4 bg-white">
                  <h3 className="font-semibold text-gray-900 mb-2">Cover Letter</h3>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={4}
                    className="w-full p-3 text-sm border border-gray-300 rounded-xl resize-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Optional but recommended"
                  />
                </div>

                <div className="flex justify-between">
                  <button onClick={handlePreviousStep} className="px-5 py-2 text-sm border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Back</button>
                 <button
                    onClick={handleSubmit}
                    className={`px-5 py-2 text-sm rounded-xl text-white font-medium ${
                      profileErrors.length > 0 || job?.isApplied
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={profileErrors.length > 0 || job?.isApplied}
                  >
                    {job?.isApplied ? 'Already Applied' : 'Submit Application'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
    <ToastContainer />
    </>
  );
};

export default ApplyJobModal;
