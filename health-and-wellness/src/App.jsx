import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import AsterFlint from "./pages/AsterFlint";
import ProtectedRoute from "./routes/ProtectedRoute"; // ✅ IMPORT

const App = () => {
  useEffect(() => {
    document.body.classList.add("styles-loaded");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* ✅ PROTECTED DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/asterflint" element={<AsterFlint />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
