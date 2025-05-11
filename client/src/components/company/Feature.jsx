import React from "react";
import { Link } from "react-router-dom";
import { FiBriefcase, FiCheckCircle, FiBarChart2, FiArrowRight } from "react-icons/fi";

function Feature() {
  return (
    <section className="bg-white rounded-xl mb-5">
      <div className="container px-6 py-10 mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl">
          Discover the Power of <br />
          <span className="underline decoration-blue-500">TalentTrove</span> for Employers
        </h1>
        <p className="mt-4 text-gray-500 xl:mt-6">
          Streamline your hiring process with powerful tools to post jobs, track applicants, and evaluate candidate skills—all in one place.
        </p>

        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
          <div className="transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-100 duration-150 p-8 space-y-3 border-2 cursor-pointer border-blue-400 rounded-xl">
            <span className="inline-block text-blue-500 text-3xl">
              <FiBriefcase />
            </span>
            <h1 className="text-xl font-semibold text-gray-700 capitalize">
              Post Jobs
            </h1>
            <p className="text-gray-500">
              Easily create and manage job listings to attract the best candidates for your open roles.
            </p>
            <Link
              to={"/company/create-job"}
              className="inline-flex p-2 text-blue-500 capitalize transition-colors duration-300 transform bg-blue-100 rounded-full rtl:-scale-x-100 hover:underline hover:text-blue-600"
            >
              <FiArrowRight className="w-6 h-6" />
            </Link>
          </div>

          <div className="transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-100 duration-150 p-8 space-y-3 border-2 cursor-pointer border-blue-400 rounded-xl">
            <span className="inline-block text-blue-500 text-3xl">
              <FiCheckCircle />
            </span>
            <h1 className="text-xl font-semibold text-gray-700 capitalize">
              Accepted Applications
            </h1>
            <p className="text-gray-500">
              View and manage all the applications you've shortlisted and moved forward in the hiring process.
            </p>
            <Link
              to={"/company/applications"}
              className="inline-flex p-2 text-blue-500 capitalize transition-colors duration-300 transform bg-blue-100 rounded-full rtl:-scale-x-100 hover:underline hover:text-blue-600"
            >
              <FiArrowRight className="w-6 h-6" />
            </Link>
          </div>

          <div className="transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-100 duration-150 p-8 space-y-3 border-2 cursor-pointer border-blue-400 rounded-xl">
            <span className="inline-block text-blue-500 text-3xl">
              <FiBarChart2 />
            </span>
            <h1 className="text-xl font-semibold text-gray-700 capitalize">
              View Jobs
            </h1>
            <p className="text-gray-500">
              View the complete jobs created with TalentTrove
            </p>
            <Link
              to={"/company/jobs"}
              className="inline-flex p-2 text-blue-500 capitalize transition-colors duration-300 transform bg-blue-100 rounded-full rtl:-scale-x-100 hover:underline hover:text-blue-600"
            >
              <FiArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Feature;
