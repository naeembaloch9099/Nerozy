import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../Context/Cart";
import { createOrder } from "../Services/Api";
import {
  success as notifySuccess,
  error as notifyError,
} from "../Utils/notify";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

const Container = styled.div`
  max-width: 900px;
  margin: 32px auto;
  padding: 0 16px;
`;

const Invoice = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  color: #111;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.18);
  }

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;

  div {
    margin-bottom: 4px;
  }
`;

const Button3D = styled.button`
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(145deg, #667eea, #764ba2);
  box-shadow: 0 6px 0 #5a67d8, 0 6px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 0 #5a67d8, 0 8px 12px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #5a67d8, 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [order, setOrder] = useState(null);
  const invoiceRef = useRef();
  const { clearCart } = useCart();
  const processedRef = useRef(false);

  useEffect(() => {
    async function loadAndPersist() {
      // Prevent multiple executions
      if (processedRef.current) return;
      processedRef.current = true;

      try {
        // If we have a session_id, this is a Stripe payment - no need to create order manually
        if (sessionId) {
          // For Stripe payments, the order is created via webhook
          // Just display success message and clear cart
          try {
            if (typeof clearCart === "function") clearCart();
            notifySuccess(
              "🎉 Payment successful! Your order has been confirmed."
            );
          } catch (error) {
            console.debug("Failed to clear cart", error);
          }

          // Try to get session details for display
          try {
            const DEV_FALLBACK =
              "https://nerozyserver-production-4128.up.railway.app";
            const BASE = import.meta.env?.VITE_API_BASE || DEV_FALLBACK;
            const res = await fetch(
              `${BASE}/api/payments/session/${sessionId}`
            );
            if (res.ok) {
              const session = await res.json();
              const displayOrder = {
                orderNumber: `STRIPE-${sessionId.slice(-8)}`,
                createdAt: new Date().toISOString(),
                total: session.amount_total / 100,
                status: "confirmed",
                paymentMethod: "stripe",
                persisted: true,
              };
              setOrder(displayOrder);
              localStorage.setItem("lastOrder", JSON.stringify(displayOrder));
            }
          } catch (e) {
            console.debug("Could not fetch session details", e);
          }

          // Poll the server for the persisted order created by the Stripe webhook.
          (async function pollForOrder() {
            try {
              const DEV_FALLBACK =
                "https://nerozyserver-production-4128.up.railway.app";
              const BASE = import.meta.env?.VITE_API_BASE || DEV_FALLBACK;
              const maxAttempts = 3; // Reduced to 3 attempts (~3 seconds) since webhook likely not configured
              let attempts = 0;
              while (attempts < maxAttempts) {
                attempts += 1;
                try {
                  const r = await fetch(
                    `${BASE}/api/payments/order/${sessionId}`
                  );
                  if (r.ok) {
                    const saved = await r.json();
                    // Normalize the order for display
                    const display = {
                      orderNumber:
                        saved.orderNumber || `STRIPE-${sessionId.slice(-8)}`,
                      createdAt: saved.createdAt || new Date().toISOString(),
                      products: (saved.items || []).map((it) => ({
                        name: it.product?.name || it.name || "",
                        qty: it.quantity || it.qty || 1,
                        price: it.price || it.unitPrice || 0,
                      })),
                      total:
                        saved.total ||
                        (saved.amount_total && saved.amount_total / 100) ||
                        0,
                      delivery: saved.shippingAddress || {},
                      persisted: true,
                      emailSent: !!saved.emailSent,
                    };
                    setOrder(display);
                    localStorage.setItem("lastOrder", JSON.stringify(display));
                    if (display.emailSent) {
                      notifySuccess(
                        "✅ Order confirmed! Confirmation email sent."
                      );
                    } else {
                      notifySuccess(
                        "✅ Order confirmed! Confirmation email will be sent shortly."
                      );
                    }
                    return;
                  }
                } catch (err) {
                  console.debug("Poll attempt failed", err);
                }
                // wait 1 second before next attempt (reduced from 2 seconds)
                await new Promise((res) => setTimeout(res, 1000));
              }
              // If we reach here, order was not found in time
              console.log(
                "Webhook not responding, creating order via fallback mechanism"
              );

              // FALLBACK: Create order manually using Stripe session data if webhook didn't work
              try {
                const DEV_FALLBACK =
                  "https://nerozyserver-production-4128.up.railway.app";
                const BASE = import.meta.env?.VITE_API_BASE || DEV_FALLBACK;

                // First, get the Stripe session details
                const sessionRes = await fetch(
                  `${BASE}/api/payments/session/${sessionId}`
                );

                if (!sessionRes.ok) {
                  throw new Error("Could not retrieve Stripe session");
                }

                const session = await sessionRes.json();
                console.log("Retrieved Stripe session for fallback:", session);

                // Extract shipping address from session metadata or shipping details
                let shippingAddress = {};
                try {
                  shippingAddress = JSON.parse(
                    session.metadata?.shippingAddress || "{}"
                  );
                } catch {
                  console.warn(
                    "Could not parse shipping address from metadata"
                  );
                }

                const payload = {
                  items: (session.line_items?.data || []).map((item) => ({
                    product: null,
                    name:
                      item.description ||
                      item.price?.product?.name ||
                      "Product",
                    price: (item.price?.unit_amount || 0) / 100,
                    quantity: item.quantity || 1,
                  })),
                  shippingAddress: {
                    // Use address from metadata that was collected on our checkout page
                    fullName:
                      shippingAddress.fullName ||
                      session.customer_details?.name ||
                      "Customer",
                    email:
                      session.customer_details?.email ||
                      session.customer_email ||
                      shippingAddress.email ||
                      "noemail@provided.com",
                    phone:
                      shippingAddress.phone ||
                      session.customer_details?.phone ||
                      "N/A",
                    address: shippingAddress.address || "Address not provided",
                    city: shippingAddress.city || "City",
                    postal: shippingAddress.postal || "00000",
                    country: shippingAddress.country || "PK",
                  },
                  paymentInfo: {
                    method: "stripe",
                    sessionId: sessionId,
                    paymentStatus: session.payment_status,
                    paymentIntentId: session.payment_intent,
                    note: "Created by fallback mechanism - webhook may not be configured",
                  },
                };

                console.log(
                  "Creating fallback order with Stripe session data:",
                  payload
                );

                const saved = await createOrder(payload);
                if (saved && saved.order) {
                  const display = {
                    orderNumber:
                      saved.order.orderNumber ||
                      `STRIPE-${sessionId.slice(-8)}`,
                    createdAt:
                      saved.order.createdAt || new Date().toISOString(),
                    products: (saved.order.items || []).map((it) => ({
                      name: it.name || "Product",
                      qty: it.quantity || 1,
                      price: it.price || 0,
                    })),
                    total: saved.order.total || session.amount_total / 100 || 0,
                    delivery:
                      saved.order.shippingAddress ||
                      payload.shippingAddress ||
                      {},
                    persisted: true,
                    emailSent: !!saved.order.emailSent,
                  };
                  setOrder(display);
                  localStorage.setItem("lastOrder", JSON.stringify(display));
                  notifySuccess(
                    "🎉 Payment successful! Your order has been confirmed and confirmation email sent."
                  );
                  return;
                }
              } catch (fallbackErr) {
                console.error("Fallback order creation failed", fallbackErr);
              }

              notifyError(
                "⚠️ Payment successful but order could not be created. Please contact support with your payment confirmation."
              );
            } catch (pollErr) {
              console.debug("Order polling failed", pollErr);
            }
          })();
          return;
        }

        // Handle local/fallback orders
        const raw = localStorage.getItem("lastOrder");
        if (!raw) return;
        const local = JSON.parse(raw);

        // Check if this order was already persisted to avoid duplicates
        if (local.persisted) {
          setOrder(local);
          return;
        } // Try to persist to backend (server will create orderNumber)
        try {
          const payload = {
            items: (local.products || []).map((p) => ({
              product: p.id,
              price: p.price,
              quantity: p.qty,
            })),
            shippingAddress: {
              fullName:
                local.delivery?.fullName || local.delivery?.recipient || "",
              phone: local.delivery?.phone || "",
              address: local.delivery?.address || "",
              city: local.delivery?.city || "",
              postal:
                local.delivery?.postal || local.delivery?.postalCode || "",
              country: local.delivery?.country || "",
            },
            paymentInfo: { method: sessionId ? "stripe" : "local", sessionId },
          };
          const saved = await createOrder(payload).catch((e) => {
            console.debug("createOrder failed", e);
            return null;
          });
          if (saved) {
            // Normalize display object to include delivery and products
            const display = {
              orderNumber: saved.orderNumber || local.orderNumber,
              createdAt: saved.createdAt || local.createdAt,
              products: (saved.items || []).map((it) => ({
                name: it.product?.name || it.name || "",
                qty: it.quantity || it.qty || 1,
                price: it.price || it.unitPrice || 0,
              })),
              total: saved.total || local.total,
              delivery: saved.shippingAddress || local.delivery,
              persisted: true, // Mark as persisted to prevent duplicates
            };
            setOrder(display);
            try {
              if (typeof clearCart === "function") clearCart();
            } catch (error) {
              console.debug("Failed to clear cart", error);
            }
            localStorage.setItem("lastOrder", JSON.stringify(display));
            notifySuccess("Order recorded");
            return;
          }
        } catch (e) {
          console.debug("Order persist error", e);
        }

        // Fallback: set local stored order for display
        setOrder(local);
      } catch (e) {
        console.warn(e);
        notifyError("Failed to load order details");
      }
    }
    loadAndPersist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePrint() {
    window.print();
  }

  async function handleDownloadPdf() {
    try {
      // Dynamic import to avoid module loading issues
      const { default: jsPDF } = await import("jspdf");

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const left = 40;
      let y = 40;
      doc.setFontSize(18);
      doc.text("Invoice", left, y);
      doc.setFontSize(12);
      y += 30;
      if (order) {
        doc.text(`Order: ${order.orderNumber}`, left, y);
        y += 18;
        doc.text(
          `Date: ${new Date(order.createdAt).toLocaleString()}`,
          left,
          y
        );
        y += 24;
        if (order.delivery) {
          doc.text("Delivery:", left, y);
          y += 18;
          doc.text(`${order.delivery.recipient}`, left, y);
          y += 16;
          doc.text(`${order.delivery.address}`, left, y);
          y += 16;
          doc.text(`${order.delivery.city} ${order.delivery.postal}`, left, y);
          y += 16;
          doc.text(
            `${order.delivery.country} — ${order.delivery.phone}`,
            left,
            y
          );
          y += 20;
        }
        doc.text("Items:", left, y);
        y += 18;
        (order.products || []).forEach((p) => {
          doc.text(
            `${p.name} x ${p.quantity || p.qty || 0} — PKR ${(
              (p.price || 0) * (p.quantity || p.qty || 0)
            ).toFixed(2)}`,
            left,
            y
          );
          y += 16;
        });
        y += 8;
        doc.setFontSize(14);
        doc.text(`Total: PKR ${(order.total || 0).toFixed(2)}`, left, y);
      } else {
        doc.text("No order data available.", left, y);
      }

      doc.save(`${order?.orderNumber || "invoice"}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      notifyError("PDF download failed. Please try printing instead.");
    }
  }

  return (
    <Container>
      <h2 style={{ fontSize: "1.8rem", marginBottom: 12 }}>
        Payment Successful
      </h2>
      <p style={{ color: "#555", marginBottom: 16 }}>
        Thank you for your purchase! Below is your invoice.
      </p>

      {sessionId && (
        <p style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>
          Session: {sessionId}
        </p>
      )}

      <Invoice ref={invoiceRef}>
        {order ? (
          <>
            <Row>
              <div>
                <strong>Order:</strong> {order.orderNumber}
              </div>
              <div>{new Date(order.createdAt).toLocaleString()}</div>
            </Row>

            <div style={{ marginTop: 12 }}>
              {(order.products || []).map((p, i) => (
                <Row key={i}>
                  <div>
                    {p.name} <small style={{ color: "#666" }}>x {p.qty}</small>
                  </div>
                  <div>PKR {((p.price || 0) * (p.qty || 1)).toFixed(2)}</div>
                </Row>
              ))}
            </div>

            <hr style={{ margin: "16px 0", borderColor: "#eee" }} />
            <Row>
              <div style={{ fontWeight: 700 }}>Total</div>
              <div style={{ fontWeight: 700 }}>
                PKR {(order.total || 0).toFixed(2)}
              </div>
            </Row>
          </>
        ) : (
          <p>No order information available.</p>
        )}
      </Invoice>

      {order && (order.shippingAddress || order.delivery) && (
        <div
          style={{
            marginTop: 12,
            background: "#fff",
            padding: 12,
            borderRadius: 8,
          }}
        >
          <h4 style={{ marginTop: 0 }}>Delivery Information</h4>
          {(() => {
            const s = order.shippingAddress || order.delivery || {};
            return (
              <>
                <div>{s.fullName || s.recipient}</div>
                <div>{s.address}</div>
                <div>
                  {s.city} {s.postal || s.postalCode}
                </div>
                <div>{s.country}</div>
                <div>Phone: {s.phone}</div>
              </>
            );
          })()}
        </div>
      )}

      <ButtonGroup>
        <Button3D onClick={handlePrint}>Print</Button3D>
        <Button3D onClick={handleDownloadPdf}>Download PDF</Button3D>
      </ButtonGroup>
    </Container>
  );
}
