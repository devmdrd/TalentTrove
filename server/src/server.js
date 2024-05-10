const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const passport = require("./api/middlewares/passportConfig.js");
const session = require("express-session");
const { Server } = require("socket.io");

require("./config/db.config.js");
require("dotenv").config();
const userRouter = require("./api/routes/candidateRoute.js");
const recruiterRouter = require("../src/api/routes/recruiterRoute.js");
const adminRouter = require("../src/api/routes/adminRoute.js");

const app = express();

app.use(
  cors({
    origin: "https://talenttrove.live",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: 'none',
      secure: true
    }
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./api/public")));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", userRouter);
app.use("/api/recruiter", recruiterRouter);
app.use("/api/admin", adminRouter);

// JWT Token generation
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
};
// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://talenttrove.live/signin", // Redirect to login page on failure
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        // If authentication failed, Passport will not attach user to req object
        throw new Error("Authentication failed");
      }
      const user = req.user;
      console.log("user", user);
      const token = generateToken(user);
      res.cookie("token", token);
      res.redirect("https://talenttrove.live"); // Redirect to home page on success
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);
// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 3002;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://talenttrove.live",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Import chat and video logic
const chat = require('./api/services/chat.js')(io);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
