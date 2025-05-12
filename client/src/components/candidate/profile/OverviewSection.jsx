import React, { useEffect } from "react";
import {
  FaFileAlt, FaBriefcase, FaGraduationCap, FaCode,
  FaAward, FaProjectDiagram, FaLanguage
} from "react-icons/fa";

const OverviewSection = ({ profileData, setActiveTab }) => {
  const sections = [
    { key: "experiences", name: "Experience", icon: FaBriefcase },
    { key: "educations", name: "Education", icon: FaGraduationCap },
    { key: "certifications", name: "Certifications", icon: FaAward },
    { key: "projects", name: "Projects", icon: FaProjectDiagram },
    { key: "languages", name: "Languages", icon: FaLanguage },
    { key: "skills", name: "Skills", icon: FaCode },
  ];

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        display: none;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #3498db;
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #2980b9;
      }
      .custom-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-base font-semibold mb-3">Profile Summary</h3>
          <div
            className="space-y-4 max-h-[200px] overflow-y-auto custom-scrollbar"
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              paddingRight: "10px",
            }}
          >
            {["resume", ...sections.map(s => s.key)].map((key, index) => {
              const completed = key === "resume"
                ? !!profileData.resume
                : profileData[key]?.length > 0;

              return (
                <div key={key} className="flex items-center space-x-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      completed ? "bg-green-500 text-white" : "bg-gray-300"
                    }`}
                  >
                    {completed ? (
                      <span className="text-sm font-semibold">✓</span>
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="capitalize text-sm">{key}</span>
                    <span
                      className={`text-xs ${
                        completed ? "text-green-700" : "text-yellow-700"
                      }`}
                    >
                      {completed ? "Complete" : "Pending"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-base font-semibold mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {sections.map(({ key, name, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(name)}
                className="flex items-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded transition"
              >
                <Icon className="text-gray-600" />
                <div className="text-left">
                  <div className="text-sm font-medium">{name}</div>
                  <div className="text-xs text-gray-500">{profileData[key]?.length || 0} item(s)</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
