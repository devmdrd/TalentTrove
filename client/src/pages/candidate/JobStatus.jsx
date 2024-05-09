import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchJobDetails, getSkillTestId } from "../../services/candidateServices";
import Header from "../../components/candidate/Header";
import Footer from "../../components/candidate/Footer";
import { FaCheckCircle, FaClipboardCheck, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const JobDetailsPage = () => {
  const [jobsData, setJobsData] = useState(null);
  const { applicationId } = useParams();
  const [skillTestId, setSkillTestId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchJobDetails(applicationId);
        setJobsData(response);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    fetchData();
  }, [applicationId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillTestId = await getSkillTestId(applicationId);
        setSkillTestId(skillTestId);
      } catch (error) {
        console.error("Error fetching skill test:", error);
      }
    };

    fetchData();
  }, [applicationId]);

  if (!jobsData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Application Submitted",
          icon: <FaCheckCircle />,
          color: "bg-green-500",
        };
      case "in-progress":
        return {
          label: "Skill Test Given",
          icon: <FaClipboardCheck />,
          color: "bg-blue-500",
        };
      case "completed":
        return {
          label: "Application Rejected",
          icon: <FaTimesCircle />,
          color: "bg-red-500",
        };
      default:
        return null;
    }
  };

  return (
    <>
      <Header />

      <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 grid grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{jobsData.job.title}</h1>
            <div className="flex items-center mb-4">
              <span
                className={`inline-block p-2 rounded-full mr-2 ${
                  getStatusLabel(jobsData.application.status).color
                }`}
              >
                {getStatusLabel(jobsData.application.status).icon}
              </span>
              <span className="text-lg font-bold text-gray-800">
                {getStatusLabel(jobsData.application.status).label}
              </span>
              {jobsData.application.status === "in-progress" && (
                <Link
                  to={`/skill-test/${skillTestId}/${applicationId}`}
                  className="ml-4 text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Take the Test
                </Link>
              )}
            </div>
            <h2 className="text-xl font-bold mb-2">Job Details</h2>
            <p className="text-gray-800 mb-4">{jobsData.job.description}</p>
            <h3 className="text-lg font-bold mb-2">Skills Required</h3>
            <ul className="list-disc list-inside text-gray-800 mb-4">
              {jobsData.job.skillsRequired.map((skill, index) => (
                <li key={index} className="mb-2">
                  <span className="bg-blue-100 px-2 py-1 rounded-md mr-2">
                    {skill}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600">Job Type: {jobsData.job.jobType}</p>
            <p className="text-gray-600">Salary: {jobsData.job.salary}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Company Details</h2>
            <div>
              <p className="text-gray-600 font-bold">Name:</p>
              <p className="text-gray-800">{jobsData.company.name}</p>
            </div>
            <div>
              <p className="text-gray-600 font-bold">Industry:</p>
              <p className="text-gray-800">{jobsData.company.industry}</p>
            </div>
            <div>
              <p className="text-gray-600 font-bold">Location:</p>
              <p className="text-gray-800">{jobsData.company.state}</p>
            </div>
            <div>
              <p className="text-gray-600 font-bold">Description:</p>
              <p className="text-gray-800 mt-2">
                {jobsData.company.description}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-bold">Website:</p>
              <p className="text-gray-800">
                <a
                  href={jobsData.company.website}
                  className="text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {jobsData.company.website}
                </a>
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-bold">Size:</p>
              <p className="text-gray-800">{jobsData.company.size}</p>
            </div>
            <div>
              <p className="text-gray-600 font-bold">Email:</p>
              <p className="text-gray-800">{jobsData.company.email}</p>
            </div>
            <div>
              <p className="text-gray-600 font-bold">Country:</p>
              <p className="text-gray-800">{jobsData.company.country}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobDetailsPage;
