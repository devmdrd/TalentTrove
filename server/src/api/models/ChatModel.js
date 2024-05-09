const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    // required: true
  },
  candidates: [
    {
      candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
      },
      messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Reference to Message model
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
