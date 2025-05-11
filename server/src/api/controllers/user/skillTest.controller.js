const Application = require("../../models/application.model.js");
const SkillTest = require("../../models/skillTest.model.js");

const getSkillTestByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    const job = application.job;
    const skillTest = await SkillTest.findOne({ _id: job.skillTest });

    if (!skillTest) {
      return res.status(404).json({ message: 'No skill test found for this job.' });
    }

    return res.status(200).json({ skillTest });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const submitSkillTest = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { answers } = req.body; 

    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    const skillTest = await SkillTest.findById(application.job.skillTest);
    if (!skillTest) {
      return res.status(404).json({ message: 'Skill test not found.' });
    }

    if (application.isTestCompleted) {
      return res.status(400).json({ message: 'Skill test already completed.' });
    }

    let score = 0;
    skillTest.questions.forEach((q, idx) => {
      const correctAnswerText = q.options[q.correctAnswer];
      if (answers[idx] === correctAnswerText) {
        score++;
      }
    });

    const percentageScore = (score / skillTest.questions.length) * 100;

    application.isTestCompleted = true;
    application.skillTestScore = percentageScore;
    await application.save();

    return res.status(200).json({
      message: 'Skill test submitted successfully.',
      score: percentageScore,
      total: skillTest.questions.length,
      correctAnswers: score
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports ={getSkillTestByApplication, submitSkillTest}
