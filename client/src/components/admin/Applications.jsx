import React, { useEffect, useState } from "react";
import { getAllCompany, createRecruiter } from "../../services/adminServices";

const generatePassword = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

const ApplicationForm = () => {
  const [formData, setFormData] = useState([]);
  const [details, setDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await getAllCompany();
        setFormData(response.allCompanies);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompany();
  }, []);

  const handleViewDetails = (id) => {
    setShowModal(true);
    const detail = formData.find((company) => company._id === id);
    setDetails(detail);
  };

  const handleSubmit = async () => {
    try {
      setShowModal(false);
      const response = await createRecruiter({ email, password, details });
      if (response.success) {
        alert("Recruiter created successfully.");
      } else {
        alert("Signup failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred while signing up. Please try again later.");
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(10);
    setPassword(newPassword);
  };

  const handleBack = () => {
    setShowModal(false);
  };

  return (
    <div className="container mx-auto max-w-md mt-10">
      <div className="border rounded-md p-4 mb-4">
        <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Company Name</th>
              <th className="px-4 py-3 text-left">Industry</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formData.map((company, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50">
                <td className="border px-4 py-3">{company.companyName}</td>
                <td className="border px-4 py-3">{company.companyIndustry}</td>
                <td className="border px-4 py-3">
                  <button
                    onClick={() => handleViewDetails(company._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md focus:outline-none shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Company Details
                </h3>
                <button
                  onClick={handleBack}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  Back
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    Company Name:
                  </label>
                  <p>
                    <b>{details.companyName}</b>
                  </p>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    Industry:
                  </label>
                  <p>{details.companyIndustry}</p>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    Address:
                  </label>
                  <p className="text-gray-900">{details.companyAddress}</p>
                </div>
                <br />
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    State:
                  </label>
                  <p>{details.companyState}</p>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    Country:
                  </label>
                  <p>{details.companyCountry}</p>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    Email:
                  </label>
                  <p>{details.companyEmail}</p>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    Website:
                  </label>
                  <p>{details.companyWebsite}</p>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">
                  Description:
                </label>
                <p className="w-full">{details.companyDescription}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Create Credentials
                </h3>
                <div className="mb-4 flex items-center border rounded-lg overflow-hidden">
                  <input
                    type="text"
                    placeholder="Auto-generated Password"
                    value={password}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-100 rounded-l-lg focus:outline-none"
                  />
                  <button
                    onClick={handleGeneratePassword}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-r-lg focus:outline-none"
                  >
                    Generate
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationForm;
