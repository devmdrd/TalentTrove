import React, { useEffect, useState } from "react";
import Header from "../../components/candidate/Header";
// import Footer from "../../components/candidate/Footer";
import { appliedJobs } from "../../services/candidateServices";
import { Link } from "react-router-dom";

const MyJobs = () => {
  const [jobsData, setJobsData] = useState([]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await appliedJobs();
        setJobsData(response);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, []);

  return (
    <>
      <Header />

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">My Jobs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobsData?.map((job) => (
            <div key={job.jobId._id} className="bg-white rounded-lg shadow-md p-2 relative">
              <img
                src="https://via.placeholder.com/50x50"
                alt="Company Logo"
                className="h-8 w-8 rounded-full absolute top-2 left-2"
              />
              <div className="pl-12"> {/* Add left padding for content */}
                <h2 className="text-xl font-bold">{job.jobId.title}</h2>
                <p className="text-gray-600">{job.companyId.name}</p>
                <p className="text-gray-600">{job.companyId.state}, {job.companyId.country}</p>
              </div>
              <span
                className={`text-sm font-semibold absolute top-2 right-2 ${
                  job.status === "pending" ? "bg-yellow-100 text-yellow-900" :
                  job.status === "in-progress" ? "bg-blue-100 text-blue-900" :
                  job.status === "completed" ? "bg-green-100 text-green-900" :
                  "bg-gray-100 text-gray-900"
                } px-2 py-1 rounded-md`}
              >
                {job.status}
              </span>
              <div className="absolute bottom-2 right-2">
                <Link
                  to={`/job-status/${job._id}`}
                  className="text-blue-500 hover:underline focus:outline-none"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default MyJobs;
