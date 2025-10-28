import React, { useEffect, useState } from "react";
import { useCart } from "../Context/Cart";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  error as notifyError,
  success as notifySuccess,
} from "../Utils/notify";

// Container
const Container = styled.div`
  max-width: 960px;
  margin: 32px auto;
  padding: 0 16px;

  @media (max-width: 640px) {
    margin: 16px auto;
    padding: 0 12px;
  }
`;

// Floating Cart for Mobile
const FloatingCart = styled.div`
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  background: linear-gradient(145deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  z-index: 100;
  display: none;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    font-size: 1rem;
    padding: 12px;
    bottom: 12px;
  }

  @media (max-width: 480px) {
    width: 95%;
    font-size: 0.95rem;
    padding: 10px;
  }
`;

// Tailwind-like breakpoints
const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

const mq = (key) => `@media (max-width: ${breakpoints[key]})`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;

  span:first-child {
    flex: 1;
    word-break: break-word;
    margin-right: 8px;
  }

  span:last-child {
    font-weight: 600;
    min-width: 60px;
    text-align: right;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    font-size: 0.9rem;

    span:last-child {
      align-self: flex-end;
    }
  }
`;

// Buttons
const Button3D = styled.button`
  padding: 14px 22px;
  border-radius: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(145deg, #667eea, #764ba2);
  box-shadow: 0 6px 0 #5a67d8, 0 6px 14px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  font-size: 1rem;
  width: 100%;
  display: block;
  margin: 0 auto;

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 9px 0 #5a67d8, 0 10px 18px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #5a67d8, 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  @media (min-width: 768px) {
    width: auto;
    max-width: 200px;
  }
`;

// Delivery Form
const DeliveryForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;

  input {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 0.95rem;
    outline: none;
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
  }

  input:focus {
    border-color: #667eea;
    box-shadow: 0 0 8px rgba(102, 126, 234, 0.25);
  }

  ${mq("md")} {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;

    input {
      padding: 10px;
      font-size: 0.9rem;
    }
  }
`;

// Order Summary Card
const OrderSummaryCard = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
  max-height: 350px;
  overflow-y: auto;

  h4 {
    margin-top: 0;
    margin-bottom: 12px;
    font-size: 1.1rem;
  }

  div {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-weight: 500;
    font-size: 0.95rem;
  }

  @media (max-width: 600px) {
    max-height: none;
    padding: 12px;
  }
  ${mq("md")} {
    max-height: none;
  }

  @media (max-width: 480px) {
    padding: 10px;

    h4 {
      font-size: 1rem;
    }

    div {
      font-size: 0.9rem;
    }
  }
`;

// Headings
const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 24px;
  text-align: center;

  @media (max-width: 640px) {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const Subtitle = styled.h3`
  margin-bottom: 12px;
  font-size: 1.2rem;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

// Errors
const Errors = styled.div`
  color: #d9534f;
  font-size: 0.9rem;
  margin-top: 8px;

  div {
    margin-bottom: 4px;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

// Responsive Grid wrapper
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
  margin-bottom: 24px;

  ${mq("md")} {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 20px;
  }
`;

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const nav = useNavigate();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [postal, setPostal] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [animatedTotal, setAnimatedTotal] = useState(0);

  const total = cart.reduce(
    (s, it) => s + (it.price || 0) * (it.quantity || 1),
    0
  );

  // Animate total number
  useEffect(() => {
    let start = 0;
    const duration = 500;
    const increment = total / (duration / 16);
    const animate = () => {
      start += increment;
      if (start < total) {
        setAnimatedTotal(start);
        requestAnimationFrame(animate);
      } else {
        setAnimatedTotal(total);
      }
    };
    animate();
  }, [total]);

  async function handlePay() {
    const e = {};
    if (!fullName || fullName.trim().length < 3)
      e.fullName = "Please enter recipient name";
    if (!email || !email.includes("@") || email.length < 5)
      e.email = "Please enter a valid email address";
    if (!phone || phone.trim().length < 6)
      e.phone = "Please enter a valid phone";
    if (!address || address.trim().length < 5)
      e.address = "Please enter address";
    if (!city) e.city = "Please enter city";
    if (!postal) e.postal = "Please enter postal code";
    if (!country) e.country = "Please enter country";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    // Save lastOrder locally so success page can post to backend after payment
    try {
      const localOrder = {
        id: uuidv4(),
        orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        products: cart.map((it) => ({
          id: it.id,
          name: it.name,
          qty: it.quantity || 1,
          price: it.price || 0,
        })),
        total,
        createdAt: new Date().toISOString(),
        delivery: { fullName, email, phone, address, city, postal, country },
      };
      localStorage.setItem("lastOrder", JSON.stringify(localOrder));
    } catch (e) {
      console.warn("Could not save lastOrder", e);
    }

    // Get API base same as Api.js
    const DEV_FALLBACK = "http://localhost:4242";
    const BASE = import.meta.env?.VITE_API_BASE || DEV_FALLBACK;

    try {
      const res = await fetch(`${BASE}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product: item.id || null, // Include product ID
            id: item.id || null, // Fallback
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image,
          })),
          shippingAddress: {
            fullName,
            email,
            phone,
            address,
            city,
            postal,
            country,
          },
        }),
      });
      const data = await res.json().catch(() => null);
      if (data && data.url) {
        // Redirect to Stripe Checkout
        window.location = data.url;
        return;
      } else if (data && data.error) {
        notifyError(`Stripe Error: ${data.error}`);
      }
    } catch (err) {
      console.warn("Stripe unavailable, falling back to local checkout.", err);
      notifyError("Stripe unavailable; proceeding with local checkout.");
    }

    // Fallback/local checkout: create order directly and clear cart
    try {
      // Call backend to persist order (guest)
      const resp = await fetch(`${BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: (cart || []).map((it) => ({
            product:
              it.id &&
              typeof it.id === "string" &&
              it.id.match(/^[0-9a-fA-F]{24}$/)
                ? it.id
                : null, // Only send valid MongoDB ObjectIds
            name: it.name || "Unknown Product",
            price: it.price,
            quantity: it.quantity,
          })),
          shippingAddress: {
            fullName,
            email,
            phone,
            address,
            city,
            postal,
            country,
          },
          paymentInfo: { method: "local" },
        }),
      });

      // Check response from server
      const body = await resp.json().catch(() => null);
      if (!resp.ok) {
        const msg =
          (body && (body.error || body.message)) || "Failed to create order";
        console.error("Backend returned error when creating order:", msg, body);
        notifyError(`Order failed: ${msg}`);
        return;
      }

      // Treat either { success: true, order } or raw order object
      const savedOrder = (body && body.order) || body || null;
      if (!savedOrder) {
        notifyError("Order creation returned empty response from server.");
        return;
      }

      if (typeof clearCart === "function") clearCart();
      notifySuccess(
        "Order placed successfully. Confirmation sent to your email (if configured)."
      );
      // persist lastOrder id for success page lookup
      try {
        localStorage.setItem(
          "lastOrderId",
          savedOrder._id || savedOrder.id || savedOrder.orderId || ""
        );
      } catch (err) {
        console.debug("Could not persist lastOrderId", err);
      }
      nav("/checkout/success");
    } catch (ex) {
      console.error("Fallback checkout failed", ex);
      notifyError("Checkout failed. Please try again.");
    }
  }

  if (!cart || cart.length === 0)
    return (
      <Container>
        <Title>Checkout</Title>
        <p style={{ fontSize: "1rem", color: "#666", textAlign: "center" }}>
          Your cart is empty — add items before checking out.
        </p>
      </Container>
    );

  return (
    <Container>
      <Title>Checkout</Title>

      <Grid>
        <div>
          <Subtitle>Delivery details</Subtitle>
          <DeliveryForm>
            <input
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ gridColumn: "1 / -1" }}
            />
            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              style={{ gridColumn: "1 / -1" }}
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              placeholder="Postal code"
              value={postal}
              onChange={(e) => setPostal(e.target.value)}
            />
            <input
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </DeliveryForm>
          <Errors>
            {Object.values(errors).map((x, i) => (
              <div key={i}>{x}</div>
            ))}
          </Errors>
        </div>

        <OrderSummaryCard>
          <h4>Order summary</h4>
          {cart.map((it, i) => (
            <CartItem key={i}>
              <span>
                {it.name} x {it.quantity}
              </span>
              <span>PKR {(it.price * it.quantity).toFixed(2)}</span>
            </CartItem>
          ))}
          <div
            style={{
              fontWeight: 700,
              marginTop: 12,
              textAlign: "right",
              fontSize: "1.1rem",
            }}
          >
            Total: PKR {animatedTotal.toFixed(2)}
          </div>
        </OrderSummaryCard>
      </Grid>

      <Button3D onClick={handlePay}>Pay with Stripe</Button3D>

      {/* Floating cart for mobile */}
      <FloatingCart
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Total: PKR {animatedTotal.toFixed(2)} - Tap to pay
      </FloatingCart>
    </Container>
  );
}
