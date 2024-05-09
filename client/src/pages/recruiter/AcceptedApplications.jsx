import React, { useEffect, useState } from "react";
import Header from "../../components/recruiter/Header";
import { AiOutlineMessage } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getAcceptedApplications } from "../../services/recruiterServices";

const AcceptedApplications = () => {
  const [acceptedApplications, setAcceptedApplications] = useState([]);

  useEffect(() => {
    const fetchAcceptedApplications = async () => {
      try {
        const response = await getAcceptedApplications();
        if (response && response.acceptedApplications) {
          setAcceptedApplications(response.acceptedApplications);
        }
      } catch (error) {
        console.error("Error fetching accepted applications:", error);
      }
    };

    fetchAcceptedApplications();
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Accepted Applications
        </h1>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {acceptedApplications.map((application) => (
              <tr key={application._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {application.candidateId.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {application.candidateId.mobile}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Accepted
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/recruiter/chat/${application.candidateId._id}`}
                    className="text-blue-500 underline"
                  >
                    <AiOutlineMessage className="inline-block mr-2" /> Message
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AcceptedApplications;
