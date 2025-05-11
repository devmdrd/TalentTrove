const express = require("express")
const router = express.Router();

const { signin, logout } = require("../controllers/admin/auth.controller.js");
const { manageApplication } = require("../controllers/admin/application.controller.js");
const { listCompanies, manageCompany } = require("../controllers/admin/company.controller.js");
const { listUsers, manageUser } = require("../controllers/admin/user.controller.js");

const verifyToken = require("../middlewares/jwt.middleware")

router.use(express.urlencoded({ extended: false }))

// Dashboard
// router.get("/dashboard", dashboard);

// Auth
router.post("/signin", signin);
router.get("/logout", verifyToken, logout);

// Activities
router.patch("/application", manageApplication);

router.get("/companies", listCompanies); 
router.patch("/companies/:companyId", manageCompany);

router.get("/users", listUsers);
router.patch("/users/:userId", manageUser);

module.exports = router
