import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Footer from "../../components/admin/Footer";
import { FiUsers, FiBriefcase, FiTrendingUp } from "react-icons/fi";
import { HiOutlineOfficeBuilding, HiOutlineDocumentText } from "react-icons/hi";
import { RiDashboardLine } from "react-icons/ri";
import UserDetails from "../../components/admin/UserDetails";
import Applications from "../../components/admin/Applications";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const jobStatsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Job Postings',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: '#4F46E5',
        borderRadius: 6
      },
      {
        label: 'Applications',
        data: [8, 15, 10, 12, 8, 10],
        backgroundColor: '#10B981',
        borderRadius: 6
      }
    ]
  };

  const userDistributionData = {
    labels: ['Job Seekers', 'Employers', 'Admins'],
    datasets: [{
      data: [300, 50, 5],
      backgroundColor: ['#4F46E5', '#10B981', '#F59E0B'],
      borderWidth: 0,
    }]
  };

  const renderContent = () => {
    if (selectedMenu === "Users") return <div className="p-6"><UserDetails /></div>;
    if (selectedMenu === "Applications") return <div className="p-6"><Applications /></div>;

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: '1,248', trend: '12% from last month', icon: <FiUsers className="h-6 w-6" />, color: 'indigo' },
            { label: 'Active Jobs', value: '342', trend: '5% from last week', icon: <FiBriefcase className="h-6 w-6" />, color: 'green' },
            { label: 'Companies', value: '86', trend: '2% from last month', icon: <HiOutlineOfficeBuilding className="h-6 w-6" />, color: 'amber' },
            { label: 'Applications', value: '1,024', trend: '24% from last week', icon: <HiOutlineDocumentText className="h-6 w-6" />, color: 'blue' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 flex items-center ${stat.label === 'Companies' ? 'text-red-500' : 'text-green-500'}`}>
                    <FiTrendingUp className={`mr-1 ${stat.label === 'Companies' ? 'transform rotate-180' : ''}`} /> {stat.trend}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Job Postings & Applications</h3>
              <select className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
            <div className="h-64">
              <Bar
                data={jobStatsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true } },
                  plugins: { legend: { position: 'top' } }
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h3>
            <div className="h-64">
              <Doughnut
                data={userDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className={`bg-gray-900 text-white transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
          <div className="p-4 flex items-center justify-between border-b border-gray-800">
            {!sidebarCollapsed && <h1 className="text-xl font-bold">Admin</h1>}
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 rounded-lg hover:bg-gray-800">
              {sidebarCollapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          <nav className="p-2">
            {[
              { key: "Dashboard", icon: <RiDashboardLine /> },
              { key: "Users", icon: <FiUsers /> },
              { key: "Applications", icon: <HiOutlineDocumentText /> },
              { key: "Jobs", icon: <FiBriefcase /> },
              { key: "Companies", icon: <HiOutlineOfficeBuilding /> },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedMenu(item.key)}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${selectedMenu === item.key ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                {item.icon}
                {!sidebarCollapsed && <span className="ml-3 text-sm">{item.key}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex-1 overflow-auto">
          {renderContent()}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
