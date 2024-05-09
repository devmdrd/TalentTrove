const mongoose = require("mongoose");
const moment = require("moment");

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    // required: true
  },
  sender: {
    type: String,
    enum: ["recruiter", "candidate"],
    // required: true
  },
  files: {
    type: [String],
    default: [],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.virtual('formattedCreatedAt').get(function() {
  return moment(this.timestamp).format('h:mm A');
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
