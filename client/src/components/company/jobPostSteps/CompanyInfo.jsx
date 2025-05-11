import React from "react";
import { FaChevronLeft, FaChevronRight, FaEnvelope, FaPhone, FaGlobe, FaUsers,FaMapMarkerAlt,FaBuilding,FaInfoCircle,FaMap,FaFlag } from "react-icons/fa";
import { STATIC_URL } from "../../../utils/axios";

const CompanyInfo = ({ companyDetails, prevStep, isSubmitting }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 space-y-8">
      <div className="flex items-center gap-6">
        {companyDetails.logo && (
          <img
            src={`${STATIC_URL}/public/${companyDetails.logo}`}
            alt="Company Logo"
            className="w-20 h-20 rounded-xl object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{companyDetails.name}</h1>
          {companyDetails.industry && (
            <div className="mt-2 flex items-center text-blue-600">
              <FaBuilding className="mr-2" />
              <span>{companyDetails.industry}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
        <Detail icon={<FaEnvelope />} label="Email" value={companyDetails.email} />
        <Detail icon={<FaPhone />} label="Phone" value={companyDetails.mobile} />
        <Detail icon={<FaGlobe />} label="Website" value={companyDetails.website} />
        <Detail icon={<FaUsers />} label="Company Size" value={companyDetails.size} />
        <Detail icon={<FaMapMarkerAlt />} label="Address" value={companyDetails.address} />
        <Detail icon={<FaMap />} label="State" value={companyDetails.state} />
        <Detail icon={<FaFlag />} label="Country" value={companyDetails.country} />
      </div>

      {companyDetails.description && (
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
            <FaInfoCircle className="mr-2" />
            About Company
          </h3>
          <p className="text-gray-800 text-sm">
            {companyDetails.description}
          </p>
        </div>
      )}

      <div className="flex items-start p-3 text-blue-600 text-sm">
        <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />
        <p>To update company details, please visit your profile settings before posting this job.</p>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center px-5 py-2 text-gray-700 font-medium rounded-lg hover:text-blue-600"
        >
          <FaChevronLeft className="mr-2" />
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-70"
        >
          {isSubmitting ? "Posting..." : "Post Job"}
          <FaChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

const Detail = ({ icon, label, value }) => (
  <div className="flex items-start">
    {icon && <span className="mr-2 mt-0.5 text-gray-500">{icon}</span>}
    <div>
      <p className="text-gray-600 text-xs mb-1">{label}</p>
      <p>{value || "-"}</p>
    </div>
  </div>
);

export default CompanyInfo;