import React, { useState, useEffect } from "react";
import { FiUpload, FiSave, FiUser, FiLock, FiEdit2, FiGlobe, FiPhone, FiMapPin, FiBriefcase, FiUsers } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api, { STATIC_URL } from "../../utils/axios";
import Header from "../../components/company/Header";
import Footer from "../../components/company/Footer";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [companyDetails, setCompanyDetails] = useState({
    name: "", email: "", mobile: "", website: "", address: "", state: "",
    country: "", description: "", industry: "", size: "", logo: "",
    currentPassword: "", password: ""
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const res = await api.get("/company/profile");
        setCompanyDetails({ ...res.data, password: "", currentPassword: "" });
      } catch {
        toast.error("Failed to fetch company details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { password, currentPassword, logo, ...profileData } = companyDetails;
      await api.patch("/company/profile", profileData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);

      const formData = new FormData();
      formData.append("logo", file);

      try {
        setLoading(true);
        const res = await api.patch("/company/profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Logo updated successfully!");
        setCompanyDetails((prev) => ({ ...prev, logo: res.data.logo }));
        setLogoPreview(null);
      } catch (error) {
        toast.error("Logo update failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      await api.patch("/company/profile", {
        currentPassword: companyDetails.currentPassword,
        newPassword: companyDetails.password,
      });
      toast.success("Password updated successfully!");
      setCompanyDetails((prev) => ({ ...prev, password: "", currentPassword: "" }));
    } catch {
      toast.error("Password update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 h-24">
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-white shadow-md">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : companyDetails.logo ? (
                    <img src={`${STATIC_URL}/public/${companyDetails.logo}`} alt="Company Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-600 bg-gray-100">
                      {companyDetails.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <FiUpload className="text-lg" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="pt-16 pb-6 px-6 text-center">
              <h2 className="text-xl font-bold text-gray-800">{companyDetails.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{companyDetails.industry}</p>
              <div className="mt-4 flex justify-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <FiUsers className="mr-1" /> {companyDetails.size}
                </span>
              </div>
            </div>
            <nav className="pb-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${activeTab === "profile" ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                <FiUser className="mr-3 text-lg" />
                <span className="font-medium">Profile Information</span>
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${activeTab === "password" ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                <FiLock className="mr-3 text-lg" />
                <span className="font-medium">Change Password</span>
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {activeTab === "profile" ? (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Company Profile</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiEdit2 className="mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <FiSave className="mr-2" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[{ field: "name", label: "Company Name", icon: <FiBriefcase className="text-gray-400" /> },
                      { field: "email", label: "Email", type: "email", icon: <FiUser className="text-gray-400" /> },
                      { field: "mobile", label: "Phone Number", type: "tel", icon: <FiPhone className="text-gray-400" /> },
                      { field: "website", label: "Website", type: "url", icon: <FiGlobe className="text-gray-400" /> },
                      { field: "industry", label: "Industry", icon: <FiBriefcase className="text-gray-400" /> },
                      { field: "size", label: "Company Size", icon: <FiUsers className="text-gray-400" /> },
                      { field: "state", label: "State/Province", icon: <FiMapPin className="text-gray-400" /> },
                      { field: "country", label: "Country", icon: <FiMapPin className="text-gray-400" /> }
                    ].map(({ field, label, type = "text", icon }) => (
                      <div key={field} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">{label}</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {icon}
                          </div>
                          <input
                            type={type}
                            name={field}
                            value={companyDetails[field]}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full ${!isEditing ? 'bg-gray-50' : 'bg-white'} border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                        <FiMapPin className="text-gray-400" />
                      </div>
                      <textarea
                        name="address"
                        value={companyDetails.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows={3}
                        className={`w-full ${!isEditing ? 'bg-gray-50' : 'bg-white'} border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Company Description</label>
                    <textarea
                      name="description"
                      value={companyDetails.description}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={5}
                      className={`w-full ${!isEditing ? 'bg-gray-50' : 'bg-white'} border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                      placeholder="Tell us about your company..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="currentPassword"
                        value={companyDetails.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter your current password"
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={companyDetails.password}
                        onChange={handleChange}
                        placeholder="Enter your new password"
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handlePasswordChange}
                      disabled={!companyDetails.currentPassword || !companyDetails.password}
                      className={`px-6 py-3 rounded-lg flex items-center transition-colors ${!companyDetails.currentPassword || !companyDetails.password ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'}`}
                    >
                      <FiLock className="mr-2" />
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
