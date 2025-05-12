import React from 'react';
import { FiSearch } from "react-icons/fi";

const SearchHero = ({ jobKey, handleChange }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mb-8 text-white shadow-lg">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-3">Discover Your Next Career Move</h1>
        <p className="text-blue-100 text-lg mb-6">Browse through our curated selection of opportunities tailored for you</p>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 text-xl" />
          </div>
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            name="jobKey"
            value={jobKey}
            onChange={handleChange}
            className="block w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchHero;