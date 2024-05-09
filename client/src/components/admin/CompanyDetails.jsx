import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const CompanyDetails = () => {
  const location = useLocation();
  const formData = location.state?.companyDetails; 

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    if (formData) {
      setCompanies(formData);
    }
  }, []); 

  return (
    <section className="bg-white shadow overflow-hidden sm:rounded-lg container mx-auto">
      {companies?.map((company, index) => (
        <div key={index} className="overflow-x-auto">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Company Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Details about the company
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Company/Organization Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  {company.name}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Company/Organization Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  {company.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Company/Organization Website</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  {company.website}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Industry</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  {company.industry}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">About</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  {company.description}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  {company.address}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">State</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  {company.state}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Country</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  {company.country}
                </dd>
              </div>
              
            </dl>
          </div>
        </div>
      ))}
    </section>
  );
};

export default CompanyDetails;
