import { Navigate, Outlet } from "react-router-dom";

const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

const ProtectedRoute = () => {
  const token = localStorage.getItem("ddtoken");
  const loginTimeStr = localStorage.getItem("loginTime");

  // If missing token or timestamp, force login
  if (!token || !loginTimeStr) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  const loginTime = Number(loginTimeStr);
  const now = Date.now();

  // Expired session → clear and redirect
  if (Number.isNaN(loginTime) || now - loginTime > SESSION_TIMEOUT_MS) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
