import React from "react";
import styled from "styled-components";
import heroImg from "../assets/Nerozy.png";
const Hero = styled.section`
  height: 420px;
  background-image: url(${heroImg});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.45));
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 900px;
`;

export default function HeroSection() {
  return (
    <Hero>
      <Overlay />
      <Content>
        <h1 style={{ fontSize: 40, marginBottom: 8 }}>
          Nerozy — Balochi Traditional Shoes
        </h1>
        <p style={{ fontSize: 18 }}>
          Handmade, authentic, timeless — crafted with love and heritage.
        </p>
      </Content>
    </Hero>
  );
}
