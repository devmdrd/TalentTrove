import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Footer from "../../components/admin/Footer";
import { FiUsers, FiBriefcase, FiBarChart2 } from "react-icons/fi";
import UserDetails from "../../components/admin/UserDetails";
import Applications from "../../components/admin/Applications";

const AdminDashboard = () => {
  console.log("asdfgh")
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");

  const renderContent = () => {
    switch (selectedMenu) {
      case "Users":
        return (
          <div className="p-8">
            <UserDetails />
          </div>
        );

      case "Applications":
        return (
          <div className="p-8">
            <Applications />
          </div>
        );

      default:
        return (
          <div className="p-8">
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <DashboardCard icon={<FiUsers />} title="Users" count={1000} />
              <DashboardCard icon={<FiBriefcase />} title="Jobs" count={500} />
              <DashboardCard
                icon={<FiBriefcase />}
                title="Companies"
                count={50}
              />
              {/* Add more cards for other statistics */}
            </div>
            {/* Dummy graph */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Dummy Graph</h3>
              {/* Placeholder for graph */}
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  backgroundColor: "#ddd",
                }}
              ></div>
            </div>
          </div>
        );
    }
  };

  const DashboardCard = ({ icon, title, count }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="mr-4">{icon}</div>
          <div>
            <p className="text-xl font-bold">{count}</p>
            <p className="text-gray-500">{title}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="bg-gray-200 h-screen flex">
        {/* Sidebar */}
        <div className="bg-gray-800 w-64">
          <div className="p-4 text-white">Admin Dashboard</div>
          <ul className="py-4">
            {/* Sidebar menu items */}
            <li
              onClick={() => setSelectedMenu("Dashboard")}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer transition duration-300"
            >
              <FiBarChart2 className="mr-2 h-6 w-6 text-gray-500 hover:text-white transition duration-300" />
              <span className="text-sm">Dashboard</span>
            </li>
            <li
              onClick={() => setSelectedMenu("Users")}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer transition duration-300"
            >
              <FiUsers className="mr-2 h-6 w-6 text-gray-500 hover:text-white transition duration-300" />
              <span className="text-sm">Users</span>
            </li>

            <li
              onClick={() => setSelectedMenu("Applications")}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer transition duration-300"
            >
              <FiBriefcase className="mr-2 h-6 w-6 text-gray-500 hover:text-white transition duration-300" />
              <span className="text-sm">Applications</span>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow">{renderContent()}</div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
