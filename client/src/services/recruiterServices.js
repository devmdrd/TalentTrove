import api from "../utils/axios";

// Authentication services
export const register = async (data) => {
  try {
    const response = await api.post("/recruiter/register", data);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const signin = async (data) => {
  try {
    const response = await api.post("/recruiter/signin", data);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
    return error.response.data
  }
};
export const forgotPassword = async (data) => {
  try {
    const response = await api.post("/recruiter/forgot-password", data);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const resetPassword = async (resetDetails) => {
  try {
    const response = await api.post("/recruiter/reset-password", resetDetails);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Profile services
export const getProfile = async () => {
  try {
    const response = await api.get("/recruiter/profile");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const saveProfile = async (formData) => {
  try {
    const response = await api.post("/recruiter/save-profile", formData);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const getCompany = async () => {
  try {
    const response = await api.get("/recruiter/get-company");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const getCompanyDetail = async () => {
  try {
    const response = await api.get("/recruiter/get-company-detail");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const saveCompany = async (formData) => {
  try {
    const response = await api.post("/recruiter/save-company", formData);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Jobs services
export const jobPost = async (formData) => {
  try {
    const response = await api.post("/recruiter/job-post", formData);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const getPostedJobs = async () => {
  try {
    const response = await api.get("/recruiter/posted-jobs");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const getJobById = async(id) => {
  try {
    const response = await api.get(`/recruiter/get-job/${id}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Skill-test services
export const createSkillTest = async (formData) => {
  try {
    const response = await api.post("/recruiter/skill-tests", formData);
    return response.data;
  } catch (error) {
    console.error('Error creating skill test:', error);
    throw new Error('Failed to create skill test'); 
  }
};
export const getSkillTests = async(id) => {
  try {
    const response = await api.get("/recruiter/skill-tests");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const getSkillTestsById = async(id) => {
  try {
    const response = await api.get(`/recruiter/skill-tests/${id}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const deleteSkillTest = async(id) => {
  try {
    const response = await api.delete(`/recruiter/skill-tests/${id}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const assignTest = async(data) =>{
  try {
    const response = await api.post(`/recruiter/assign-test`,{applicationId:data.applicationId, skillTestId:data.skillTestId});
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
}
export const getResults = async() => {
  try {
    const response = await api.get(`/recruiter/view-results`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const acceptTest = async(data) => {
  try {
    const response = await api.post(`/recruiter/accept-test`, {applicationId:data.applicationId});
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const rejectTest = async(data) => {
  try {
    const response = await api.get(`/recruiter/reject-test`, {applicationId:data.applicationId});
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Application services
export const getApplicationsData = async(id) => {
  try {
    const response = await api.get(`/recruiter/get-applications/${id}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const getApplicantData = async(id) => {
  try {
    const response = await api.get(`/recruiter/get-applicant/${id}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const getAcceptedApplications = async(id) => {
  try {
    const response = await api.get(`/recruiter/accepted-applications`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Notification services
export const sendNotification = async(data)=>{
  try {
    const response = await api.post(`/recruiter/notification`,{recipient:data.recipient, message:data.message});
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
}

// Chats services
export const getMessages = async(id) => {
  try {
    const response = await api.get(`/recruiter/messages/${id}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const sendMessage = async(id, data) =>{
  try {
    const response = await api.post(`/recruiter/candidate/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
}
export const getCandidates = async() => {
  try {
    const response = await api.get(`/recruiter/candidates`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Logout
export const logout = async () => {
  try {
    const response = await api.get("/logout");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};