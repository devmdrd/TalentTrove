const express = require("express")
const router = express.Router();
const verifyToken = require("../middlewares/jwt")
const adminController = require("../controllers/adminController")

router.use(express.urlencoded({extended:false}))

router.post("/signin", adminController.signin);
router.get("/get-recruiters", adminController.getRecruiters);
router.get("/get-company", adminController.getCompany);
router.post("/create-recruiter", adminController.registerCompany)
router.get("/block/:recruiterId", adminController.blockRecruiter)
router.get("/get-candidates", adminController.getCandidates);
router.get("/blocks/:candidateId", adminController.blockCandidate)
router.get("/logout", adminController.signout);

module.exports = router
