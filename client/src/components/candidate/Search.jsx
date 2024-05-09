import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { RiMapPin2Line } from "react-icons/ri";
import { searchJobs } from "../../services/candidateServices";
// import JobCard from "./JobFeed/JobCard";

const Search = () => {
  const [jobKey, setJobKey] = useState("");
  const [locationKey, setLocationKey] = useState("");
  const [jobsList, setJobsList] = useState([]);

  const handleJobSearch = (e) => {
    setJobKey(e.target.value);
  };

  const handleLocationSearch = (e) => {
    setLocationKey(e.target.value);
  };

  const handleSearchSubmit = async () => {
    try {
      const data = await searchJobs(jobKey, locationKey);
      console.log(data);
      setJobsList(data);
    } catch (error) {
      console.error("Error searching for jobs:", error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-center">
        <div className="search-container flex items-center border border-gray-300 rounded-full p-2 w-1/3">
          <AiOutlineSearch className="text-gray-800 mr-2" />
          <input
            type="text"
            placeholder="Job Title or Keyword"
            value={jobKey}
            onChange={handleJobSearch}
            className="w-64 py-1 px-2 bg-white focus:outline-none text-gray-700"
          />
        </div>
        <div className="search-container flex items-center border border-gray-300 rounded-full p-2 ml-4 w-1/3">
          <RiMapPin2Line className="text-gray-800 mr-2" />
          <input
            type="text"
            placeholder="Location"
            value={locationKey}
            onChange={handleLocationSearch}
            className="w-48 py-1 px-2 bg-white focus:outline-none text-gray-700"
          />
        </div>
        <button
          onClick={handleSearchSubmit}
          className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Search
        </button>
      </div>
      {/* <div className="flex justify-center mt-2">
        {jobsList?.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div> */}
    </div>
  );
};

export default Search;
