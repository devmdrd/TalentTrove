import React, { useState, useEffect } from "react";
import Header from "../../components/recruiter/Header";
import Footer from "../../components/recruiter/Footer";
import { getCompany, getCompanyDetail, getProfile, saveCompany, saveProfile } from "../../services/recruiterServices";

const Profile = () => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);
  const [personalProfile, setPersonalProfile] = useState({
    _id:"",
    name: "",
    email: "",
    mobile: "",
    designation: ""
  });
  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    email:"",
    website: "",
    address: "",
    state: "",
    country: "",
    description: "",
    industry:"",
    size:"",
  });

  // Effect hook for fetching personal profile data
  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await getProfile();
        setPersonalProfile(response.recruiter);
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
  }, []);

  // Effect hook for fetching company details
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await getCompanyDetail();
        setCompanyDetails(response);
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    fetchCompanyDetails();
  }, []);

  // Handler for changing personal profile data
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setPersonalProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  // Handler for changing company data
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails(prevCompanyDetails => ({
      ...prevCompanyDetails,
      [name]: value
    }));
  };

  // Handler for editing personal profile
  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  // Handler for saving personal profile
  const handleSaveProfile = async () => {
    setEditingProfile(false);
    try {
      console.log(personalProfile)
      await saveProfile(personalProfile);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Handler for editing company details
  const handleEditCompany = () => {
    setEditingCompany(true);
  };

  // Handler for saving company details
  const handleSaveCompany = async () => {
    setEditingCompany(false);
    try {
      await saveCompany(companyDetails);
      alert("Company details saved successfully!");
    } catch (error) {
      console.error("Error saving company details:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto mt-8">
        <div className="flex justify-between mb-8">
          {/* Personal Profile */}
          <div className="w-1/2 mr-4">
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">Personal Profile</h1>
              <button
                onClick={editingProfile ? handleSaveProfile : handleEditProfile}
                className={`bg-${editingProfile ? 'blue' : 'green'}-500 hover:bg-${editingProfile ? 'blue' : 'green'}-700 text-white font-bold py-2 px-4 rounded`}
              >
                {editingProfile ? 'Save' : 'Edit'}
              </button>
            </div>
            <div>
              <label htmlFor="name" className="mb-2">
                Full Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={personalProfile.name}
                onChange={handleProfileChange}
                className="mb-4 px-3 py-2 border rounded w-full"
                disabled={!editingProfile}
              />
              <input
                type="text"
                id="_id"
                name="_id"
                value={personalProfile._id}
                // defaultValue={personalProfile._id.toString()}
                onChange={handleProfileChange}
                className="mb-4 px-3 py-2 border rounded w-full"
                disabled={!editingProfile}
              />
              <label htmlFor="email" className="mb-2">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={personalProfile.email}
                onChange={handleProfileChange}
                className="mb-4 px-3 py-2 border rounded w-full"
                disabled={!editingProfile}
              />
              <label htmlFor="mobile" className="mb-2">
                Phone:
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={personalProfile.mobile}
                onChange={handleProfileChange}
                className="mb-4 px-3 py-2 border rounded w-full"
                disabled={!editingProfile}
              />
              <label htmlFor="designation" className="mb-2">
                Designation:
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={personalProfile.designation}
                onChange={handleProfileChange}
                className="mb-4 px-3 py-2 border rounded w-full"
                disabled={!editingProfile}
              />
            </div>
          </div>

          {/* Company Details */}
          <div className="w-1/2 ml-4">
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">Company Details</h1>
              <button
                onClick={editingCompany ? handleSaveCompany : handleEditCompany}
                className={`bg-${editingCompany ? 'blue' : 'green'}-500 hover:bg-${editingCompany ? 'blue' : 'green'}-700 text-white font-bold py-2 px-4 rounded`}
              >
                {editingCompany ? 'Save' : 'Edit'}
              </button>
            </div>
            <div>
              <label htmlFor="name" className="mb-2">
                Company Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={companyDetails?.name}
                onChange={handleCompanyChange}
                className="mb-4 px-3 py-2 border rounded w-full"
                disabled={!editingCompany}
              />
              <label htmlFor="name" className="mb-2">
                Company Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={companyDetails?.email}
                onChange={handleCompanyChange}
                className="mb-4 px-3 py-2 border rounded w-full"
                disabled={!editingCompany}
              />
              <label htmlFor="website" className="mb-2">
                Website:
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={companyDetails?.website}
                onChange={handleCompanyChange}
                className="mb-4 px-3 py-2 border rounded w-full"
                disabled={!editingCompany}
              />
              <label htmlFor="address" className="mb-2">
                Address:
              </label>
              <textarea
                id="address"
                name="address"
                value={companyDetails?.address}
                onChange={handleCompanyChange}
                className="mb-4 px-3 py-2 border rounded w-full h-24 resize-none"
                disabled={!editingCompany}
              />
              <div className="flex mb-4">
                <div className="w-1/2 mr-4">
                  <label htmlFor="state" className="mb-2">
                    State:
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={companyDetails?.state}
                    onChange={handleCompanyChange}
                    className="px-3 py-2 border rounded w-full"
                    disabled={!editingCompany}
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="country" className="mb-2">
                    Country:
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={companyDetails?.country}
                    onChange={handleCompanyChange}
                    className="px-3 py-2 border rounded w-full"
                    disabled={!editingCompany}
                  />
                </div>
              </div>
              <div className="flex mb-4">
                <div className="w-1/2 mr-4">
                  <label htmlFor="size" className="mb-2">
                    Size:
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={companyDetails?.size}
                    onChange={handleCompanyChange}
                    className="px-3 py-2 border rounded w-full"
                    disabled={!editingCompany}
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="industry" className="mb-2">
                    Industry:
                  </label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    value={companyDetails?.industry}
                    onChange={handleCompanyChange}
                    className="px-3 py-2 border rounded w-full"
                    disabled={!editingCompany}
                  />
                </div>
              </div>
              <label htmlFor="description" className="mb-2">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={companyDetails?.description}
                onChange={handleCompanyChange}
                className="mb-4 px-3 py-2 border rounded w-full h-24 resize-none"
                disabled={!editingCompany}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
