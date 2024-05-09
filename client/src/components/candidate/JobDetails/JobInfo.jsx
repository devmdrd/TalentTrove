import React, { useState, useEffect } from "react";
import { getJobDetails } from "../../../services/candidateServices";

const JobInfo = ({ jobId }) => {
  const [jobData, setJobData] = useState({});

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await getJobDetails(jobId);
        setJobData(response.job);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchCompanyDetails();
  }, [jobId]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{jobData.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Job Description:</span>{" "}
            {jobData.description}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Experience Required:</span>{" "}
            {jobData.experienceRequired}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Employment Type:</span>{" "}
            {jobData.jobType}
          </p>
        </div>
        <div>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Location:</span> {jobData.location}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Salary:</span> {jobData.salary}
          </p>
          <div>
            <span className="font-semibold">Skills:</span>{" "}
            <div className="flex flex-wrap">
              {jobData?.skillsRequired?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm mr-2 mb-2"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobInfo;
