const User = require("../../models/user.model.js");
const Job = require("../../models/job.model.js");
const SkillTest = require("../../models/skillTest.model.js");
const Application = require("../../models/application.model.js");
const Notification = require("../../models/notification.model.js");

const createJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('company');
    if (!user || !user.company) return res.status(404).json({ error: "Company not found" });

    let skillTestId = null;

    if (req.body.skillTest && req.body.skillTest.questions?.length > 0) {
      const skillTest = new SkillTest({
        testName: req.body.skillTest.testName,
        timeLimit: req.body.skillTest.timeLimit,
        questions: req.body.skillTest.questions,
      });

      const savedTest = await skillTest.save();
      skillTestId = savedTest._id;
    }

    const job = new Job({
      ...req.body,
      skillTest: skillTestId,
      company: user.company._id,
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate("skillTest");

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const applications = await Application.find({ job: jobId })
      .populate({
        path: "user",
        select: "name email mobile candidateProfile",
        populate: [
          { path: "candidateProfile.educationsId", model: "Education" },
          { path: "candidateProfile.experiencesId", model: "Experience" },
          { path: "candidateProfile.projectsId", model: "Project" },
          { path: "candidateProfile.certificationsId", model: "Certificate" }
        ]
      })
      .populate({
        path: "job",
        populate: { path: "skillTest", model: "SkillTest" }
      });

    const { skillTest, ...jobWithoutSkillTest } = job.toObject();

    res.status(200).json({
      job: jobWithoutSkillTest,
      skillTest: skillTest,
      applications: applications,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const listJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const jobs = await Job.find({ company: userId });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ error: "No jobs found for this company" });
    }

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error listing jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateJobStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'in-progress', 'accepted', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const application = await Application.findById(applicationId).populate('user job');
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = status;
    await application.save();

    if (status === 'accepted') {
      const { title, skillTest } = application.job;
      let message = `Your application for "${title}" has been accepted.`;
      if (skillTest) {
        message += ' Please complete your skill test!';
      }

      await Notification.create({
        recipient: application.user._id,
        message,
        type: 'application',
        referenceId: application._id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createJob,
  getJobById,
  listJobs,
  updateJobStatus
};
