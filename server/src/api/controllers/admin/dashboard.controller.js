const User = require('../../models/user.model.js');
const Job = require('../../models/job.model.js');
const Application = require('../../models/application.model.js');

const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalCompanies, totalApplications] = await Promise.all([
      User.countDocuments({ role: "candidate" }),
      Job.countDocuments(),
      User.countDocuments({ role: "company" }),
      Application.countDocuments()
    ]);

    const [jobSeekersCount, employerCount, adminCount] = await Promise.all([
      User.countDocuments({ role: "candidate" }),
      User.countDocuments({ role: "company" }),
      User.countDocuments({ role: "admin" }),
    ]);

    const jobPostingData = await Job.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      }
    ]);

    const applicationData = await Application.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const barChartData = {
      labels: months,
      jobPostings: months.map((_, index) => {
        const found = jobPostingData.find(item => item._id === index + 1);
        return found ? found.count : 0;
      }),
      applications: months.map((_, index) => {
        const found = applicationData.find(item => item._id === index + 1);
        return found ? found.count : 0;
      }),
    };

    const pieChartData = {
      labels: ["Job Seekers", "Employers", "Admins"],
      values: [jobSeekersCount, employerCount, adminCount],
    };

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        totalCompanies,
        totalApplications,
        barChartData,
        pieChartData
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { getDashboardStats };
