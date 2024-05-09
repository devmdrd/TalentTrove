import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobInfo from "./JobInfo";
import CompanyInfo from "./CompanyInfo";
import { getJobDetails } from "../../../services/candidateServices";
import Header from "../Header";
import Footer from "../Footer";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({});

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await getJobDetails(jobId);
        setCompanyData(response.company);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchCompanyDetails();
  }, [jobId]);

  const handleApply = () => {
    const queryString = `?companyId=${companyData._id}&jobId=${jobId}`;
    navigate(`/verify-profile${queryString}`);
  };

  return (
    <>
      <Header />

      <div className="container mx-auto py-8 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
          <div className="mb-6">
            <JobInfo jobId={jobId} />
          </div>

          <div className="mb-6">
            <CompanyInfo company={companyData} />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleApply}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded focus:outline-none transition duration-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobDetailsPage;
