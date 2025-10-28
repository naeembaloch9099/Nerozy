import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";
import { fakeLogin } from "../Services/Api";
import { success, error } from "../Utils/notify";
import Logo from "../Assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  // Set secure cookie
  const setSecureCookie = (name, value, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    // Remove Secure flag to allow cookies on HTTP (localhost and other devices)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  };

  // Admin credentials (hardcoded for security)
  const ADMIN_EMAIL = "balochfaheem462@gmail.com";
  const ADMIN_PASSWORD = "Faheem0335";
  const ADMIN_NAME = "Faheem Baloch";

  const submit = async (e) => {
    e.preventDefault();

    // Check if admin credentials
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      // Admin login - set secure cookies and localStorage
      const adminToken = btoa(`${ADMIN_EMAIL}:${Date.now()}:${Math.random()}`);

      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminName", ADMIN_NAME);
      localStorage.setItem("token", adminToken);
      localStorage.setItem("adminAuth", adminToken);

      setSecureCookie("isAdmin", "true", 7);
      setSecureCookie("adminAuth", adminToken, 7);
      setSecureCookie("userEmail", ADMIN_EMAIL, 7);

      login(ADMIN_EMAIL, { name: ADMIN_NAME, isAdmin: true });

      success(`Welcome back, ${ADMIN_NAME}!`);
      nav("/admin", { replace: true });
      return;
    }

    // Regular user login
    try {
      const res = await fakeLogin(email, password);

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        setSecureCookie("token", res.token, 7);
        setSecureCookie("userEmail", email, 7);

        // Fetch user info
        try {
          const DEV_FALLBACK = "http://localhost:4242";
          const BASE =
            typeof import.meta !== "undefined" &&
            import.meta.env &&
            import.meta.env.MODE === "development"
              ? import.meta.env.VITE_API_BASE || DEV_FALLBACK
              : "";
          const meRes = await fetch(`${BASE}/api/auth/me`, {
            headers: { Authorization: `Bearer ${res.token}` },
          });
          if (meRes.ok) {
            const body = await meRes.json();
            if (body && body.user) {
              login(body.user.email, { name: body.user.name });
            }
          }
        } catch {
          // ignore
        }

        success("Logged in successfully!");
        nav("/home", { replace: true });
        return;
      }

      if (res && res.message) {
        success(res.message);
        return;
      }

      throw new Error("Invalid credentials");
    } catch {
      error("Login failed. Check your credentials.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 20,
          padding: "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        {/* Logo Section */}
        <div style={{ marginBottom: 30 }}>
          <img
            src={Logo}
            alt="Logo"
            style={{
              width: "20vw",
              maxWidth: 100,
              height: "auto",
              borderRadius: "50%",
              marginBottom: 10,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#333" }}>
            Welcome Back
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Login to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ textAlign: "left" }}>
          <label style={{ fontWeight: 500, color: "#555" }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              display: "block",
              width: "100%",
              padding: "12px 14px",
              marginBottom: 16,
              borderRadius: 10,
              border: "1px solid #ddd",
              outline: "none",
              fontSize: "1rem",
              transition: "all 0.3s",
            }}
          />

          <label style={{ fontWeight: 500, color: "#555" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              display: "block",
              width: "100%",
              padding: "12px 14px",
              marginBottom: 24,
              borderRadius: 10,
              border: "1px solid #ddd",
              outline: "none",
              fontSize: "1rem",
              transition: "all 0.3s",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1rem",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: 20, color: "#888", fontSize: "0.85rem" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#1f6feb", cursor: "pointer" }}
            onClick={() => nav("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>

      {/* Responsive media queries */}
      <style>
        {`
          @media (max-width: 768px) {
            div[style*="maxWidth: 420px"] {
              padding: 1.5rem;
              margin: 0 1rem;
            }
          }
          @media (max-width: 480px) {
            div[style*="maxWidth: 420px"] img {
              width: 25vw;
            }
            div[style*="maxWidth: 420px"] h1 {
              font-size: 1.3rem;
            }
            div[style*="maxWidth: 420px"] p {
              font-size: 0.8rem;
            }
          }
        `}
      </style>
    </div>
  );
}
