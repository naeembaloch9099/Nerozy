import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiBox, FiList, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

const Sidebar = styled.aside`
  width: 240px;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  padding: 28px 20px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: linear-gradient(180deg, #fbfdff, #f6f9ff);
  box-shadow: 0 8px 30px rgba(2, 6, 23, 0.03);
  z-index: 1000;

  @media (max-width: 820px) {
    position: fixed;
    width: 100%;
    height: auto;
    padding: 18px 20px;
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 4px 12px rgba(2, 6, 23, 0.06);
  }
`;

const Brand = styled.div`
  font-weight: 800;
  margin-bottom: 18px;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;

  @media (max-width: 820px) {
    margin-bottom: 0;
    justify-content: center;
    position: relative;
  }
`;

const BrandText = styled.div`
  @media (max-width: 820px) {
    text-align: center;
    flex: 1;
  }
`;

const NavCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 820px) {
    display: ${(p) => (p.$open ? "flex" : "none")};
    margin-top: 12px;
    padding-bottom: 8px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #0f172a;
  padding: 10px 12px;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 200ms ease, box-shadow 220ms ease, background 220ms;
  display: inline-flex;
  gap: 8px;
  align-items: center;

  &:hover {
    transform: translateY(-6px) rotateX(6deg);
    box-shadow: 0 14px 30px rgba(31, 111, 235, 0.08);
    background: linear-gradient(
      90deg,
      rgba(31, 111, 235, 0.06),
      rgba(140, 195, 255, 0.04)
    );
  }
`;

const ActionBtn = styled.button`
  background: transparent;
  border: 0;
  padding: 10px 12px;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  color: #d9534f;
  font-weight: 700;
  display: inline-flex;
  gap: 8px;
  align-items: center;

  &:hover {
    transform: translateX(6px);
  }
`;

const MobileToggle = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 8px;
  display: none;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 820px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
  }
`;

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Clear all cookies
  const clearAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  };

  function handleLogout() {
    // Clear all admin authentication data
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminName");
    localStorage.removeItem("token");

    // Clear all cookies
    clearAllCookies();

    navigate("/login", { replace: true });
  }

  return (
    <>
      <Sidebar>
        <Brand>
          <MobileToggle onClick={() => setOpen((s) => !s)} aria-label="menu">
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </MobileToggle>
          <BrandText>Admin — Nerozy</BrandText>
        </Brand>

        <NavCol $open={open}>
          <StyledLink to="/admin" onClick={() => setOpen(false)}>
            <FiHome /> Dashboard
          </StyledLink>

          <StyledLink to="/admin/products" onClick={() => setOpen(false)}>
            <FiBox /> Products
          </StyledLink>

          <StyledLink to="/admin/orders" onClick={() => setOpen(false)}>
            <FiList /> Orders
          </StyledLink>

          <ActionBtn onClick={handleLogout} title="Logout">
            <FiLogOut /> Logout
          </ActionBtn>
        </NavCol>
      </Sidebar>

      {/* spacer keeps the admin content from sliding under the fixed sidebar on wide screens */}
      <div
        style={{
          width: window.innerWidth > 820 ? 240 : 0,
          flex: window.innerWidth > 820 ? "0 0 240px" : "0",
        }}
        aria-hidden
      />
    </>
  );
}
