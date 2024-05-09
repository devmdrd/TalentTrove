import React, { useEffect, useState } from "react";
import Header from "../../components/recruiter/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  acceptTest,
  getResults,
  rejectTest,
} from "../../services/recruiterServices";

const SkillTestResults = () => {
  const [skillTests, setSkillTests] = useState([]);

  useEffect(() => {
    const fetchSkillTests = async () => {
      try {
        const response = await getResults();
        setSkillTests(response);
      } catch (error) {
        console.error("Error fetching skill tests:", error);
      }
    };

    fetchSkillTests();
  }, []);

  const handleAccept = async (applicationId) => {
    try {
      setSkillTests((prevTests) => {
        return prevTests.map((test) => {
          if (test.application._id === applicationId) {
            return {
              ...test,
              application: { ...test.application, status: "accepted" },
            };
          }
          return test;
        });
      });
      toast.success("Test accepted successfully");
      const response = await acceptTest({
        applicationId: applicationId,
      });
      console.log(response.message); 
    } catch (error) {
      console.error("Error accepting test:", error);
      setSkillTests((prevTests) => {
        return prevTests.map((test) => {
          if (test.application._id === applicationId) {
            return {
              ...test,
              application: { ...test.application, status: "in-progress" },
            };
          }
          return test;
        });
      });
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const response = await rejectTest({
        applicationId: applicationId,
      });
      console.log(response.message); 
      toast.error("Test rejected");
      console.log("Updated test data:", response.data.updatedTestData);
      setSkillTests((prevTests) => {
        const updatedTests = prevTests.map((test) => {
          if (test.application._id === applicationId) {
            return {
              ...test,
              application: { ...test.application, status: "rejected" },
            };
          }
          return test;
        });
        return updatedTests;
      });
    } catch (error) {
      console.error("Error rejecting test:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Skill Test Results
        </h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Test Name</th>
              <th className="px-4 py-2">Candidate Name</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {skillTests.map((testResult, index) => (
              <tr key={index} className="bg-white border-b">
                <td className="px-4 py-2">{testResult.skillTest.testName}</td>
                <td className="px-4 py-2">{testResult.candidate.name}</td>
                <td className="px-4 py-2">{testResult.score}%</td>
                <td className="px-4 py-2">
                  {testResult.application.isAccepted ? (
                    <span className="bg-green-500 text-white font-bold py-1 px-2 rounded">
                      Accepted
                    </span>
                  ) : (
                    <>
                      {testResult.application.status === "completed" ? (
                        <span className="bg-red-500 text-white font-bold py-1 px-2 rounded">
                          Rejected
                        </span>
                      ) : (
                        <div className="flex justify-end">
                          <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                            onClick={() =>
                              handleAccept(testResult.application._id)
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            onClick={() =>
                              handleReject(testResult.application._id)
                            }
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default SkillTestResults;
