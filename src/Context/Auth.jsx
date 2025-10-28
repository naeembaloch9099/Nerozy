/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";
import { success as toastSuccess } from "../Utils/notify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Try to validate token and load current user on mount
  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        // determine base same as Api.js
        const DEV_FALLBACK = "http://localhost:4242";
        const BASE =
          typeof import.meta !== "undefined" &&
          import.meta.env &&
          import.meta.env.MODE === "development"
            ? import.meta.env.VITE_API_BASE || DEV_FALLBACK
            : "";
        const res = await fetch(`${BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          // invalid token
          setUser(null);
          return;
        }
        const body = await res.json();
        if (body && body.user) setUser(body.user);
      } catch {
        // ignore
      }
    }
    load();
  }, []);

  function logout() {
    setUser(null);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
    } catch {
      /* ignore */
    }
    // Show a friendly toast on logout
    try {
      toastSuccess("Logged out successfully");
    } catch {
      /* ignore toast error */
    }
  }

  function login(email, profile = {}) {
    setUser({ email, name: profile.name || email.split("@")[0] });
  }

  return (
    <AuthContext.Provider value={{ user, logout, login }}>
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
}
