import { createContext, useContext, useState, useCallback } from "react";
import { getJSON, setJSON, clearAuth } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => getJSON("user"));
  const [skills, setSkills] = useState(() => getJSON("skills") || []);

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem("token", newToken);
    setJSON("user", newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
    setSkills([]);
  }, []);

  const updateSkills = useCallback((newSkills) => {
    setJSON("skills", newSkills);
    setSkills(newSkills);
  }, []);

  const value = {
    token,
    user,
    skills,
    isAuthenticated: !!token,
    hasSkills: skills.length > 0,
    login,
    logout,
    updateSkills,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}