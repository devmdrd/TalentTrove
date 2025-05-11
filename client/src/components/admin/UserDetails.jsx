import React, { useState, useEffect } from "react";
import api from '../../utils/axios.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch, FiUser, FiMail, FiLock, FiUnlock, FiRefreshCw, FiActivity, FiSettings } from "react-icons/fi";

const UserDetails = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setCandidates(response.data.users);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  const handleCandidateToggleBlock = async (candidateId, currentBlockStatus) => {
    try {
      const { data } = await api.patch(`/admin/users/${candidateId}`, {
        isBlocked: !currentBlockStatus,
      });

      setCandidates(prev =>
        prev.map(candidate =>
          candidate._id === candidateId ? { ...candidate, isBlocked: data.user.isBlocked } : candidate
        )
      );
      toast.success(`User has been ${data.user.isBlocked ? 'Blocked' : 'Unblocked'}`);
    } catch {
      toast.error("Failed to toggle block status");
    }
  };

  const filteredCandidates = candidates.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Search bar */}
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full md:w-96 pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search by Name or Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && (
        <div className="text-center text-lg text-gray-500 flex items-center justify-center">
          <FiRefreshCw className="animate-spin mr-2" />
          <p>Loading users...</p>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                <div className="flex items-center">
                  <FiUser className="mr-2" /> ID
                </div>
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                <div className="flex items-center">
                  <FiUser className="mr-2" /> Name
                </div>
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                <div className="flex items-center">
                  <FiMail className="mr-2" /> Email
                </div>
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                <div className="flex items-center">
                  <FiActivity className="mr-2" /> Status
                </div>
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                <div className="flex items-center">
                  <FiSettings className="mr-2" /> Action
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCandidates?.map((user, index) => (
              <tr key={user._id} className="bg-white hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${user.isBlocked ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                  >
                    {user.isBlocked ? (
                      <>
                        <FiLock className="mr-1" /> Blocked
                      </>
                    ) : (
                      <>
                        <FiUnlock className="mr-1" /> Active
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <button
                    onClick={() => handleCandidateToggleBlock(user._id, user.isBlocked)}
                    className={`px-4 py-2 text-white rounded-md flex items-center ${user.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                  >
                    {user.isBlocked ? (
                      <>
                        <FiUnlock className="mr-1" /> Unblock
                      </>
                    ) : (
                      <>
                        <FiLock className="mr-1" /> Block
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UserDetails;