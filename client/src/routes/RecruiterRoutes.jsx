import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/recruiter/Home";
import Signin from "../pages/recruiter/Signin";
import Signup from "../pages/recruiter/Signup";
import ForgotPassword from "../pages/recruiter/ForgotPassword";
import Profile from "../pages/recruiter/Profile";
import JobPost from "../pages/recruiter/JobPost";
import QuickProfile from "../pages/recruiter/QuickProfile";
import JobsPosted from "../pages/recruiter/JobsPosted";
import ResetPassword from "../pages/recruiter/ResetPassword";
import Success from "../pages/recruiter/Success";
import JobApplications from "../pages/recruiter/JobApplications";
import CandidateDetails from "../pages/recruiter/ApplicantDetails";
import SkillTest from "../pages/recruiter/SkillTest";
import AddedSkillTests from "../pages/recruiter/AddedSkillTests";
import TestDetails from "../pages/recruiter/TestDetails";
import SkillTestResults from "../pages/recruiter/TestResults";
import AcceptedApplications from "../pages/recruiter/AcceptedApplications";
import ChatPage from "../pages/recruiter/Chat";
import VideoChat from "../pages/recruiter/VideoChat";
import NotFound from "../components/common/NotFound";
import ProtectedRoute from "../helpers/ProtectedRoute"; 

const routes = [
  { path: "/profile", element: <Profile /> },
  { path: "/job-post", element: <JobPost /> },
  { path: "/posted-jobs", element: <JobsPosted /> },
  { path: "/jobs/:id", element: <JobApplications /> },
  { path: "/applicant/:id/:applicationId", element: <CandidateDetails /> },
  { path: "/create-test", element: <SkillTest /> },
  { path: "/created-tests", element: <AddedSkillTests /> },
  { path: "/test-details/:id", element: <TestDetails /> },
  { path: "/test-results", element: <SkillTestResults /> },
  { path: "/accepted-applications", element: <AcceptedApplications /> },
  { path: "/quick-profile", element: <QuickProfile /> },
  { path: "/chat", element: <ChatPage /> },
  { path: "/chat/:candidateId", element: <ChatPage /> },
  { path: "/meeting", element: <VideoChat /> },
];

const RecruiterRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/success" element={<Success />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/:token" element={<ResetPassword />} />
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

export default RecruiterRoutes;
