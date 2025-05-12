const Job = require('../../models/job.model.js');

const listJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate({
        path: 'skillTest',
        model: 'SkillTest'
      })
      .populate({
        path: 'company',
        model: 'User',
        populate: {
          path: 'company',
          model: 'Company'
        }
      });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {listJobs};
