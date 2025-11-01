import React from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 900px;
  margin: 24px auto;
  padding: 0 18px;
  font-family: "Georgia", "Times New Roman", serif;
  color: #2b2b25;
`;

const Hero = styled.div`
  background: linear-gradient(180deg, #fff9f2, #fff);
  padding: 36px 20px;
  border-radius: 10px;
  margin-bottom: 18px;
  text-align: center;
`;

const Section = styled.section`
  margin: 18px 0;
  line-height: 1.6;
`;

const Badge = styled.div`
  display: inline-block;
  background: #fff3e6;
  color: #6b4b2a;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 700;
  margin-bottom: 12px;
`;

export default function About() {
  return (
    <Container>
      <Hero>
        <h1 style={{ margin: 0, fontSize: 34 }}>About Nerozy</h1>
        <p style={{ marginTop: 8, color: "#6b6b6b" }}>
          Preserving the art of Balochi shoe-making — handmade by local
          artisans.
        </p>
      </Hero>

      <Section>
        <Badge>Our Mission</Badge>
        <h3 style={{ marginTop: 8 }}>Handmade, Authentic, Timeless</h3>
        <p>
          Nerozy is dedicated to preserving the rich heritage of Balochi
          craftsmanship. Each pair of shoes is created using techniques passed
          down through generations, combining comfort and traditional
          aesthetics.
        </p>
      </Section>

      <Section>
        <Badge>Our Artisans</Badge>
        <h3 style={{ marginTop: 8 }}>Meet the Makers</h3>
        <p>
          We work with skilled artisans who hand-stitch and hand-finish every
          product. Supporting Nerozy means supporting local crafts, fair wages,
          and cultural continuity.
        </p>
      </Section>

      <Section>
        <Badge>How It's Made</Badge>
        <h3 style={{ marginTop: 8 }}>Traditional Methods</h3>
        <p>
          From careful pattern cutting to meticulous stitching, our process
          focuses on durability and authenticity. Materials are chosen for
          longevity and comfort — we believe in products that become part of
          your story.
        </p>
      </Section>

      <Section>
        <h3>Get Involved</h3>
        <p>
          Interested in collaborations, wholesale, or learning the craft? Reach
          out through our Contact page or visit our social channels to follow
          the journey.
        </p>
      </Section>
    </Container>
  );
}
