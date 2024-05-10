import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  getProfile,
  createApplication,
} from "../../services/candidateServices";
import Header from "../../components/candidate/Header";
import Footer from "../../components/candidate/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyId = queryParams.get("companyId");
  const jobId = queryParams.get("jobId");

  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setFormData(response);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handlePreview = () => {
    if (formData.resumeOrCv) {
      window.open(`https://talenttrove-9jlw.onrender.com/${formData.resumeOrCv}`, "_blank");
    } else {
      alert("No resume uploaded");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resumeOrCv) {
      toast.error("Resume required");
      return;
    }
    try {
      const response = await createApplication(companyId, jobId);
      if (response.message) {
        navigate("/success");
      }
    } catch (error) {
      console.error("Error creating application:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Profile Verification Form
            </h2>
            <Link to="/profile" className="m-2">
              <p className="text-sm text-right cursor-pointer text-blue-700">
                My Profile
              </p>
            </Link>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  autoComplete="name"
                  readOnly
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  required
                  readOnly
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="mobile" className="sr-only">
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  autoComplete="tel"
                  required
                  readOnly
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Mobile Number"
                />
              </div>
            </div>
            <div>
              <label className="sr-only" htmlFor="resume">
                Uploaded Resume
              </label>
              {formData.resumeOrCv ? (
                <>
                  <p className="text-gray-700 mt-2">Uploaded Resume:</p>
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="text-sm text-gray-500 mt-1 cursor-pointer ml-2"
                  >
                    Preview
                  </button>
                </>
              ) : (
                <p className="text-red-500 mt-2">Resume required</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default VerifyProfile;
