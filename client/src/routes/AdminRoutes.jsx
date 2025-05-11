import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/admin/Home";
import Signin from "../pages/admin/Signin";

import ProtectedRoute from "../helpers/ProtectedRoute";
import NotFound from "../components/common/NotFound";

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path="/signin" element={<Signin />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AdminRoutes;
