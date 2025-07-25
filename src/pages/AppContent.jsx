import { useAuth } from "../context/AuthContext";
import AppRoutes from "../routes/AppRoutes";
import { Navigate } from "react-router-dom";


const AppContent = () => {
  const { user, isLoggingOut, isAuthLoaded } = useAuth();
  const currentPath = window.location.pathname;

  console.log("AppContent: Checking user =", !!user, "isLoggingOut =", isLoggingOut, "isAuthLoaded =", isAuthLoaded, "path =", currentPath);

  // Wait for auth state to load
  if (!isAuthLoaded) {
    console.log("AppContent: Auth state not loaded, rendering nothing");
    return null;
  }

  // Redirect authenticated users from / or /login to their dashboard
  if (user && !isLoggingOut && ["/", "/login"].includes(currentPath)) {
    const redirectTo = `/dashboard/${user.role}`;
    console.log("AppContent: Authenticated user on / or /login, redirecting to", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  // Redirect unauthenticated users to homepage for non-public routes
  if (!user && !isLoggingOut && !["/", "/login", "/register"].includes(currentPath)) {
    console.log("AppContent: No user, redirecting to / from", currentPath);
    return <Navigate to="/" replace />;
  }

  console.log("AppContent: Rendering AppRoutes");
  return <AppRoutes />;
};

export default AppContent;