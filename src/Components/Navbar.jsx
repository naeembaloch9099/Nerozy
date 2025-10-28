import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import SearchBar from "./SearchBar";
import { useAuth } from "../Context/Auth";
import { useCart } from "../Context/Cart";
import { FiShoppingCart, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Logo from "../assets/Logo.png";

const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 };

const NavWrap = styled.header`
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 10px 16px;
  position: sticky;
  top: 0;
  z-index: 60;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 64px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Center = styled.nav`
  display: none;
  gap: 18px;
  align-items: center;

  a {
    text-decoration: none;
    color: #333;
    font-weight: 600;
  }

  @media (min-width: ${breakpoints.md}px) {
    display: flex;
  }
`;

const Right = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SearchWrap = styled.div`
  @media (max-width: ${breakpoints.md - 1}px) {
    display: none;
  }
`;

const AvatarWrap = styled.div`
  @media (max-width: ${breakpoints.md - 1}px) {
    display: none;
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
`;

const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 42px;
  background: white;
  border: 1px solid #eee;
  padding: 10px;
  min-width: 180px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
`;

const CartIcon = styled.div`
  cursor: pointer;
  position: relative;
`;

const CartCount = styled.span`
  position: absolute;
  top: -6px;
  right: -8px;
  font-size: 12px;
  background: #e23e57;
  color: white;
  border-radius: 12px;
  padding: 2px 6px;
`;

const HamburgerButton = styled.button`
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;

  @media (min-width: ${breakpoints.md}px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  right: 0;
  background: white;
  box-shadow: 0 8px 30px rgba(2, 6, 23, 0.08);
  z-index: 80;
  border-top: 1px solid #eee;

  @media (min-width: ${breakpoints.md}px) {
    display: none;
  }
`;

const MobileNavLink = styled(NavLink)`
  display: block;
  padding: 12px 8px;
  border-radius: 8px;
  text-decoration: none;
  color: #222;
  font-weight: 700;
  &:hover {
    background: #f5f7ff;
  }
`;

const Button3D = styled.button`
  flex: 1;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  background: linear-gradient(145deg, #667eea, #764ba2);
  color: #fff;
  box-shadow: 0 6px 0 #5a67d8, 0 6px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 0 #5a67d8, 0 8px 12px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #5a67d8, 0 4px 6px rgba(0, 0, 0, 0.2);
  }
`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <NavWrap>
      <TopRow>
        <Left>
          <Link
            to="/home"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <img
              src={Logo}
              alt="logo"
              style={{ height: 36, borderRadius: 8 }}
            />
            <div style={{ fontSize: 16, fontWeight: 800 }}>
              Nerozy
              <div style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>
                Baloch Tradition
              </div>
            </div>
          </Link>
        </Left>

        <Center>
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </Center>

        <Right>
          <SearchWrap>
            <SearchBar />
          </SearchWrap>

          <CartIcon onClick={() => navigate("/cart")}>
            <FiShoppingCart size={20} />
            {cart && cart.length > 0 && <CartCount>{cart.length}</CartCount>}
          </CartIcon>

          <AvatarWrap>
            <Avatar onClick={() => setOpen((s) => !s)}>
              <FaUserCircle size={22} />
            </Avatar>
            {open && (
              <Dropdown>
                {user ? (
                  <>
                    <div style={{ fontSize: 14, marginBottom: 8 }}>
                      {user.email}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                    >
                      <FiLogOut style={{ marginRight: 8 }} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: 8 }}>Not signed in</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button3D
                        onClick={() => {
                          navigate("/login");
                          setOpen(false);
                        }}
                      >
                        Login
                      </Button3D>
                      <Button3D
                        onClick={() => {
                          navigate("/signup");
                          setOpen(false);
                        }}
                      >
                        Sign Up
                      </Button3D>
                    </div>
                  </>
                )}
              </Dropdown>
            )}
          </AvatarWrap>

          <HamburgerButton
            aria-label="Open menu"
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </HamburgerButton>
        </Right>

        {mobileOpen && (
          <MobileMenu>
            <div style={{ padding: 16 }}>
              <nav
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginTop: 12,
                }}
              >
                <MobileNavLink onClick={() => setMobileOpen(false)} to="/home">
                  Home
                </MobileNavLink>
                <MobileNavLink onClick={() => setMobileOpen(false)} to="/about">
                  About
                </MobileNavLink>
                <MobileNavLink
                  onClick={() => setMobileOpen(false)}
                  to="/contact"
                >
                  Contact
                </MobileNavLink>
              </nav>

              {!user && (
                <div
                  style={{
                    marginTop: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <Button3D
                    onClick={() => {
                      navigate("/login");
                      setMobileOpen(false);
                    }}
                  >
                    Login
                  </Button3D>
                  <Button3D
                    onClick={() => {
                      navigate("/signup");
                      setMobileOpen(false);
                    }}
                  >
                    Sign Up
                  </Button3D>
                </div>
              )}
            </div>
          </MobileMenu>
        )}
      </TopRow>
    </NavWrap>
  );
}
