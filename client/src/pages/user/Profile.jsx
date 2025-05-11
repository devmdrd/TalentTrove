import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import ProfileCard from "../../components/user/profile/ProfileCard";
import ProfileTabs from "../../components/user/profile/ProfileTabs";
import OverviewSection from "../../components/user/profile/OverviewSection";
import ResumeSection from "../../components/user/profile/ResumeSection";
import ProfileSection from "../../components/user/profile/ProfileSection";
import { sectionConfigs } from "../../config/profileSectionsConfig.js";

import Header from "../../components/user/Header.jsx";
import Footer from "../../components/user/Footer.jsx";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "", about: "", profilePicture: "", experiences: [],
    educations: [], certifications: [], projects: [], languages: [], skills: [], resume: null
  });
  const [profileCompletion, setProfileCompletion] = useState(0);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/profile');
      setProfileData(res.data);
    } catch {
      toast.error("Failed to load profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const weights = {
      name: 10, about: 10, profilePicture: 10, resume: 10,
      experiences: 15, educations: 15, certifications: 10,
      languages: 5, projects: 10, skills: 5
    };

    let total = 0;

    for (const key in weights) {
      const value = profileData[key];
      if (
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === 'string' && value.trim())
      ) {
        total += weights[key];
      }
    }

    setProfileCompletion(Math.min(100, total).toFixed(2));
  }, [profileData]);

  const handleSectionUpdate = async (section, action, data, id = null) => {
    const formatSectionName = (section) => {
      const singular = section.endsWith('s') ? section.slice(0, -1) : section;
      return singular.charAt(0).toUpperCase() + singular.slice(1);
    };

    const formattedSection = formatSectionName(section);
    
    try {
      let res;

      if (action === 'add') {
        res = await api.post('/profile', { section, ...data });
         toast.success(`${formattedSection} added.`);
      } else if (action === 'update') {
        res = await api.patch('/profile', { section, id, ...data });
        toast.success(`${formattedSection} updated.`);
      } else if (action === 'delete') {
        res = await api.delete(`/profile/${section}/${id}`);
        toast.success(`${formattedSection} deleted.`);
      }

      setProfileData(prev => ({
        ...prev,
        [section]: action === 'add'
          ? [...prev[section], res.data[section] || res.data]
          : action === 'update'
          ? prev[section].map(item => item._id === id ? res.data[section] || res.data : item)
          : prev[section].filter(item => item._id !== id)
      }));

      // setTimeout(async () => {
      // await loadData();
      // }, 3000);
      return true;
    } catch {
      toast.error(`Failed to ${action} ${section}.`);
      return false;
    }
  };

  const updateBasicInfo = async (field, value) => {
    try {
      const res = await api.patch('/profile', { section: 'basicInfo', [field]: value });
      setProfileData(prev => ({
        ...prev,
        [field]: value,
        profilePicture: res.data.profilePicture || prev.profilePicture
      }));
      toast.success("Profile info updated.");
      return true;
    } catch {
      toast.error("Failed to update info.");
      return false;
    }
  };

  const updateProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('section', 'profilePicture');
      const res = await api.patch('/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfileData(prev => ({
        ...prev,
        profilePicture: res.data.candidateProfile.profilePicture
      }));
      toast.success("Profile picture updated.");
      return true;
    } catch {
      toast.error("Failed to update picture.");
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderSection = () => {
    if (activeTab === "Overview") return <OverviewSection profileData={profileData} />;
    if (activeTab === "Resume") return (
      <ResumeSection
        resume={profileData.resume}
        onUpdate={(resume) => setProfileData(prev => ({ ...prev, resume }))}
      />
    );
    const config = sectionConfigs[activeTab];
    return config ? (
      <ProfileSection
        title={activeTab}
        items={profileData[config.sectionName] || []}
        fields={config.fields}
        sectionName={config.sectionName}
        onAdd={(data) => handleSectionUpdate(config.sectionName, 'add', data)}
        onUpdate={(id, data) => handleSectionUpdate(config.sectionName, 'update', data, id)}
        onDelete={(id) => handleSectionUpdate(config.sectionName, 'delete', {}, id)}
      />
    ) : null;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="w-11/12 md:w-3/4 mx-auto py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfileCard
            profileData={profileData}
            profileCompletion={profileCompletion}
            updateBasicInfo={updateBasicInfo}
            updateProfilePicture={updateProfilePicture}
          />
          <div className="col-span-2 space-y-6">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="bg-white rounded-xl shadow-md p-6">{renderSection()}</div>
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Profile;
