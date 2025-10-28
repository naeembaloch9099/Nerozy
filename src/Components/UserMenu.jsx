import React from "react";
import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cfe8ff;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #a9c6ff;
  text-decoration: none;
  cursor: pointer;
  padding: 0;
  font-size: 12px;
  font-family: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

export default function UserMenu({ email }) {
  const navigate = useNavigate();

  const clearAllCookies = () => {
    const cookies = ["isAdmin", "adminAuth", "userEmail", "token"];
    cookies.forEach((name) => {
      // Remove SameSite=Strict to allow cookies on HTTP (other devices)
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    });
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Clear all cookies
    clearAllCookies();

    // Navigate to login
    navigate("/login", { replace: true });
  };

  return (
    <Wrap>
      <FaUserCircle size={20} />
      <div style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
        <span style={{ fontWeight: 600 }}>{email || "Guest"}</span>
        {email ? (
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        ) : (
          <a href="/login" style={{ color: "#a9c6ff", textDecoration: "none" }}>
            Login
          </a>
        )}

        {/* Quick category links (only the two requested categories) */}
        <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
          <a
            href="/products?category=Peshwari%20Chappal"
            style={{ color: "#a9c6ff", textDecoration: "none", fontSize: 12 }}
          >
            Peshwari Chappal
          </a>
          <a
            href="/products?category=Nerozi"
            style={{ color: "#a9c6ff", textDecoration: "none", fontSize: 12 }}
          >
            Nerozi
          </a>
        </div>
      </div>
    </Wrap>
  );
}
