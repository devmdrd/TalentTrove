const mongoose = require('mongoose');

const skillTestSchema = new mongoose.Schema({
  testName: String,
  timeLimit: Number,
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
  }],
});

const SkillTest = mongoose.model('SkillTest', skillTestSchema);

module.exports = SkillTest;
