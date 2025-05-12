import React, { useState, useEffect } from "react";
import api from '../../utils/axios.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch, FiRefreshCw } from "react-icons/fi";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/admin/companies');
        setCompanies(response.data.companies);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching companies");
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.company.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full md:w-96 pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search by Company Name or Location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && (
        <div className="text-center text-lg text-gray-500 flex items-center justify-center">
          <FiRefreshCw className="animate-spin mr-2" />
          <p>Loading companies...</p>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">ID</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Company Name</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Size</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Industry</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Website</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Location</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">State</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Country</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCompanies.map((company, index) => (
              <tr key={company._id} className="bg-white hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{company.companyName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{company.companyEmail}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{company.company.size}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{company.company.industry}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <a href={company.company.website} target="_blank" rel="noopener noreferrer">
                    {company.company.website}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{company.company.address}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{company.company.state}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{company.company.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Companies;
