import { Navigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const { role } = useParams();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Apply role-based restriction only for /dashboard/:role routes
  if (role && location.pathname.startsWith("/dashboard") && user.role !== role) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;