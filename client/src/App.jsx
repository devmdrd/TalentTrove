import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CandidateRoutes from "./routes/CandidateRoutes";
import RecruiterRoutes from "./routes/RecruiterRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<CandidateRoutes />} />
        <Route path="/recruiter/*" element={<RecruiterRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
