import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotFound from '../../pages/NotFound';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const { role } = useParams();
  console.log('Role from params:', role);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection for dashboard, profile, chat
  // Only check if route has a role param (e.g. /dashboard/:role, /profile/:role, /chat/:role)
  if (role && user.role !== role) {
    // Redirect to correct dashboard if role does not match
    return <Navigate to={`/dashboard/${user.role}`} replace />;
    // return <NotFound/>; // Redirect to NotFound if role does not match
  }

  return children;
};

export default ProtectedRoute;
