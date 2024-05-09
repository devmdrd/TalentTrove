import api from "../utils/axios";

// Sign in function
export const signin = async (data) => {
  try {
    const response = await api.post("/admin/signin", data);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Get recruiters function
export const getRecruiters = async () => {
  try {
    const response = await api.get("/admin/get-recruiters");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Create recruiter function
export const createRecruiter = async (data) => {
  try {
    const response = await api.post("/admin/create-recruiter", data);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Get company function
export const getCompany = async (recruiterId) => {
  try {
    const response = await api.get(`/admin/get-company?recruiterId=${recruiterId}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Get all companies function
export const getAllCompany = async () => {
  try {
    const response = await api.get("/admin/get-company");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Toggle block status for recruiter function
export const toggleBlockStatus = async (recruiterId) => {
  try {
    const response = await api.get(`/admin/block/${recruiterId}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Get candidates function
export const getCandidates = async () => {
  try {
    const response = await api.get("/admin/get-candidates");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Toggle candidate block status function
export const toggleCandidateBlockStatus = async (candidateId) => {
  try {
    const response = await api.get(`/admin/blocks/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Logout function
export const logout = async () => {
  try {
    const response = await api.get("/admin/logout");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
