import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/candidate/Home";
import Signin from "../pages/candidate/Signin";
import Signup from "../pages/candidate/Signup";
import ForgotPassword from "../pages/candidate/ForgotPassword";
import ResetPassword from "../pages/candidate/ResetPassword";
import Profile from "../pages/candidate/Profile";
import JobDetails from "../components/candidate/JobDetails/JobDetails";
import OTPForm from "../pages/candidate/OTPForm";
import JobFeed from "../components/candidate/JobFeed";
import Success from "../pages/candidate/Success";
import VerifyProfile from "../pages/candidate/VerifyProfile";
import MyJobs from "../pages/candidate/MyJobs";
import SkillTest from "../pages/candidate/SkillTest";
import JobStatus from "../pages/candidate/JobStatus";
import NotFound from "../components/common/NotFound";
import ChatPage from "../pages/candidate/Chat";
import ProtectedRoute from "../helpers/ProtectedRoute"; 

const CandidateRoutes = () => {
  // Define your routes
  const routes = [
    { path: "/profile", element: <Profile /> },
    { path: "/job-feed", element: <JobFeed /> },
    { path: "/job/:jobId", element: <JobDetails /> },
    { path: "/verify-profile", element: <VerifyProfile /> },
    { path: "/my-jobs", element: <MyJobs /> },
    { path: "/success", element: <Success /> },
    { path: "/skill-test/:skillTestId/:applicationId", element: <SkillTest /> },
    { path: "/job-status/:applicationId", element: <JobStatus /> },
    { path: "/chat", element: <ChatPage /> },
  ];

  return (
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp-form/:email" element={<OTPForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset/:token" element={<ResetPassword />} />
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={<ProtectedRoute>{route.element}</ProtectedRoute>}
        />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default CandidateRoutes;
