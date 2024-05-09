import React from "react";

const CompanyInfo = ({ company }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Company Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="mb-4 sm:mb-0">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Company Name:</span> {company.name}
          </p>

          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Industry:</span> {company.industry}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Company Size:</span> {company.size}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Contact:</span> {company.email}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Website:</span>{" "}
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {company.website}
            </a>
          </p>
        </div>
        <div>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">About:</span> {company.description}
          </p>

          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Address:</span> {company.address}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">State:</span> {company.state}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Country:</span> {company.country}
          </p>
        </div>
      </div>
    </>
  );
};

export default CompanyInfo;
