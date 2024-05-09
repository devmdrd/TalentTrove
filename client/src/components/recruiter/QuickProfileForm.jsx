import React, { useState, useEffect } from "react";
import { getCompany, getCompanyDetail, jobPost } from "../../services/recruiterServices";
import { useLocation, useNavigate } from "react-router-dom";

function QuickProfileForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const jobDetails = location.state.formData;
  const [quickProfileDetails, setQuickProfileDetails] = useState({
    industry: "",
    name: "",
    website: "",
    email: "",
    description: "",
    address: "",
    state: "",
    country: "",
    id: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuickProfileDetails({
      ...quickProfileDetails,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCompanyDetail();
        console.log(response)
        setQuickProfileDetails(response);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await jobPost({ quickProfileDetails, jobDetails });
      navigate("/recruiter/posted-jobs");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <section className="max-w-4xl p-6 mx-auto bg-gray-100 rounded-xl shadow-md m-10">
      <h2 className="text-lg font-semibold text-gray-800 capitalize">
        Company Details
      </h2>
      <form onSubmit={handleFormSubmit} className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            id="id"
            name="id"
            type="hidden"
            value={quickProfileDetails.id}
            onChange=""
            required
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="designation"
            >
              Industry
            </label>
            <input
              id="industry"
              name="industry"
              type="text"
              value={quickProfileDetails.industry}
              onChange={handleInputChange}
              required
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Company/Organization Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={quickProfileDetails.name}
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
              id="website"
              name="website"
              type="text"
              value={quickProfileDetails.website}
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
              id="email"
              name="email"
              type="text"
              value={quickProfileDetails.email}
              onChange={handleInputChange}
              required
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Company Description
            </label>
            <textarea
              id="description"
              name="description"
              value={quickProfileDetails.description}
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
              id="address"
              name="address"
              value={quickProfileDetails.address}
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
              id="state"
              name="state"
              type="text"
              value={quickProfileDetails.state}
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
              id="country"
              name="country"
              type="text"
              value={quickProfileDetails.country}
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
