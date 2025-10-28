import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";
import { info, success, error } from "../Utils/notify";
import {
  signup as apiSignup,
  verifyOtp as apiVerifyOtp,
} from "../Services/Api";
import styled, { keyframes } from "styled-components";

// 3D button animation
const floatBtn = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 420px;
  color: #fff;
  text-align: center;

  h2 {
    margin-bottom: 1.5rem;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 1px;
    text-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  position: relative;
  input {
    width: 100%;
    padding: 14px 12px;
    border-radius: 12px;
    border: none;
    outline: none;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    backdrop-filter: blur(5px);
    transition: 0.3s;
    box-sizing: border-box;

    &.with-icon {
      padding-right: 45px;
    }
  }

  label {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    font-size: 1rem;
    color: #eee;
    pointer-events: none;
    transition: 0.3s;
  }

  input:focus + label,
  input:not(:placeholder-shown) + label {
    top: -8px;
    font-size: 0.8rem;
    color: #fff;
  }

  span {
    color: #ff6b6b;
    font-size: 0.8rem;
    margin-top: 2px;
    display: block;
  }

  button.eye-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: #fff;
    padding: 0 8px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }
`;

const Button3D = styled.button`
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  background: linear-gradient(145deg, #667eea, #764ba2);
  color: #fff;
  box-shadow: 0 6px 0 #5a67d8, 0 6px 12px rgba(0, 0, 0, 0.2);
  animation: ${floatBtn} 2s ease-in-out infinite;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 0 #5a67d8, 0 8px 16px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #5a67d8, 0 4px 6px rgba(0, 0, 0, 0.2);
  }
`;

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login } = useAuth();
  const nav = useNavigate();

  // Frontend validation
  function validate() {
    const e = {};
    if (!name || name.trim().length < 3)
      e.name = "Name must be at least 3 chars";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) e.email = "Please enter a valid email";
    const passRe = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passRe.test(password))
      e.password = "Password must be 6+ chars & include letters and numbers";
    if (password !== confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // Signup & handle backend errors
  async function sendOtp() {
    try {
      const res = await apiSignup({ name, email, password });
      if (res.devOtp) info(`OTP (dev): ${res.devOtp}`);
      setShowOtp(true);
    } catch (ex) {
      console.error(ex);
      // Handle duplicate email specifically
      if (ex.message?.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: ex.message }));
      } else {
        error(ex.message || "Signup failed");
      }
    }
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    sendOtp();
  };

  const verifyOtp = async (ev) => {
    ev.preventDefault();
    try {
      const res = await apiVerifyOtp(email, otp);
      if (res?.token) {
        localStorage.setItem("token", res.token);
        login(email, { name });
        success("Signup successful");
        nav("/home");
      } else {
        error(res?.error || "Verification failed");
      }
    } catch (ex) {
      console.error(ex);
      error(ex.message || "Verification error");
    }
  };

  return (
    <Container>
      <Card>
        <h2>Create account</h2>
        {!showOtp ? (
          <Form onSubmit={submit} noValidate>
            <InputGroup>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
              />
              <label>Name</label>
              {errors.name && <span>{errors.name}</span>}
            </InputGroup>

            <InputGroup>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
              />
              <label>Email</label>
              {errors.email && <span>{errors.email}</span>}
            </InputGroup>

            <InputGroup>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="with-icon"
              />
              <label>Password</label>
              <button
                type="button"
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
              {errors.password && <span>{errors.password}</span>}
            </InputGroup>

            <InputGroup>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder=" "
                className="with-icon"
              />
              <label>Confirm Password</label>
              <button
                type="button"
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
              {errors.confirm && <span>{errors.confirm}</span>}
            </InputGroup>

            <Button3D type="submit">Create account</Button3D>
          </Form>
        ) : (
          <Form onSubmit={verifyOtp}>
            <p>
              Enter the 6-digit OTP sent to your email (dev mode shows toast)
            </p>
            <InputGroup>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder=" "
              />
              <label>OTP</label>
            </InputGroup>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <Button3D type="button" onClick={() => setShowOtp(false)}>
                Back
              </Button3D>
              <Button3D type="submit">Verify OTP</Button3D>
            </div>
          </Form>
        )}
      </Card>
    </Container>
  );
}
