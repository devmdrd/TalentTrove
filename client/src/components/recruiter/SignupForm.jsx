import React, { useState } from "react";
import { register } from "../../services/recruiterServices";
import { useNavigate } from "react-router-dom";

function QuickProfileForm() {
  const navigate = useNavigate();
  const [quickProfileDetails, setQuickProfileDetails] = useState({
    companyName: "",
    companyEmail: "",
    companyWebsite: "",
    companyIndustry: "",
    companyDescription: "",
    companySize: "",
    companyAddress: "",
    companyState: "",
    companyCountry:"",

  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuickProfileDetails({
      ...quickProfileDetails,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(quickProfileDetails)
      const response = await register(quickProfileDetails);
      if (response.success) {
        alert(response.message);
        navigate("/recruiter/success");
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    <section className="max-w-4xl p-6 mx-auto bg-gray-100 rounded-xl shadow-md m-10">
      <h2 className="text-lg font-semibold text-gray-800 capitalize">
        Company Registration Form
      </h2>
      <form onSubmit={handleFormSubmit} className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Company/Organization Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={quickProfileDetails.companyName}
              onChange={handleInputChange}
              required
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Company/Organiztion Email
            </label>
            <input
              id="companyEmail"
              name="companyEmail"
              type="email"
              value={quickProfileDetails.companyEmail}
              onChange={handleInputChange}
              required
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="website"
            >
              Company/Organization Website
            </label>
            <input
              id="companyWebsite"
              name="companyWebsite"
              type="text"
              value={quickProfileDetails.companyWebsite}
              onChange={handleInputChange}
              required
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
         
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="designation"
            >
              Company Industry
            </label>
            <input
              id="companyIndustry"
              name="companyIndustry"
              type="text"
              value={quickProfileDetails.companyIndustry}
              onChange={handleInputChange}
              required
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="designation"
            >
              Company Size
            </label>
            <input
              id="companySize"
              name="companySize"
              type="text"
              value={quickProfileDetails.companySize}
              onChange={handleInputChange}
              required
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <br />
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Company Description
            </label>
            <textarea
              id="companyDescription"
              name="companyDescription"
              value={quickProfileDetails.companyDescription}
              onChange={handleInputChange}
              required
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="address"
            >
              Address
            </label>
            <textarea
              id="companyAddress"
              name="companyAddress"
              value={quickProfileDetails.companyAddress}
              onChange={handleInputChange}
              required
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="state"
            >
              State
            </label>
            <input
              id="companyState"
              name="companyState"
              type="text"
              value={quickProfileDetails.companyState}
              onChange={handleInputChange}
              required
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="country"
            >
              Country
            </label>
            <input
              id="companyCountry"
              name="companyCountry"
              type="text"
              value={quickProfileDetails.companyCountry}
              onChange={handleInputChange}
              required
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  );
}

export default QuickProfileForm;
