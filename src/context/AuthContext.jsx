import { createContext, useContext, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser")));

  const login = async (email, password) => {
    try {
      console.log('Attempting login with email:', email); // Debug log
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
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}