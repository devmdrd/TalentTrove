import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  getApplicationsData,
  getJobById,
} from "../../services/recruiterServices";

function JobApplicationsDetails() {
  const { id } = useParams();
  const [applicationsData, setApplicationsData] = useState({
    candidates: [],
    applications: [],
  });
  const [job, setJob] = useState({});

  useEffect(() => {
    const fetchJobApplicationsData = async () => {
      try {
        // console.log("Fetching applications data...");
        const responseApplications = await getApplicationsData(id);
        // console.log("Applications Response:", responseApplications);
        const { candidates, applications } = responseApplications;
        setApplicationsData({ candidates, applications });

        // console.log("Fetching job details...");
        const responseJob = await getJobById(id);
        // console.log("Job Response:", responseJob);
        setJob(responseJob);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    console.log("Before fetchJobApplicationsData");
    fetchJobApplicationsData();
  }, [id]);

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Section - Job Applications */}
        <div className="col-span-12 md:col-span-8">
          <div className="bg-white shadow rounded-md p-6">
            <h3 className="text-lg font-semibold">
              Applications ({applicationsData.candidates.length})
            </h3>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden">
                {/* Table Headers */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody className="divide-y divide-gray-200">
                  {applicationsData.candidates.map((application, index) => {
                    const status =
                      applicationsData.applications[index]?.status ||
                      "Status N/A";
                      const applicationId = applicationsData.applications[index]?._id || null;
                    return (
                      <tr
                        key={index}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="flex items-center gap-x-3">
                            <input
                              type="checkbox"
                              className="text-blue-500 border-gray-300 rounded"
                            />
                            <div>
                              <h2 className="font-medium text-gray-800">
                                {application.name}
                              </h2>
                              <p className="text-sm font-normal text-gray-600">
                                {application.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-3 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-500 font-semibold">
                            {status}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700 whitespace-nowrap">
                          {application.mobile}
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-right whitespace-nowrap cursor-pointer hover:text-blue-800">
                          <Link
                            to={`/recruiter/applicant/${application._id}/${applicationId}`}
                            className="text-blue-600"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Right Section - Job Details */}
        <div className="col-span-12 md:col-span-4">
          <div className="shadow rounded-md bg-white sticky top-20">
            <div className="p-6">
              <h5 className="text-lg font-semibold">Job Information</h5>
            </div>
            <div className="p-6 border-t border-slate-100">
              <div>
                <h5 className="text-lg font-semibold mb-2">Job Description</h5>
                <p className="text-base text-gray-600 leading-relaxed">
                  {job.description || "Loading description..."}
                </p>
              </div>

              <div className="mt-6">
                <h5 className="text-lg font-semibold mb-2">Skills Required</h5>
                <div className="flex flex-wrap gap-2">
                  {job?.skillsRequired?.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* <div className="mt-6">
                <h5 className="text-lg font-semibold mb-2">
                  Qualifications Required
                </h5>
                <div className="flex flex-wrap gap-2">
                  {job?.qualificationsRequired?.map((qualification, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {qualification}
                    </span>
                  ))}
                </div>
              </div> */}

              <ul className="list-none divide-y divide-gray-200 mt-6">
                <li className="flex items-center justify-between py-2">
                  <span className="font-medium">Employee Type:</span>
                  <span className="text-blue-600 font-medium">
                    {job.jobType}
                  </span>
                </li>
                <li className="flex items-center justify-between py-2">
                  <span className="font-medium">Location:</span>
                  <span className="text-blue-600 font-medium">
                    {job.location}
                  </span>
                </li>
                <li className="flex items-center justify-between py-2">
                  <span className="font-medium">Experience Required:</span>
                  <span className="text-blue-600 font-medium">
                    {job.experienceRequired} years
                  </span>
                </li>
                <li className="flex items-center justify-between py-2">
                  <span className="font-medium">Number of Openings:</span>
                  <span className="text-blue-600 font-medium">
                    {job.numberOfPosts}
                  </span>
                </li>
                <li className="flex items-center justify-between py-2">
                  <span className="font-medium">Salary:</span>
                  <span className="text-blue-600 font-medium">
                    ₹ {job.salary}
                  </span>
                </li>
                <li className="flex items-center justify-between py-2">
                  <span className="font-medium">Application Deadline:</span>
                  <span className="text-blue-600 font-medium">
                    {new Date(job.lastDateToApply).toLocaleDateString()}
                  </span>
                </li>
                {/* Add more job details here */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobApplicationsDetails;
