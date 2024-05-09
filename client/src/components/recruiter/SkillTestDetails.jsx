import React, { useState, useEffect } from "react";
import { getSkillTestsById } from "../../services/recruiterServices";
import { useParams } from "react-router-dom";

function SkillTestDetails() {
  const {id} = useParams();
  const [testDetails, setTestDetails] = useState(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await getSkillTestsById(id)
        setTestDetails(response);
      } catch (error) {
        console.error('Error fetching test details:', error);
      }
    };

    fetchTestDetails();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Skill Test Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Question
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Options
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Correct Answer
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testDetails?.questions?.map((question, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                  {question.question}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                  <ul>
                    {question.options.map((option, optionIndex) => (
                      <li key={optionIndex}>{optionIndex + 1}. {option}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-green-500 font-medium">
                  {question.correctAnswer}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SkillTestDetails;
