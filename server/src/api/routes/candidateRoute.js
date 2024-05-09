const express = require("express");
const router = express.Router();
const verifyToken  = require('../middlewares/jwt.js');
const {upload,profilePic} = require('../middlewares/multer.js'); 
const candidateController = require("../controllers/candidateController.js");

router.use(express.urlencoded({ extended: false }));

// authentication routes
router.post("/signup", candidateController.signup);
router.post("/resend-otp", candidateController.resendOtp);
router.post("/verify-otp", candidateController.verifyOTP);
router.post("/signin", candidateController.signin);
router.post("/forgot-password", candidateController.forgotPassword);
router.post("/reset-password", candidateController.resetPasssword);   

// profile routes
router.get("/get-profile", verifyToken, candidateController.getProfile)
router.post("/save-title", verifyToken, candidateController.saveTitle);
router.get("/get-title", verifyToken, candidateController.getTitle);
router.post("/save-image",verifyToken, profilePic.single("profilePic"), candidateController.saveImage);
router.get("/get-image", verifyToken, candidateController.getImage);
router.post("/upload", verifyToken, upload.single("resume"), candidateController.resumeUpload);
router.get("/get-resume", verifyToken, candidateController.getResume);
router.post("/add-skill", verifyToken, candidateController.addSkill);
router.get("/skills", verifyToken, candidateController.getSkills);
router.delete("/remove-skill/:index", verifyToken, candidateController.removeSkill);

// about routes
router.post("/save-about", verifyToken, candidateController.saveAbout);
router.get("/get-about", verifyToken, candidateController.getAbout);

// languages routes
router.post("/languages", verifyToken, candidateController.addLanguage);
router.get("/languages", verifyToken, candidateController.getLanguages);
router.patch("/languages/:languageId", verifyToken, candidateController.editLanguage);
router.delete("/languages/:languageId", verifyToken, candidateController.deleteLanguage)

// experience routes
router.post("/experiences", verifyToken, candidateController.addExperience);
router.get("/experiences", verifyToken, candidateController.getExperiences);
router.patch("/experiences/:experienceId", verifyToken, candidateController.editExperience);
router.delete("/experiences/:experienceId", verifyToken, candidateController.deleteExperience)

// project routes
router.post("/projects", verifyToken, candidateController.addProject);
router.get("/projects", verifyToken, candidateController.getProjects);
router.patch("/projects/:projectId", verifyToken, candidateController.editProject);
router.delete("/projects/:projectId", verifyToken, candidateController.deleteProject)

// education routes
router.post("/educations", verifyToken, candidateController.addEducation);
router.get("/educations", verifyToken, candidateController.getEducations);
router.patch("/educations/:educationId", verifyToken, candidateController.editEducation);
router.delete("/educations/:educationId", verifyToken, candidateController.deleteEducation)

// education routes
router.post("/certifications", verifyToken, candidateController.addCertification);
router.get("/certifications", verifyToken, candidateController.getCertifications);
router.patch("/certifications/:certificationId", verifyToken, candidateController.editCertification);
router.delete("/certifications/:certificationId", verifyToken, candidateController.deleteCertification)

// Jobs routes
router.get("/get-jobs", verifyToken, candidateController.getJobs);
router.get('/get-job', verifyToken, candidateController.getJobById);
router.get('/applied-jobs', verifyToken, candidateController.appliedJobs);
router.get('/job-status', verifyToken, candidateController.jobStatus);
router.get('/search-jobs', verifyToken, candidateController.searchJobs);
router.get('/filter-jobs', verifyToken, candidateController.filterJobs);
router.get('/skill-test/:applicationId', verifyToken, candidateController.getSkillTest);
router.get('/test/:id', verifyToken, candidateController.getSkillTestById);
router.post('/submit-test', verifyToken, candidateController.submitTest);

// application routes
router.post("/create-application", verifyToken, candidateController.createApplication);

// chat routes
router.get('/recruiters', verifyToken, candidateController.getAllRecruitersForCandidate);
router.get('/messages/:recruiterId', verifyToken, candidateController.getMessagesWithRecruiter);
router.post('/message/:recruiterId', verifyToken, candidateController.postMessageForRecruiter);

// notification routes
router.get('/notifications', verifyToken, candidateController.getAllNotifications);
router.post('/mark-as-read', verifyToken, candidateController.readNotifications);

// logout route
router.get("/logout", verifyToken, candidateController.logout);

module.exports = router;
