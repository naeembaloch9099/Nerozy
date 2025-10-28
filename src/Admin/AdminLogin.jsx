import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { success, error } from "../Utils/notify";
import { fakeLogin } from "../Services/Api";

const Wrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f7fbff, #eef6ff);
  padding: 24px;
`;

const Card = styled.div`
  width: 420px;
  max-width: 100%;
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 12px 40px rgba(2, 6, 23, 0.06);
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e6eefc;
  background: #fbfdff;
`;

const Btn = styled.button`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(90deg, #1f6feb, #8cc3ff);
  color: white;
  font-weight: 700;
  margin-top: 12px;
  cursor: pointer;
`;

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // Only allow the designated admin credentials (client-side guard).
      const ADMIN_EMAIL = "balochfaheem462@gmail.com";
      const ADMIN_PWD = "Faheem0335";
      const ADMIN_NAME = "Faheem Baloch";

      if (email.trim().toLowerCase() === ADMIN_EMAIL && pwd === ADMIN_PWD) {
        // Mark admin session in localStorage for frontend routing checks
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminName", ADMIN_NAME);
        success(`Welcome ${ADMIN_NAME}`);
        // Optionally attempt backend login to obtain a real token (if admin user exists)
        try {
          const res = await fakeLogin(ADMIN_EMAIL, ADMIN_PWD);
          if (res && res.token) localStorage.setItem("token", res.token);
        } catch {
          // ignore backend login error; frontend admin flag is sufficient for UI routing
        }
        navigate("/admin", { replace: true });
      } else {
        error("Invalid admin credentials");
      }
    } catch (err) {
      console.error(err);
      error("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Wrap>
      <Card>
        <h2>Admin Login</h2>
        <p style={{ color: "#556", marginTop: 6, marginBottom: 12 }}>
          Sign in with your admin credentials
        </p>
        <form onSubmit={handleSubmit}>
          <Row>
            <FiMail size={20} />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </Row>

          <Row>
            <FiLock size={20} />
            <Input
              placeholder="Password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              type="password"
            />
          </Row>

          <Btn type="submit" disabled={loading}>
            <span
              style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
            >
              <FiLogIn /> {loading ? "Signing in..." : "Sign in"}
            </span>
          </Btn>
        </form>

        <div style={{ marginTop: 12, fontSize: 13, color: "#667" }}>
          Use the admin email and password provided to you.
        </div>
      </Card>
    </Wrap>
  );
}
