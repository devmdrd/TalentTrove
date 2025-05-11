const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  size: { type: String },
  industry: { type: String },
  description: { type: String },
  website: { type: String },
  address: { type: String },
  state: { type: String },
  country: { type: String },
  logo: { type: String },
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
