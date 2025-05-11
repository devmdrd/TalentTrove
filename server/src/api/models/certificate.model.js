const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: { type: String, required: true },
  issue_date: { type: Date },
  expiration_date: { type: Date },
  credential_id: { type: String },
  credential_url: { type: String },
});

module.exports = mongoose.model("Certificate", certificateSchema);
