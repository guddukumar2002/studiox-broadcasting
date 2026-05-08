"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Read localStorage synchronously on first render — eliminates the
  // loading flash on the root page entirely (no useEffect delay needed).
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try { return authService.getSavedUser(); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
