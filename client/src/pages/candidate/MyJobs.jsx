import React, { useEffect, useState } from 'react';
import api, { STATIC_URL } from "../../utils/axios";
import { FaCheckCircle, FaRegClock, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import { MdOutlineWork, MdLocationOn, MdOutlinePendingActions } from 'react-icons/md';
import { AiOutlineCalendar, AiOutlineDollarCircle } from 'react-icons/ai';
import { RiProgress5Line } from 'react-icons/ri';
import Header from '../../components/candidate/Header';
import Footer from '../../components/candidate/Footer';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
  pending: {
    icon: <MdOutlinePendingActions className="text-yellow-500" />,
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pending Review'
  },
  'in-progress': {
    icon: <RiProgress5Line className="text-blue-500" />,
    color: 'bg-blue-100 text-blue-800',
    label: 'In Progress'
  },
  accepted: {
    icon: <FaRegCheckCircle className="text-green-500" />,
    color: 'bg-green-100 text-green-800',
    label: 'Accepted'
  },
  rejected: {
    icon: <FaRegTimesCircle className="text-red-500" />,
    color: 'bg-red-100 text-red-800',
    label: 'Not Selected'
  }
};

const MyJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await api.get('/applied-jobs');
        setAppliedJobs(response.data.appliedJobs);
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const filteredJobs = activeFilter === 'all' 
    ? appliedJobs 
    : appliedJobs.filter(job => job.status === activeFilter);

  const LoadingSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-lg text-gray-600">
              Track the status of your job applications in one place
            </p>
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
            >
              All Applications
            </button>
            {Object.entries(statusConfig).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeFilter === key ? statusConfig[key].color + ' border border-transparent' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
              >
                {statusConfig[key].icon}
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <FaRegClock className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {activeFilter === 'all' ? "No applications yet" : `No ${statusConfig[activeFilter]?.label} applications`}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {activeFilter === 'all' 
                  ? "You haven't applied to any jobs yet. Start your job search today!" 
                  : `You don't have any ${statusConfig[activeFilter]?.label.toLowerCase()} applications at the moment.`}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map(({ applicationId, status, isTestCompleted, appliedAt, job, hasTest }) => (
                <div key={applicationId} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 relative group">
                  <div className={`absolute -top-0 -right-0 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[status]?.color} flex items-center gap-1`}>
                    {statusConfig[status]?.icon}
                    {statusConfig[status]?.label}
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    {job.company.logo ? (
                      <img
                        src={`${STATIC_URL}/public/${job.company.logo}`}
                        alt={job.company.name}
                        className="w-12 h-12 object-contain rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                        <MdOutlineWork className="text-xl" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company.name}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <MdLocationOn className="text-gray-500 flex-shrink-0" /> 
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdOutlineWork className="text-gray-500 flex-shrink-0" /> 
                      <span>{job.jobType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AiOutlineDollarCircle className="text-gray-500 flex-shrink-0" /> 
                      <span>₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <AiOutlineCalendar />
                      Applied {new Date(appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    {status === 'accepted' && (
                      hasTest ? (
                        isTestCompleted ? (
                          <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded">
                            Test Already Taken
                          </span>
                        ) : (
                          <button
                            onClick={() => navigate(`/skill-test/${applicationId}`)}
                            className="text-blue-600 flex items-center gap-1 text-xs font-medium bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition"
                          >
                            <RiProgress5Line /> Take Skill Test
                          </button>
                        )
                      ) : null
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyJobs;