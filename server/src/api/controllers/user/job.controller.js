const Job = require("../../models/job.model.js");
const Application = require('../../models/application.model.js');
const User = require("../../models/user.model.js");
const SkillTest = require("../../models/skillTest.model.js");

const getJobs = async (req, res) => {
  try {
    let {
      jobKey,
      locationKey,
      experience,
      salary,
      jobType,
      skills,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      currentPage = 1,
      jobsPerPage = 5,
    } = req.query;

    currentPage = parseInt(currentPage);
    jobsPerPage = parseInt(jobsPerPage);

    const filter = {};
    if (jobKey) filter.title = new RegExp(jobKey, "i");
    if (locationKey) filter.location = new RegExp(locationKey, "i");

    if (experience) {
      if (experience === "<3") filter.experienceRequired = /^([0-2])/;
      else if (experience === "3-5") filter.experienceRequired = /^([3-5])/;
      else if (experience === ">5") filter.experienceRequired = /^([6-9]|\d{2,})/;
      else filter.experienceRequired = new RegExp(experience, "i");
    }

    if (salary) {
      if (salary.includes("-")) {
        const [min, max] = salary.split("-").map(s => parseInt(s.replace(/\D/g, ""), 10));
        filter["salary.min"] = { $lte: max };
        filter["salary.max"] = { $gte: min };
      } else {
        const num = parseInt(salary.replace(/\D/g, ""), 10);
        filter["salary.min"] = { $lte: num };
        filter["salary.max"] = { $gte: num };
      }
    }

    if (jobType) filter.jobType = jobType;
    if (skills) {
      const arr = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());
      filter.skillsRequired = { $all: arr };
    }

    filter.lastDateToApply = { $gte: new Date() };

    const total = await Job.countDocuments(filter);
    const sort = {};
    if (["createdAt", "salary.min", "salary.max"].includes(sortBy)) sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const jobs = await Job.find(filter)
      .sort(sort)
      .skip((currentPage - 1) * jobsPerPage)
      .limit(jobsPerPage)
      .select("-__v")
      .populate({
        path: "company", 
        select: "name email",
        populate: {
          path: "company", 
          model: "Company", 
          select: "size industry description website address state country logo"
        }
      });
    
    const user = await User.findById(req.user._id).select("candidateProfile.savedJobs");
    const savedJobs = user ? user.candidateProfile.savedJobs : [];

    const applications = await Application.find({ user: req.user._id }).select("job");
    const appliedJobIds = applications.map(app => app.job.toString());

    const flatJobs = jobs.map(job => {
      const companyData = job.company || {};
      const companyDetails = companyData.company || {};

      return {
        ...job.toObject(),
        company: {
          _id: companyData._id,
          name: companyData.name,
          email: companyData.email,
          size: companyDetails.size,
          industry: companyDetails.industry,
          description: companyDetails.description,
          website: companyDetails.website,
          address: companyDetails.address,
          state: companyDetails.state,
          country: companyDetails.country,
          logo: companyDetails.logo,
        },
        isSaved: savedJobs.includes(job._id), 
        isApplied: appliedJobIds.includes(job._id.toString()),
      };
    });

    res.status(200).json({
      success: true,
      currentJobs: flatJobs,
      pagination: {
        totalJobs: total,
        totalPages: Math.ceil(total / jobsPerPage),
        currentPage,
        jobsPerPage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const saveJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;

    const user = await User.findById(userId).select('candidateProfile.savedJobs');
    if (!user) return res.status(404).json({ message: "User not found" });

    const isSaved = user.candidateProfile.savedJobs.includes(jobId);

    if (isSaved) {
      user.candidateProfile.savedJobs.pull(jobId);
    } else {
      user.candidateProfile.savedJobs.push(jobId);
    }

    await user.save();

    res.status(200).json({
      saved: !isSaved,
      savedJobs: user.candidateProfile.savedJobs,
    });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const savedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: 'candidateProfile.savedJobs',
        populate: {
          path: 'company', 
          select: 'name company',
          populate: {
            path: 'company', 
            model: 'Company',
            select: 'industry size website address state country description'
          }
        }
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    const applications = await Application.find({ user: userId }).select("job");
    const appliedJobIds = applications.map(app => app.job.toString());

    const savedJobs = user.candidateProfile.savedJobs.map(job => {
      const jobIdStr = job._id.toString();
      const isApplied = appliedJobIds.includes(jobIdStr);
      const companyUser = job.company;
      const companyDetails = companyUser?.company;

      return {
        id: job._id,
        title: job.title,
        description: job.description,
        location: job.location,
        jobType: job.jobType,
        numberOfPosts: job.numberOfPosts,
        skillsRequired: job.skillsRequired,
        experienceRequired: job.experienceRequired,
        salary: job.salary,
        lastDateToApply: job.lastDateToApply,
        createdAt: job.createdAt,
        isApplied,
        company: {
          id: companyUser?._id,
          name: companyUser?.name,
          logo: companyDetails?.logo,
          industry: companyDetails?.industry,
          size: companyDetails?.size,
          website: companyDetails?.website,
          address: companyDetails?.address,
          state: companyDetails?.state,
          country: companyDetails?.country,
          description: companyDetails?.description
        }
      };
    });

    res.status(200).json({ savedJobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const userId = req.user._id; 

    const existingApplication = await Application.findOne({ user: userId, job: jobId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job.' });
    }

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    const application = new Application({
      user: userId,
      job: job._id,
      company: job.company._id,
      coverLetter: coverLetter || '',
    });

    await application.save();

    return res.status(201).json({ message: 'Application submitted successfully.', application });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

const appliedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ user: userId })
      .populate({
        path: 'job',
        populate: {
          path: 'company', 
          select: 'name company',
          populate: {
            path: 'company', 
            model: 'Company',
            select: 'logo industry size website address state country description'
          }
        }
      });

    const appliedJobs = applications.map(application => {
      const job = application.job;
      const companyUser = job?.company;
      const companyDetails = companyUser?.company;

      const hasTest = job?.skillTest ? true : false;

      return {
        applicationId: application._id,
        status: application.status,
        isTestCompleted: application.isTestCompleted,
        hasTest: !!hasTest,
        coverLetter: application.coverLetter,
        appliedAt: application.createdAt,
        job: {
          id: job?._id,
          title: job?.title,
          description: job?.description,
          location: job?.location,
          jobType: job?.jobType,
          numberOfPosts: job?.numberOfPosts,
          skillsRequired: job?.skillsRequired,
          experienceRequired: job?.experienceRequired,
          salary: job?.salary,
          lastDateToApply: job?.lastDateToApply,
          createdAt: job?.createdAt,
          company: {
            id: companyUser?._id,
            name: companyUser?.name,
            logo: companyDetails?.logo,
            industry: companyDetails?.industry,
            size: companyDetails?.size,
            website: companyDetails?.website,
            address: companyDetails?.address,
            state: companyDetails?.state,
            country: companyDetails?.country,
            description: companyDetails?.description
          }
        }
      };
    });

    res.status(200).json({ appliedJobs });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getJobs, saveJob, savedJobs, applyJob, appliedJobs };
