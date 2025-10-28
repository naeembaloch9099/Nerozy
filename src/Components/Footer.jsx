import React from "react";
import styled, { keyframes } from "styled-components";
import { FaFacebookF, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

const glow = keyframes`
  0% { box-shadow: 0 0 20px rgba(99,102,241,0.4), 0 0 40px rgba(168,85,247,0.2); }
  50% { box-shadow: 0 0 35px rgba(168,85,247,0.6), 0 0 60px rgba(99,102,241,0.4); }
  100% { box-shadow: 0 0 20px rgba(99,102,241,0.4), 0 0 40px rgba(168,85,247,0.2); }
`;

const Foot = styled.footer`
  position: relative;
  background: linear-gradient(145deg, #0f172a, #1e293b);
  color: #e2e8f0;
  padding: 60px 24px 30px;
  overflow: hidden;
  z-index: 1;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at top,
      rgba(99, 102, 241, 0.25),
      transparent 70%
    );
    z-index: 0;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -60px;
    left: 50%;
    transform: translateX(-50%);
    width: 120%;
    height: 150px;
    background: linear-gradient(90deg, #667eea, #764ba2, #ec4899);
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.4;
    z-index: -1;
    animation: ${glow} 6s infinite ease-in-out;
  }
`;

const Inner = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 40px;
  text-align: left;
`;

const Section = styled.div`
  h3,
  h4 {
    color: #fff;
    margin-bottom: 12px;
    letter-spacing: 1px;
  }
  p,
  a,
  div {
    font-size: 0.95rem;
    color: #cbd5e1;
    line-height: 1.6;
  }
  a {
    text-decoration: none;
    transition: all 0.3s ease;
  }
  a:hover {
    color: #a78bfa;
    transform: translateX(5px);
  }
`;

const Socials = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.05),
      0 4px 12px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    color: #cbd5e1;
  }
  a:hover {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: #fff;
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
  }
`;

const Bottom = styled.div`
  margin-top: 50px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
  text-align: center;
  font-size: 0.85rem;
  color: #94a3b8;
`;

export default function Footer() {
  return (
    <Foot>
      <Inner>
        <Section>
          <h3>Nerozy</h3>
          <p>
            Handmade Balochi traditional shoes — crafted with passion and pride.
            Every pair tells a story of heritage and craftsmanship.
          </p>
        </Section>

        <Section>
          <h4>Quick Links</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <a href="/">Home</a>
            <a href="/shop">Shop</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>
        </Section>

        <Section>
          <h4>Contact</h4>
          <div>Email: hello@nerozy.com</div>
          <div>Phone: +92 333 1234567</div>
          <Socials>
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
            <a href="#">
              <FaGithub />
            </a>
          </Socials>
        </Section>
      </Inner>

      <Bottom>© {new Date().getFullYear()} Nerozy. All rights reserved.</Bottom>
    </Foot>
  );
}
