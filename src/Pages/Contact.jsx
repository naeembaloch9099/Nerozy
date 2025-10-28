import React from "react";
import { success as notifySuccess } from "../Utils/notify";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 24px auto;
  padding: 0 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: none;
`;

const Button = styled.button`
  padding: 10px;
  background: #e23e57;
  color: white;
  border-radius: 6px;
  cursor: pointer;
`;

export default function Contact() {
  function handleSubmit(e) {
    e.preventDefault();
    notifySuccess("Message sent!");
  }

  return (
    <Container>
      <h2>Contact Nerozy</h2>
      <Form onSubmit={handleSubmit}>
        <Input type="text" placeholder="Name" required />
        <Input type="email" placeholder="Email" required />
        <Textarea placeholder="Message" rows="5" required />
        <Button type="submit">Send Message</Button>
      </Form>
    </Container>
  );
}
