import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiX } from "react-icons/fi";

const MobileFilters = ({ showMobileFilters, setShowMobileFilters, filters, handleChange, resetFilters }) => {
  return (
    <AnimatePresence>
      {showMobileFilters && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-white p-5 rounded-xl shadow-lg border border-gray-200 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Filters</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset all
              </button>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="City or state"
                  name="locationKey"
                  value={filters.locationKey}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
              <select
                name="experience"
                value={filters.experience}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              >
                <option value="">Any experience</option>
                <option value="<3">Less than 3 years</option>
                <option value="3-5">3-5 years</option>
                <option value=">5">More than 5 years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
              <select
                name="salary"
                value={filters.salary}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              >
                <option value="">Any salary</option>
                <option value="₹10,000">Below ₹10,000</option>
                <option value="₹10,000-₹30,000">₹10,000 - ₹30,000</option>
                <option value="₹30,000">Above ₹30,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              >
                <option value="">Any type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <input
                type="text"
                placeholder="React, Node, Python etc."
                name="skills"
                value={filters.skills}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileFilters;