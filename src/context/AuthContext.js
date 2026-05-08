"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Runs once on mount — synchronous localStorage read, no async delay
  useEffect(() => {
    try {
      const saved = authService.getSavedUser();
      if (saved) setUser(saved);
    } catch {
      // corrupted storage — ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { user: loggedInUser, token } = await authService.login(email, password);
    authService.saveSession(loggedInUser, token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    authService.clearSession();
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
