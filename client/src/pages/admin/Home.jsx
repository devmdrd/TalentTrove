import React, { useState, useEffect } from "react";
import Header from "../../components/admin/Header";
import Footer from "../../components/admin/Footer";
import { FiUsers, FiBriefcase } from "react-icons/fi";
import { HiOutlineOfficeBuilding, HiOutlineDocumentText } from "react-icons/hi";
import { RiDashboardLine } from "react-icons/ri";
import UserDetails from "../../components/admin/UserDetails";
import Applications from "../../components/admin/Applications";
import Jobs from "../../components/admin/Jobs"; 
import Companies from "../../components/admin/Companies";  
import api from "../../utils/axios";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
    barChartData: { labels: [], jobPostings: [], applications: [] },
    pieChartData: { labels: [], values: [] }
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await api.get("/admin/dashboard");
        if (data.success) setStats(data.data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };
    fetchDashboardStats();
  }, []);

  const renderContent = () => {
    if (selectedMenu === "Users") return <div className="p-6"><UserDetails /></div>;
    if (selectedMenu === "Applications") return <div className="p-6"><Applications /></div>;
    if (selectedMenu === "Jobs") return <div className="p-6"><Jobs /></div>;
    if (selectedMenu === "Companies") return <div className="p-6"><Companies /></div>;

    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[{ label: 'Total Users', value: stats.totalUsers, icon: <FiUsers className="h-6 w-6" />, color: 'indigo' },
            { label: 'Active Jobs', value: stats.totalJobs, icon: <FiBriefcase className="h-6 w-6" />, color: 'green' },
            { label: 'Companies', value: stats.totalCompanies, icon: <HiOutlineOfficeBuilding className="h-6 w-6" />, color: 'amber' },
            { label: 'Applications', value: stats.totalApplications, icon: <HiOutlineDocumentText className="h-6 w-6" />, color: 'blue' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100" style={{maxHeight: "400px"}}>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Activity</h3>
            <Bar
              data={{
                labels: stats.barChartData.labels,
                datasets: [
                  { label: 'Job Postings', data: stats.barChartData.jobPostings, backgroundColor: '#6366f1' },
                  { label: 'Applications', data: stats.barChartData.applications, backgroundColor: '#34d399' }
                ]
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' }, title: { display: false } }
              }}
            />
          </div>
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100" style={{maxHeight: "400px"}}>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">User Roles</h3>
            <Doughnut
              data={{
                labels: stats.pieChartData.labels,
                datasets: [{
                  data: stats.pieChartData.values,
                  backgroundColor: ['#6366f1', '#f59e0b'],
                  borderColor: '#fff',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
              }}
            />
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
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-gray-800 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d={sidebarCollapsed
                  ? "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  : "M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                } clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <nav className="p-2">
            {["Dashboard", "Users", "Applications", "Jobs", "Companies"].map((item) => (
              <button
                key={item}
                onClick={() => setSelectedMenu(item)}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${selectedMenu === item ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                {item === "Dashboard" ? <RiDashboardLine /> :
                  item === "Users" ? <FiUsers /> :
                  item === "Applications" ? <HiOutlineDocumentText /> :
                  item === "Jobs" ? <FiBriefcase /> :
                  <HiOutlineOfficeBuilding />}
                {!sidebarCollapsed && <span className="ml-3 text-sm">{item}</span>}
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

export default Home;
