require("dotenv").config();
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path"); 
const { Server } = require("socket.io");

require("./config/db.config.js");

const passport = require("../src/config/passport.config.js");
const userRouter = require("./api/routes/candidate.route.js");
const recruiterRouter = require("../src/api/routes/company.route.js");
const adminRouter = require("../src/api/routes/admin.route.js");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'api/public')));
app.use(passport.initialize());

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api", userRouter);
app.use("/api/company", recruiterRouter);
app.use("/api/admin", adminRouter);

// ✅ Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

require('./api/services/socket.service.js')(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
