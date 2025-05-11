const mongoose = require('mongoose');

const skillTestSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  questions: [{
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
  }],
});

const SkillTest = mongoose.model('SkillTest', skillTestSchema);

module.exports = SkillTest;
