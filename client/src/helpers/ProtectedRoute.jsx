import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.adminAuth || state.recruiterAuth || state.candidateAuth);

  return token ? children : <Navigate to="/signin" replace />;
};
export default ProtectedRoute