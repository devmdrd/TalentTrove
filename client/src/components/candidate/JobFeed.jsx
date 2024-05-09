import React, { useEffect, useState } from "react";
import { AiOutlineSearch, AiOutlineEnvironment } from "react-icons/ai";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { getJobs } from "../../services/candidateServices";

const JobFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    jobKey: "",
    locationKey: "",
    experience: "",
    salary: "",
  });
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const jobsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getJobs({ filters, sortBy, sortOrder, currentPage, jobsPerPage });
        setJobs(data.currentJobs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchData();
  }, [filters, sortBy, sortOrder, currentPage, jobsPerPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSortChange = (e) => {
    const { value } = e.target;
    setSortBy(value);
  };

  const defaultLogoUrl = "https://via.placeholder.com/150";

  return (
    <>
      <Header />
      <div className="container mx-auto py-8 flex flex-col lg:flex-row mt-4">
        <div className="lg:w-1/4 pr-8">
          <div className="filters bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-lg font-semibold mb-3">Filters</h2>
            <div className="mb-3">
              <div className="flex items-center border-b border-gray-300">
                <AiOutlineSearch className="text-gray-800 mr-2" />
                <input
                  type="text"
                  id="jobKey"
                  name="jobKey"
                  value={filters.jobKey}
                  onChange={handleFilterChange}
                  placeholder="Search by Job Title or Keyword"
                  className="w-full bg-transparent focus:outline-none text-gray-700 py-2"
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center border-b border-gray-300">
                <AiOutlineEnvironment className="text-gray-800 mr-2" />
                <input
                  type="text"
                  id="locationKey"
                  name="locationKey"
                  value={filters.locationKey}
                  onChange={handleFilterChange}
                  placeholder="Search by Location"
                  className="w-full bg-transparent focus:outline-none text-gray-700 py-2"
                />
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Experience
              </label>
              <select
                id="experience"
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All</option>
                <option value="<3">Less than 3 years</option>
                <option value="3-5">3-5 years</option>
                <option value=">5">More than 5 years</option>
              </select>
            </div>
            <div className="mb-3">
              <label
                htmlFor="salary"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Salary
              </label>
              <select
                id="salary"
                name="salary"
                value={filters.salary}
                onChange={handleFilterChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All</option>
                <option value="₹10,000">Below ₹10,000</option>
                <option value="₹10,000-₹30,000">₹10,000-₹30,000</option>
                <option value="₹30,000">Above ₹30,000</option>
              </select>
            </div>
          </div>
          {/* <div className="sorting bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Sort By</h2>
            <select
              name="sortBy"
              value={sortBy}
              onChange={handleSortChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select</option>
              <option value="experience">Experience</option>
              <option value="salary">Salary</option>
            </select>
            <select
              name="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full mt-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div> */}
        </div>

        <div className="lg:w-3/4">
          {/* Sorting */}
          <div className="p-4 flex justify-end">
            <div>
              <h2 className="text-lg font-semibold">Sort Order</h2>
              <select
                name="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="job-card bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  {job.logo ? (
                    <img
                      src={job.logo}
                      alt="Company Logo"
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <img
                      src={defaultLogoUrl}
                      alt="Default Logo"
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
                  )}
                  <div>
                    <Link
                      to={`/job/${job._id}`}
                      className="text-lg font-semibold text-gray-800 hover:underline"
                    >
                      {job.title}
                    </Link>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <p className="text-sm text-gray-600">{job.location}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">{job.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">
                      Experience:
                    </span>
                    <span className="text-sm font-semibold bg-green-100 text-green-900 px-2 py-1 rounded-md">
                      {job.experienceRequired}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Salary:</span>
                    <span className="text-sm font-semibold bg-blue-100 text-blue-900 px-2 py-1 rounded-md">
                      {job.salary}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {jobs.length === 0 && <p>No jobs found</p>}
          </div>
          {/* Pagination */}
          <Pagination
            totalPages={totalPages}
            paginate={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

const Pagination = ({ totalPages, paginate, currentPage }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-4" aria-label="Pagination">
      <ul className="pagination">
        {currentPage > 1 && (
          <li className="inline-block mx-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
            >
              Prev
            </button>
          </li>
        )}
        {pageNumbers.map((number) => (
          <li key={number} className="inline-block mx-1">
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded ${
                currentPage === number ? "bg-gray-500 text-white" : ""
              }`}
            >
              {number}
            </button>
          </li>
        ))}
        {currentPage < totalPages && (
          <li className={`inline-block mx-1`}>
            <button
              onClick={() => paginate(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
            >
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default JobFeed;
