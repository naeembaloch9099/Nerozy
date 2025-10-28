import React from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 900px;
  margin: 24px auto;
  padding: 0 16px;
`;

export default function About() {
  return (
    <Container>
      <h2>About Nerozy</h2>
      <p>
        Nerozy is dedicated to preserving the rich heritage of Balochi
        traditional shoes. Each shoe is handmade by skilled artisans using
        authentic methods passed down through generations.
      </p>
      <p>
        Our mission is to deliver high-quality, comfortable, and stylish shoes
        that celebrate Balochi culture.
      </p>
    </Container>
  );
}
