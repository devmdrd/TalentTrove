import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import api from "../../utils/axios";

import Header from "../../components/company/Header";
import Footer from "../../components/company/Footer";

import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const [quickProfileDetails, setQuickProfileDetails] = useState({
    name: "",
    email: "",
    website: "",
    industry: "",
    description: "",
    size: "",
    address: "",
    state: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuickProfileDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/company/signup", quickProfileDetails);
      if (response.data.success) {
        toast.success(response.data.message || "Signup successful!");
        setQuickProfileDetails({
          name: "",
          email: "",
          website: "",
          industry: "",
          description: "",
          size: "",
          address: "",
          state: "",
          country: "",
        });
        setTimeout(() => {
          navigate("/company/signin");
        }, 5000);
      } else {
        toast.error(response.data.message || "Signup failed.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <section className="max-w-4xl p-6 mx-auto bg-white shadow-md m-10">
        <h2 className="text-lg font-semibold text-gray-800 capitalize">
          Company Registration Form
        </h2>
        <form onSubmit={handleFormSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                Company/Organization Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={quickProfileDetails.name}
                onChange={handleInputChange}
                required
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Company/Organization Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={quickProfileDetails.email}
                onChange={handleInputChange}
                required
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-bold text-gray-700 mb-2">
                Company/Organization Website
              </label>
              <input
                id="website"
                name="website"
                type="url"
                value={quickProfileDetails.website}
                onChange={handleInputChange}
                required
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-bold text-gray-700 mb-2">
                Company Industry
              </label>
              <input
                id="industry"
                name="industry"
                type="text"
                value={quickProfileDetails.industry}
                onChange={handleInputChange}
                required
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="size" className="block text-sm font-bold text-gray-700 mb-2">
                Company Size
              </label>
              <input
                id="size"
                name="size"
                type="text"
                value={quickProfileDetails.size}
                onChange={handleInputChange}
                required
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-bold text-gray-700 mb-2">
                State
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={quickProfileDetails.state}
                onChange={handleInputChange}
                required
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-bold text-gray-700 mb-2">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                value={quickProfileDetails.country}
                onChange={handleInputChange}
                required
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                Company Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={quickProfileDetails.description}
                onChange={handleInputChange}
                required
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline resize-none"
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows="2"
                value={quickProfileDetails.address}
                onChange={handleInputChange}
                required
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline resize-none"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={() => navigate("/company/signin")}
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
              } text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </section>
      <Footer />
    </>
  );
}

export default Signup;
