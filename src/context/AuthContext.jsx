import { createContext, useContext, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser")));

  const login = async (email, password) => {
    try {
      const response = await api.get(`/users?email=${email}&password=${password}`);
      if (response.data.length > 0) {
        const userData = response.data[0];
        localStorage.setItem("currentUser", JSON.stringify(userData));
        setUser(userData);
        console.log("Logged in user:", userData);
        return userData;
      } else {
        throw new Error("Invalid credentials");
      }
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