import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AsyncToastContainer } from "./Utils/notify";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import ProductDetail from "./Pages/ProductDetails";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ResetPassword from "./Pages/ResetPassword";
import AdminDashboard from "./Admin/Admindashboard";
import AdminProducts from "./Admin/AdminProduct";
import AdminSidebar from "./Admin/AdminSidebar";
import AdminOrders from "./Admin/AdminOrders";
import Checkout from "./Pages/Checkout";
import CheckoutSuccess from "./Pages/CheckoutSuccess";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { CartProvider } from "./Context/Cart";
import { AuthProvider } from "./Context/Auth";
import styled from "styled-components";

const AppLayout = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
`;

function AppContent() {
  const location = useLocation();
  const hideShell =
    ["/login", "/signup"].includes(location.pathname) ||
    location.pathname.startsWith("/admin");

  // Get cookie value
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Verify admin authentication
  function isAdminAuthed() {
    try {
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      const adminAuth = localStorage.getItem("adminAuth");
      const adminCookie = getCookie("isAdmin");
      const adminAuthCookie = getCookie("adminAuth");

      // Must have both localStorage AND cookies
      return (
        isAdmin &&
        adminAuth &&
        adminCookie === "true" &&
        adminAuthCookie === adminAuth
      );
    } catch {
      return false;
    }
  }

  // Protected Admin Route Component
  function ProtectedAdminRoute({ children }) {
    if (!isAdminAuthed()) {
      // Clear any partial auth data
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminName");
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  function ConditionalLayout() {
    if (hideShell) return <></>;
    return <Navbar />;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <AppLayout>
          {/* Conditionally render Navbar */}
          <ConditionalLayout />
          <Main>
            <Routes>
              {/* Root opens login by default */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />

              {/* Protected Admin routes - requires authentication */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedAdminRoute>
                    <div style={{ display: "flex" }}>
                      <AdminSidebar />
                      <div
                        style={{
                          flex: 1,
                          padding: window.innerWidth <= 820 ? "0" : "20px",
                          marginLeft: window.innerWidth > 820 ? "0" : "0",
                          marginTop: window.innerWidth <= 820 ? "75px" : "0",
                          width: "100%",
                        }}
                      >
                        <Routes>
                          <Route path="" element={<AdminDashboard />} />
                          <Route path="products" element={<AdminProducts />} />
                          <Route path="orders" element={<AdminOrders />} />
                        </Routes>
                      </div>
                    </div>
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
          </Main>
          {/* AsyncToastContainer is a safe no-op container that avoids importing the toast library at module-eval time */}
          <AsyncToastContainer />
          {!hideShell && <Footer />}
        </AppLayout>
      </CartProvider>
    </AuthProvider>
  );
}

export default function App() {
  return <AppContent />;
}
