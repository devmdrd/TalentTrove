import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JobPostForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    numberOfPosts: "",
    description: "",
    skillsRequired: [],
    experienceRequired: "",
    salary: "",
    lastDateToApply: "",
    location: "",
    jobType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSkillChange = (e) => {
    const value = e.target.value;
    if (e.key === "Enter" && value.trim() !== "") {
      setFormData((prevData) => ({
        ...prevData,
        skillsRequired: [...prevData.skillsRequired, value.trim()],
      }));
      e.target.value = "";
    }
  };

  const removeSkill = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      skillsRequired: prevData.skillsRequired.filter((_, i) => i !== index),
    }));
  };

  const todayDate = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if any required field is empty
    // for (const key in formData) {
    //   if (formData.hasOwnProperty(key) && formData[key] === "") {
    //     alert("Please fill out all required fields");
    //     return;
    //   }
    // }

    // If all required fields are filled, proceed to next page
    navigate("/recruiter/quick-profile", { state: { formData } });
  };

  return (
    <div className="max-w-lg mx-auto mt-4">
      <form onSubmit={handleSubmit} className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-semibold mb-4">Job Post Form</h2>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="numberOfPosts"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Number of Posts:
          </label>
          <input
            type="number"
            id="numberOfPosts"
            name="numberOfPosts"
            value={formData.numberOfPosts}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex mb-4">
          <div className="w-full md:w-1/2 pr-2">
            <label
              htmlFor="skillsRequired"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Skills Required:
            </label>
            <div className="flex flex-wrap">
              <input
                type="text"
                id="skillsInput"
                placeholder="Type skill and press Enter"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onKeyDown={handleSkillChange}
              />
              <div className="mt-2 flex flex-wrap">
                {formData.skillsRequired.map((skill, index) => (
                  <div key={index} className="mr-2 mb-2 bg-gray-200 rounded-full px-3 py-1 flex items-center">
                    <span className="mr-2">{skill}</span>
                    <button type="button" onClick={() => removeSkill(index)} className="text-red-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1.414-8l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 9 6.293 6.707a1 1 0 0 1 1.414-1.414L10 7.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 9l2.293 2.293a1 1 0 1 1-1.414 1.414L10 10.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 pl-2">
            <label
              htmlFor="experienceRequired"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Experience Required:
            </label>
            <input
              type="text"
              id="experienceRequired"
              name="experienceRequired"
              value={formData.experienceRequired}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label
              htmlFor="salary"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Salary:
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label
              htmlFor="lastDateToApply"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Last Date to Apply:
            </label>
            <input
              type="date"
              id="lastDateToApply"
              name="lastDateToApply"
              value={formData.lastDateToApply}
              onChange={handleChange}
              min={todayDate}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label
              htmlFor="location"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label
              htmlFor="jobType"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Job Type:
            </label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Job Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
              <option value="Temporary">Temporary</option>
              {/* Add more job types as needed */}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPostForm;
