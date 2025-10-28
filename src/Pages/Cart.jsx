import React from "react";
import { useCart } from "../Context/Cart";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { info } from "../Utils/notify";

const Container = styled.div`
  max-width: 900px;
  margin: 32px auto;
  padding: 0 16px;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const Button3D = styled.button`
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(145deg, #667eea, #764ba2);
  box-shadow: 0 6px 0 #5a67d8, 0 6px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 0 #5a67d8, 0 8px 12px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #5a67d8, 0 4px 6px rgba(0, 0, 0, 0.2);
  }
`;

const TotalRow = styled.div`
  text-align: right;
  font-weight: 700;
  font-size: 1.2rem;
  margin-top: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const nav = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <Container>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>Your Cart</h2>
      {cart.length === 0 ? (
        <p style={{ fontSize: "1rem", color: "#666" }}>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item, idx) => (
            <ItemRow key={idx}>
              <div>
                <strong style={{ fontSize: "1rem" }}>{item.name}</strong>
                <div style={{ color: "#555" }}>
                  Color: {item.color} | Size: {item.size}
                </div>
                <div style={{ color: "#555" }}>Quantity: {item.quantity}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </span>
                <Button3D
                  onClick={() => {
                    removeFromCart(idx);
                    info("Removed from cart");
                  }}
                >
                  Remove
                </Button3D>
              </div>
            </ItemRow>
          ))}
          <TotalRow>
            Total: ${total.toFixed(2)}
            <ButtonGroup>
              <Button3D
                onClick={() => {
                  clearCart();
                  info("Cart cleared");
                }}
              >
                Clear
              </Button3D>
              <Button3D
                onClick={() => {
                  nav("/checkout");
                  info("Proceeding to checkout (Stripe placeholder)");
                }}
              >
                Checkout
              </Button3D>
            </ButtonGroup>
          </TotalRow>
        </>
      )}
    </Container>
  );
}
