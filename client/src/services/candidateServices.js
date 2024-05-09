import api from "../utils/axios";

// Authentication services
export const signup = async (details) => {
  try {
    const response = await api.post("/signup", details);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const verifyOtp = async (data) => {
  try {
    const response = await api.post("/verify-otp", data);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const resendOTP = async (email) => {
  try {
    const response = await api.post("/resend-otp", { email });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const signin = async (credentials) => {
  try {
    const response = await api.post("/signin", credentials);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
    return error.response.data;
  }
};
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/forgot-password", email);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const resetPassword = async (resetDetails) => {
  try {
    const response = await api.post("/reset-password", resetDetails);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Profile services
export const getTitle = async () => {
  try {
    const response = await api.get("/get-title");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const saveTitle = async (title) => {
  try {
    const response = await api.post("/save-title", { title });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const getAboutText = async () => {
  try {
    const response = await api.get("/get-about");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const saveAboutText = async (aboutText) => {
  try {
    const response = await api.post("/save-about", { aboutText });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const getImage = async () => {
  try {
    const response = await api.get("/get-image");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const saveImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("profilePic", image);
    const response = await api.post("/save-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const getProfile = async () => {
  try {
    const response = await api.get("/get-profile");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const createApplication = async (companyId, jobId) => {
  try {
    const response = await api.post(
      "/create-application",
      { companyId, jobId }
    );
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Resume services
export const getResume = async () => {
  try {
    const response = await api.get("/get-resume");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const resumeUpload = async (formData) => {
  try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Skills services
export const getSkills = async () => {
  try {
    const response = await api.get("/skills");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const addSkills = async (newSkill) => {
  try {
    const response = await api.post("/add-skill", { newSkill });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const removeSkills = async (index) => {
  try {
    const response = await api.delete(`/remove-skill/${index}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Experience services
export const getExperiences = async () => {
  try {
    const response = await api.get("/experiences");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const addExperiences = async (newExperience) => {
  try {
    const response = await api.post("/experiences", newExperience);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const editExperiences = async (experienceId, updatedExperience) => {
  try {
    const response = await api.patch(
      `/experiences/${experienceId}`,
      updatedExperience
    );
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const deleteExperiences = async (experienceId) => {
  try {
    const response = await api.delete(`/experiences/${experienceId}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Education services
export const getEducations = async () => {
  try {
    const response = await api.get("/educations");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const addEducations = async (newEducation) => {
  try {
    const response = await api.post("/educations", newEducation);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const editEducations = async (educationId, updatedEducation) => {
  try {
    const response = await api.patch(
      `/educations/${educationId}`,
      updatedEducation
    );
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const deleteEducations = async (educationId) => {
  try {
    const response = await api.delete(`/educations/${educationId}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Project services
export const getProjects = async () => {
  try {
    const response = await api.get("/projects");
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    console.error("🚫 Error:", error);
  }
};
export const addProjects = async (newProject) => {
  try {
    const response = await api.post("/projects", newProject);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const editProjects = async (projectId, updatedProject) => {
  try {
    const response = await api.patch(`/projects/${projectId}`, updatedProject);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const deleteProjects = async (projectId) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Certification services
export const getCertifications = async () => {
  try {
    const response = await api.get("/certifications");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const addCertifications = async (newCertification) => {
  try {
    const response = await api.post("/certifications", newCertification);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const editCertifications = async (
  certificationId,
  updatedCertification
) => {
  try {
    const response = await api.patch(
      `/certifications/${certificationId}`,
      updatedCertification
    );
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const deleteCertifications = async (certificationId) => {
  try {
    const response = await api.delete(`/certifications/${certificationId}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Language services
export const getLanguages = async () => {
  try {
    const response = await api.get("/languages");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const addLanguages = async (name, proficiency) => {
  try {
    const response = await api.post("/languages", { name, proficiency });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const editLanguages = async (id, name, proficiency) => {
  try {
    const response = await api.patch(`/languages/${id}`, { name, proficiency });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const removeLanguages = async (id) => {
  try {
    const response = await api.delete(`/languages/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Notification services
export const getNotifications = async () => {
  try {
    const response = await api.get("/notifications");
    const notificationsData = response.data.notifications;
    const unreadCount = notificationsData.filter(
      (notification) => !notification.read
    ).length;
    return { notifications: notificationsData, unreadCount };
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const markAsRead = async (notificationId) => {
  try {
    await api.post("/mark-as-read", { notificationId });
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Jobs services
export const getJobs = async ({
  filters,
  sortBy,
  sortOrder,
  currentPage,
  jobsPerPage,
}) => {
  try {
    const response = await api.get("/get-jobs", {
      params: {
        ...filters,
        sortBy,
        sortOrder,
        currentPage,
        jobsPerPage,
      },
    });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const searchJobs = async (jobKey, locationKey) => {
  try {
    const response = await api.get("/jobs", {
      params: {
        title: jobKey,
        location: locationKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const getJobDetails = async (jobId) => {
  try {
    const response = await api.get("/get-job", {
      params: { jobId },
    });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const appliedJobs = async () => {
  try {
    const response = await api.get("/applied-jobs");
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Application services
export const fetchJobDetails = async (applicationId) => {
  try {
    const response = await api.get("/job-status", {
      params: { applicationId },
    });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const getSkillTestId = async (applicationId) => {
  try {
    const response = await api.get(`/skill-test/${applicationId}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Skill-test services
export const fetchTestQuestions = async (skillTestId) => {
  try {
    const response = await api.get(`/test/${skillTestId}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const submitTest = async (data) => {
  console.log(data)
  try {
    const response = await api.post(`/submit-test`, {
      answers: data.selectedOptions,
      score: data.score,
      applicationId: data.applicationId,
    });
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};

// Chat services
export const getRecruiters = async () => {
  try {
    const response = await api.get(`/recruiters`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const getMessages = async (recruiterId) => {
  try {
    const response = await api.get(`/messages/${recruiterId}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Error:", error);
  }
};
export const sendMessage = async (messageData, selectedRecruiter) => {
  try {
    await api.post(`/message/${selectedRecruiter}`, messageData);
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
