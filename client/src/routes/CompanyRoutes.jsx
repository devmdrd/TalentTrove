import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/company/Home";
import Signin from "../pages/company/Signin";
import Signup from "../pages/company/Signup";
import ForgotPassword from "../pages/company/ForgotPassword";
import ResetPassword from "../pages/company/ResetPassword";

import Profile from "../pages/company/Profile";
import JobPost from "../pages/company/JobPost";
import JobsPosted from "../pages/company/JobsPosted";
import JobDetails from "../pages/company/JobDetails";
import ChatPage from "../pages/company/Chat";

import NotFound from "../components/common/NotFound";
import ProtectedRoute from "../helpers/ProtectedRoute";

const protectedRoutes = [
  { path: "/profile", element: <Profile /> },
  { path: "/create-job", element: <JobPost /> },
  { path: "/jobs", element: <JobsPosted /> },
  { path: "/jobs/:id", element: <JobDetails /> },
  { path: "/:companyId/chat", element: <ChatPage /> },
  { path: "/:companyId/chat/:candidateId", element: <ChatPage /> },
];

const CompanyRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signin" element={<Signin />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />

    {protectedRoutes.map(({ path, element }) => (
      <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
    ))}

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default CompanyRoutes;
