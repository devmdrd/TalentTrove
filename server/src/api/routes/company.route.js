const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/jwt.middleware.js");
const upload = require("../middlewares/multer.middleware.js");

const { signup, signin, forgotPassword, resetPassword, logout } = require("../controllers/company/auth.controller.js");
const { getProfile, updateProfile } = require("../controllers/company/profile.controller.js");
const { listJobs, createJob, getJobById, updateJobStatus } = require("../controllers/company/job.controller.js");
const { getOrCreateChat, getMessages, sendMessage } = require("../controllers/company/chat.controller.js");

router.use(express.urlencoded({ extended: false }));

// Auth
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/logout", verifyToken, logout);

// Profile
router.get("/profile", verifyToken, getProfile);
router.patch("/profile", verifyToken, upload.single("logo"), updateProfile);

// Job
router.get("/jobs", verifyToken, listJobs);
router.post("/job", verifyToken, createJob);
router.get("/jobs/:id/details", verifyToken, getJobById);
router.put("/jobs/:applicationId/status", verifyToken, updateJobStatus);

// Chat
router.get('/:companyId/chat', getOrCreateChat);
router.get('/:companyId/chat/:candidateId/messages', getMessages);
router.post('/:companyId/chat/:candidateId/messages', sendMessage);

module.exports = router;
    