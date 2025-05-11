import React from "react";
import { FaChevronRight, FaChevronLeft, FaPlus, FaTimes, FaEdit, FaClipboardList } from "react-icons/fa";

const JobRequirements = ({ jobDetails, tempSkill, setTempSkill, addSkill, removeSkill, handleJobDetailsChange, includeSkillTest, setIncludeSkillTest, nextStep, prevStep }) => {
  const handleKeyDown = e => e.key === "Enter" && (e.preventDefault(), addSkill());

  const isRequirementsComplete = jobDetails.description.trim() !== "" && jobDetails.skillsRequired.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Skills & Requirements</h2>

      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
              <FaEdit className="mr-2" />
              Job Description*
            </label>
            <textarea
              name="description"
              required
              value={jobDetails.description}
              onChange={handleJobDetailsChange}
              rows={6}
              className="w-full px-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the responsibilities, requirements, and expectations for this role..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
              <FaClipboardList className="mr-2" />
              Required Skills*
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tempSkill}
                onChange={(e) => setTempSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a skill (e.g. React, Python, Project Management)"
                className="flex-1 px-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addSkill}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-600 rounded-lg"
              >
                <FaPlus className="mr-1" size={12} />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {jobDetails.skillsRequired.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                    aria-label="Remove skill"
                  >
                    <FaTimes size={12} />
                  </button>
                </span>
              ))}
              {jobDetails.skillsRequired.length === 0 && (
                <span className="text-gray-400 text-sm italic">No skills added yet</span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeSkillTest"
              checked={includeSkillTest}
              onChange={(e) => setIncludeSkillTest(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
            />
            <label htmlFor="includeSkillTest" className="ml-2 text-gray-700 font-medium">
              Include a skill assessment test for applicants
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-500 ml-6">
            Adding a skill test helps you assess candidates' abilities before interviews.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center px-5 py-2.5 text-gray-700 font-medium rounded-lg hover:text-blue-600 focus:outline-none transition-colors"
        >
          <FaChevronLeft className="mr-2" />
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={!isRequirementsComplete}
          className={`flex items-center px-6 py-2.5 font-medium rounded-lg transition-colors
            ${isRequirementsComplete ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        >
          {includeSkillTest ? "Next: Skill Test" : "Next: Company Info"}
          <FaChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default JobRequirements;
