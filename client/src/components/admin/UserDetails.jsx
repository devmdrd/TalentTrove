import React, { useState, useEffect } from "react";
import { getCandidates, toggleCandidateBlockStatus } from "../../services/adminServices";

const UserDetails = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getCandidates();
        setCandidates(response.candidates);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleCandidateToggleBlock = async (candidateId) => {
    try {
      console.log("cvhbjnk")
      const response = await toggleCandidateBlockStatus(candidateId);
      console.log(response)
      if (response.success) {
        setCandidates((prevCandidates) =>
          prevCandidates.map((candidate) =>
            candidate._id === candidateId
              ? { ...candidate, isBlocked: !candidate.isBlocked }
              : candidate
          )
        );
      }
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-6 py-3 text-left">ID</th>
          <th className="px-6 py-3 text-left">Name</th>
          <th className="px-6 py-3 text-left">Email</th>
          <th className="px-6 py-3 text-left">Status</th>
          <th className="px-6 py-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {candidates?.map((user, index) => (
          <tr key={user._id} className="bg-white border border-gray-200">
            <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ${
                  user.isBlocked
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {user?.isBlocked ? "Blocked" : "Unblocked"}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap flex justify-center">
              <button
                onClick={() => handleCandidateToggleBlock(user._id)}
                className={`px-4 py-2 rounded-md ${
                  user.isBlocked
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {user.isBlocked ? "Unblock" : "Block"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserDetails;
