const User = require("../../models/user.model");
const Company = require("../../models/company.model");

const listCompanies = async (req, res) => {
  try {
    const companies = await User.find({ role: "company" })
      .populate("company")
      .select("name email password company");

    if (!companies.length) {
      return res.status(404).json({ success: false, message: "No companies found." });
    }

    const companyDetails = companies.map(({ _id, name, email, password, company }) => ({
      userId: _id,
      companyName: name,
      companyEmail: email,
      password: password,
      company: company ? {
        _id: company._id,
        size: company.size,
        industry: company.industry,
        description: company.description,
        website: company.website,
        address: company.address,
        state: company.state,
        country: company.country,
        logo: company.logo,
        isBlocked: company.isBlocked,
      } : null,
    }));

    res.status(200).json({ success: true, message: "Companies fetched successfully.", companies: companyDetails });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const manageCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { isBlocked } = req.body;

    const company = await Company.findByIdAndUpdate(companyId, { isBlocked }, { new: true });

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found." });
    }

    res.status(200).json({
      success: true,
      message: `Company has been ${isBlocked ? "blocked" : "unblocked"}.`,
      company,
    });
  } catch (error) {
    console.error("Error managing company:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { listCompanies, manageCompany };
