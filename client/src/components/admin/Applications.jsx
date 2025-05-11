import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  FiSearch,
  FiMail,
  FiSettings,
  FiRefreshCw,
  FiX,
  FiCheckCircle,
  FiKey,
  FiUserPlus,
} from "react-icons/fi";
import api from "../../utils/axios";
import "react-toastify/dist/ReactToastify.css";

const generatePassword = (length = 10) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join("");
};

const ApplicationForm = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await api("/admin/companies");
        setCompanies(data.companies);
        setFilteredCompanies(data.companies);
        setLoading(false);
      } catch {
        toast.error("Failed to fetch companies");
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const filtered = companies?.filter((company) =>
      company.companyName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [search, companies]);

  const handleSubmit = async () => {
    try {
      const response = await api.patch("/admin/application", {
        email,
        password,
        details: selectedCompany,
      });

      if (response?.data?.success) {
        toast.success("Company verified successfully!");
        setSelectedCompany(null);
        setEmail("");
        setPassword("");
      } else {
        toast.error("Failed to verify company.");
      }
    } catch {
      toast.error("An error occurred during verifying company.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full md:w-96 pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search by company name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center text-gray-500 text-lg">
          <FiRefreshCw className="animate-spin mr-2" />
          Loading companies...
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg bg-white">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  <FiSettings className="inline mr-2" />
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  <FiKey className="inline mr-2" />
                  Industry
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-start">
                  <FiUserPlus className="inline-block mr-2" />
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies?.map((company) => (
                <tr key={company._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    {company.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.company?.industry ?? "N/A"}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedCompany(company)}
                      className="flex items-center justify-center gap-2 text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md shadow"
                    >
                      <FiSettings />
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-lg relative backdrop-blur-md">
            <button
              onClick={() => setSelectedCompany(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
              aria-label="Close modal"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
              {selectedCompany.companyName} – Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
              <p><strong>Industry:</strong> {selectedCompany.company?.industry ?? "N/A"}</p>
              <p><strong>Email:</strong> {selectedCompany.companyEmail}</p>
              <p><strong>Website:</strong> {selectedCompany.company?.website ?? "N/A"}</p>
              <p><strong>Address:</strong> {selectedCompany.company?.address ?? "N/A"}</p>
              <p><strong>State:</strong> {selectedCompany.company?.state ?? "N/A"}</p>
              <p><strong>Country:</strong> {selectedCompany.company?.country ?? "N/A"}</p>
            </div>

            <div className="mb-6">
              <strong>Description:</strong>
              <p className="text-sm mt-2">{selectedCompany.company?.description ?? "No description available."}</p>
            </div>

            {!selectedCompany.password && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FiUserPlus />
                  Create Company's Credentials
                </h3>
                <div className="mb-4 flex">
                  <input
                    type="text"
                    value={password}
                    readOnly
                    className="flex-1 px-4 py-2 border rounded-l-md bg-gray-100 text-sm"
                  />
                  <button
                    onClick={() => setPassword(generatePassword())}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md text-sm flex items-center gap-1"
                  >
                    <FiRefreshCw />
                    Generate
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm">Company's Email</label>
                  <div className="flex items-center">
                    <span className="px-3 bg-gray-100 border border-r-0 rounded-l-md">
                      <FiMail />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="recruiter@example.com"
                      className="w-full px-4 py-2 border rounded-r-md text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm shadow-sm flex items-center gap-2"
                  >
                    <FiCheckCircle />
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
};

export default ApplicationForm;
