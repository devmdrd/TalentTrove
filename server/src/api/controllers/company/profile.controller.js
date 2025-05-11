const User = require("../../models/user.model.js");
const Company = require("../../models/company.model.js");
const { hashPassword, comparePassword } = require("../../utils/password.util.js");

const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("name email mobile company");
    if (!user) return res.status(404).json({ error: "User not found" });

    const company = await Company.findById(user.company);
    if (!company) return res.status(404).json({ error: "Company details not found" });

    res.status(200).json({
      name: user.name,
      email: user.email,
      mobile: user.mobile || "",
      website: company.website || "",
      address: company.address || "",
      state: company.state || "",
      country: company.country || "",
      description: company.description || "",
      industry: company.industry || "",
      size: company.size || "",
      logo: company.logo || "",
    });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, website, address, state, country, description, industry, size, mobile, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const company = await Company.findById(user.company);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required" });
      }

      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      user.password = await hashPassword(newPassword);
    }

    await user.save();

    company.website = website || company.website;
    company.address = address || company.address;
    company.state = state || company.state;
    company.country = country || company.country;
    company.description = description || company.description;
    company.industry = industry || company.industry;
    company.size = size || company.size;

    if (req.file) {
      const logoPath = req.file.filename;
      company.logo = logoPath;
    }

    await company.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getProfile, updateProfile };
