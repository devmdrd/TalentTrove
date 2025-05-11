const express = require("express");
const passport = require("passport"); 
const router = express.Router();

const verifyToken = require('../middlewares/jwt.middleware.js');
const upload = require('../middlewares/multer.middleware.js'); 

const { googleCallback, signup, resendOtp, verifyOTP, signin, forgotPassword, resetPassword, logout } = require("../controllers/user/auth.controller.js");
const { getProfile, addToProfile, updateTheProfile, deleteFromProfile } = require("../controllers/user/profile.controller.js");
const { getJobs, applyJob, saveJob, appliedJobs, savedJobs } = require("../controllers/user/job.controller.js");
const { getSkillTestByApplication, submitSkillTest } = require("../controllers/user/skillTest.controller.js");
const { markNotificationAsRead, getUnreadNotifications } = require("../controllers/user/notification.controller.js");
const { getChats, getMessagesForCompany, sendMessage } = require("../controllers/user/chat.controller.js");

router.use(express.urlencoded({ extended: false }));

// Authentication
router.post("/signup", signup);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOTP);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);   
router.get("/logout", verifyToken, logout);

// Google OAuth
router.get("/auth/google", (req, res, next) => passport.authenticate("google", { scope: ["profile", "email"], state: req.query.state || "signup" })(req, res, next));
router.get("/auth/google/callback", passport.authenticate("google", { session: false }), googleCallback);

// Profile
router.get('/profile', verifyToken, getProfile);
router.post('/profile', verifyToken, addToProfile);
router.patch('/profile', verifyToken, upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'resumeOrCv', maxCount: 1 }]), updateTheProfile);
router.delete('/profile/:section/:id', verifyToken, deleteFromProfile);

// Jobs
router.get("/jobs", verifyToken, getJobs);
router.post("/jobs/save/:jobId", verifyToken, saveJob);
router.get("/saved-jobs", verifyToken, savedJobs);
router.post("/job", verifyToken, applyJob);
router.get("/applied-jobs", verifyToken, appliedJobs);

// Skill Test
router.get('/skill-test/:applicationId', verifyToken, getSkillTestByApplication);
router.post('/skill-test/:applicationId/submit', verifyToken, submitSkillTest);

// chat
router.get('/:candidateId/chat', getChats);
router.get('/:candidateId/chat/:companyId/messages', getMessagesForCompany);
router.post('/:candidateId/chat/:companyId/messages', sendMessage);


// notification
router.get("/notifications", verifyToken, getUnreadNotifications);
router.patch("/notifications/:id/read", verifyToken, markNotificationAsRead);

module.exports = router;
