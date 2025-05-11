const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: { type: String },
      files: { type: [String], default: [] },
      timestamp: { type: Date, default: Date.now },
      seenBy: { type: [mongoose.Schema.Types.ObjectId], ref: "User" }
    }
  ]
}, { timestamps: true });

chatSchema.index({ companyId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);
