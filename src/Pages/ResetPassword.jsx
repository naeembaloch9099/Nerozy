import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { success, error } from "../Utils/notify";
import Logo from "../Assets/logo.png";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const tokenFromUrl = searchParams.get("token") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !token || !newPassword) {
      error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      error("Password must be at least 6 characters");
      return;
    }

    setIsResetting(true);
    try {
      const DEV_FALLBACK = "https://nerozyserver-production.up.railway.app";
      const BASE =
        typeof import.meta !== "undefined" &&
        import.meta.env &&
        import.meta.env.MODE === "development"
          ? import.meta.env.VITE_API_BASE || DEV_FALLBACK
          : "";

      const res = await fetch(`${BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        success(
          "Password reset successfully! Please login with your new password."
        );
        setTimeout(() => nav("/login"), 2000);
      } else {
        error(data.error || "Failed to reset password");
      }
    } catch {
      error("Failed to reset password. Please try again.");
    } finally {
      setIsResetting(false);
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
            Reset Password
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Enter your reset code and new password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <label style={{ fontWeight: 500, color: "#555" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{
              display: "block",
              width: "100%",
              padding: "12px 14px",
              marginBottom: 16,
              borderRadius: 10,
              border: "1px solid #ddd",
              outline: "none",
              fontSize: "1rem",
            }}
          />

          <label style={{ fontWeight: 500, color: "#555" }}>Reset Code</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter 6-digit code"
            required
            maxLength={6}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 14px",
              marginBottom: 16,
              borderRadius: 10,
              border: "1px solid #ddd",
              outline: "none",
              fontSize: "1rem",
              letterSpacing: "0.2em",
            }}
          />

          <label style={{ fontWeight: 500, color: "#555" }}>New Password</label>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 45px 12px 14px",
                borderRadius: 10,
                border: "1px solid #ddd",
                outline: "none",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "#666",
              }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <label style={{ fontWeight: 500, color: "#555" }}>
            Confirm Password
          </label>
          <div style={{ position: "relative", marginBottom: 24 }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 45px 12px 14px",
                borderRadius: 10,
                border: "1px solid #ddd",
                outline: "none",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "#666",
              }}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isResetting}
            style={{
              width: "100%",
              padding: "12px",
              background: isResetting
                ? "#ccc"
                : "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1rem",
              border: "none",
              borderRadius: 12,
              cursor: isResetting ? "not-allowed" : "pointer",
              boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
            }}
          >
            {isResetting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p style={{ marginTop: 20, color: "#888", fontSize: "0.85rem" }}>
          Remember your password?{" "}
          <span
            style={{ color: "#1f6feb", cursor: "pointer" }}
            onClick={() => nav("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
