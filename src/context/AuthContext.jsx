import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const navigate = useNavigate();

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log("AuthContext: Restoring user from localStorage", storedUser);
    setUser(storedUser);
    setIsAuthLoaded(true);
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Attempting login with email:", email);
      const response = await api.get(`/users/email/${encodeURIComponent(email)}`);
      const userData = response.data;

      if (!userData) {
        throw new Error("No account found with this email.");
      }

      if (userData.password !== password) {
        throw new Error("Incorrect password.");
      }

      localStorage.setItem("currentUser", JSON.stringify(userData));
      setUser(userData);
      console.log("Logged in user:", userData);
      return userData;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = () => {
    console.log("AuthContext: Logging out, clearing user and localStorage");
    setIsLoggingOut(true);
    setUser(null);
    localStorage.removeItem("currentUser");
    navigate("/", { replace: true });
    setTimeout(() => {
      setIsLoggingOut(false);
      console.log("AuthContext: Logout complete, navigated to /");
    }, 100);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggingOut, isAuthLoaded }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};