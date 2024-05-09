import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { getSkillTests, deleteSkillTest } from '../../services/recruiterServices';

const SkillTestsAdded = () => {
  const [skillTests, setSkillTests] = useState([]);

  useEffect(() => {
    fetchSkillTests();
  }, []);

  const fetchSkillTests = async () => {
    try {
      const tests = await getSkillTests();
      setSkillTests(tests);
    } catch (error) {
      console.error('Error fetching skill tests:', error);
    }
  };

  const handleDeleteTest = async (testId) => {
    try {
      await deleteSkillTest(testId);
      fetchSkillTests();
    } catch (error) {
      console.error('Error deleting skill test:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Skill Tests</h1>

      <div className="mb-4">
        <Link to="/recruiter/create-test" className="bg-blue-500 text-white px-3 py-1 rounded-md">
          Add Skill Test
        </Link>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {skillTests?.map((test) => (
            <tr key={test._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link to={`/recruiter/test-details/${test._id}`} className="text-blue-500 hover:underline">{test.testName}</Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                  onClick={() => handleDeleteTest(test._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkillTestsAdded;
