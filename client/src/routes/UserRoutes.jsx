import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/user/Home";
import Signin from "../pages/user/Signin";
import Signup from "../pages/user/Signup";
import ForgotPassword from "../pages/user/ForgotPassword";
import ResetPassword from "../pages/user/ResetPassword";
import OTPForm from "../pages/user/OTPForm";

import Profile from "../pages/user/Profile";
import JobFeed from "../pages/user/Jobs";
import SavedJobs from "../pages/user/SavedJobs";
import MyJobs from "../pages/user/MyJobs";
import SkillTest from "../pages/user/SkillTest";
import ChatPage from "../pages/user/Chat";

import NotFound from "../components/common/NotFound";
import ProtectedRoute from "../helpers/ProtectedRoute";

const protectedRoutes = [
  { path: "/profile", element: <Profile /> },
  { path: "/jobs", element: <JobFeed /> },
  { path: "/saved-jobs", element: <SavedJobs /> },
  { path: "/my-jobs", element: <MyJobs /> },
  { path: "/skill-test/:applicationId", element: <SkillTest /> },
  { path: "/:candidateId/chat", element: <ChatPage /> },
  { path: "/:candidateId/chat/:companyId", element: <ChatPage /> },
];

const UserRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signin" element={<Signin />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/otp-form/:email" element={<OTPForm />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />

    {protectedRoutes.map(({ path, element }) => (
      <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
    ))}

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default UserRoutes;
