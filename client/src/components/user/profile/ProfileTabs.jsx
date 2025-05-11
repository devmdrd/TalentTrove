import React from "react";
import {
  FaUser,
  FaFileAlt,
  FaBriefcase,
  FaProjectDiagram,
  FaGraduationCap,
  FaAward,
  FaLanguage,
  FaCode,
} from "react-icons/fa";

const tabs = [
  { name: "Overview", icon: <FaUser className="mr-2" /> },
  { name: "Experience", icon: <FaBriefcase className="mr-2" /> },
  { name: "Education", icon: <FaGraduationCap className="mr-2" /> },
  { name: "Projects", icon: <FaProjectDiagram className="mr-2" /> },
  { name: "Certifications", icon: <FaAward className="mr-2" /> },
  { name: "Skills", icon: <FaCode className="mr-2" /> },
  { name: "Languages", icon: <FaLanguage className="mr-2" /> },
  { name: "Resume", icon: <FaFileAlt className="mr-2" /> },
];

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <style>
        {`
          .scrollbar-none::-webkit-scrollbar {
            display: none; 
          }
          .scrollbar-none {
            overflow-x: auto;
            -ms-overflow-style: none; 
            scrollbar-width: none;
          }
        `}
      </style>
      <nav className="flex scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.name
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileTabs;
