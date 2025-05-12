import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoutes from "./routes/CandidateRoutes";
import CompanyRoutes from "./routes/CompanyRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/company/*" element={<CompanyRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
