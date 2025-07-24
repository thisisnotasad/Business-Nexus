
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isLoggingOut } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute: Checking user =", !!user, "isLoggingOut =", isLoggingOut, "path =", location.pathname);

  if (!user && !isLoggingOut) {
    console.log("ProtectedRoute: No user and not logging out, redirecting to /login from", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute: Rendering children for", location.pathname);
  return children;
};

export default ProtectedRoute;
