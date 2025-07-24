import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser")));
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

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
    return new Promise((resolve) => {
      console.log("AuthContext: Logging out, clearing user and localStorage");
      setIsLoggingOut(true);
      setUser(null);
      localStorage.removeItem("currentUser");
      // Navigate to homepage
      navigate("/", { replace: true });
      // Clear isLoggingOut after navigation
      setTimeout(() => {
        setIsLoggingOut(false);
        console.log("AuthContext: Logout complete, navigated to /");
        resolve();
      }, 100); 
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggingOut, setIsLoggingOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}