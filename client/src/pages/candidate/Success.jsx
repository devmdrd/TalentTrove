import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-green-900">Success!</h2>
          <Link to="/job-feed" className="text-blue-500 hover:underline">
            My Jobs
          </Link>
        </div>
        <p className="text-gray-700 mb-4">Your application has been submitted successfully!</p>
      </div>
    </div>
  );
};

export default Success;
