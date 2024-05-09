const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/jwt");
const { recruiterPic, companyPic } = require("../middlewares/multer");
const recruiterController = require("../controllers/recruiterController.js");

router.use(express.urlencoded({ extended: false }));

// authentication routes
router.post("/register", recruiterController.register);
router.post("/signin", recruiterController.signinPost);
router.post("/forgot-password", recruiterController.forgotPassword);
router.post("/reset-password", recruiterController.resetPasssword);

// profile routes
router.get("/profile", verifyToken, recruiterController.getProfile);
router.get("/get-company", verifyToken, recruiterController.getCompany);
router.get("/get-company-detail", verifyToken, recruiterController.getCompanyDetail);
router.post("/save-profile", verifyToken, recruiterController.saveProfile);
router.post("/save-company", verifyToken, recruiterController.saveCompany);

// job routes
router.post("/job-post", verifyToken, recruiterController.jobPost);
router.get("/posted-jobs", verifyToken, recruiterController.getPostedJobs);
router.get("/get-job/:id", verifyToken, recruiterController.getJobById);

// skill-test routes
router.post('/skill-tests', verifyToken, recruiterController.createSkillTest);
router.get('/skill-tests', verifyToken, recruiterController.getAllSkillTests);
router.get('/skill-tests/:id', verifyToken, recruiterController.getSkillTestById);
router.post('/assign-test', verifyToken, recruiterController.assignSkillTest);
// router.put('/skill-tests/:id', verifyToken, recruiterController.updateSkillTest);
router.delete('/skill-tests/:id', verifyToken, recruiterController.deleteSkillTest);
router.get('/view-results', verifyToken, recruiterController.viewResults);
router.post('/accept-test', verifyToken, recruiterController.acceptedTest);
router.post('/reject-test', verifyToken, recruiterController.rejectedTest);

// applications routes
router.get('/get-applications/:id', verifyToken, recruiterController.getApplications)
router.get('/get-applicant/:id', verifyToken, recruiterController.getApplicant)
router.get('/accepted-applications', verifyToken, recruiterController.acceptedApplications)
router.get('/rejected-applications', verifyToken, recruiterController.rejectedApplications)

// chat routes
router.get('/candidate/:id', verifyToken, recruiterController.getCandidate);
router.post('/candidate/:candidateId', verifyToken, recruiterController.sendMessage);
router.get('/messages/:candidateId', verifyToken, recruiterController.getMessagesWithCandidate);
router.get('/candidates', verifyToken, recruiterController.getCandidates);

// notification routes
router.post('/notification', verifyToken, recruiterController.sendNotification);

// logout
router.get("/logout", recruiterController.logout);

module.exports = router;
    