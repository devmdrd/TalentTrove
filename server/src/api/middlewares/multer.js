const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/api/public/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/api/public/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const profilePic = multer({ storage: profilePicStorage });

const recruiterPicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/api/public/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const recruiterPic = multer({ storage: recruiterPicStorage });

const companyPicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/api/public/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const companyPic = multer({ storage: companyPicStorage });

module.exports = { upload, profilePic, recruiterPic, companyPic };
