// API wrapper - forwards calls to the backend API endpoints.
// Keeps the same exported function names so existing UI code keeps working.

// Backend deployed on Railway - change to http://localhost:4242 for local development
// In production the frontend and backend may be served from the same origin, so use a relative path.
const DEV_FALLBACK = "https://nerozyserver-production-4128.up.railway.app";
const BASE =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_BASE || DEV_FALLBACK
    : "";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleRes(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    let body = null;
    try {
      body = JSON.parse(txt || "null");
    } catch (e) {
      // Ignore JSON parse errors when response has no JSON body
      console.debug("handleRes: failed to parse JSON body", e);
    }
    const err =
      (body && body.error) || res.statusText || txt || "Request failed";
    throw new Error(err);
  }
  return res.json().catch(() => null);
}

export async function getAllProducts() {
  const res = await fetch(`${BASE}/api/products`);
  const data = await handleRes(res);
  if (!data) return [];
  return (Array.isArray(data) ? data : [data]).map((p) => ({
    ...p,
    id: p._id || p.id,
    name: p.name || p.title,
    price: p.price || 0,
    images: p.images || [],
    colors: p.colors || [],
    qty: p.qty || p.stock || 0,
    sizes: p.sizes || [],
    category: p.category || (p.metadata && p.metadata.category) || "",
  }));
}

export async function getFeatured() {
  const prods = await getAllProducts();
  return (prods || []).slice(0, 3);
}

export async function getProductById(id) {
  const res = await fetch(`${BASE}/api/products/${id}`);
  const p = await handleRes(res);
  if (!p) return null;
  return {
    ...p,
    id: p._id || p.id,
    name: p.name || p.title,
    price: p.price || 0,
    images: p.images || [],
    colors: p.colors || [],
    qty: p.qty || p.stock || 0,
    sizes: p.sizes || [],
    category: p.category || (p.metadata && p.metadata.category) || "",
  };
}

export async function createProduct(payload) {
  const res = await fetch(`${BASE}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const p = await handleRes(res);
  if (!p) return null;
  return {
    ...p,
    id: p._id || p.id,
    name: p.name || p.title,
    price: p.price || 0,
    images: p.images || [],
    colors: p.colors || [],
    qty: p.qty || p.stock || 0,
    sizes: p.sizes || [],
    category: p.category || (p.metadata && p.metadata.category) || "",
  };
}

export async function updateProduct(id, payload) {
  const res = await fetch(`${BASE}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const p = await handleRes(res);
  if (!p) return null;
  return {
    ...p,
    id: p._id || p.id,
    name: p.name || p.title,
    price: p.price || 0,
    images: p.images || [],
    colors: p.colors || [],
    qty: p.qty || p.stock || 0,
    sizes: p.sizes || [],
    category: p.category || (p.metadata && p.metadata.category) || "",
  };
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE}/api/products/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  return handleRes(res);
}

export async function fakeLogin(email, password) {
  // Call backend login; backend may send OTP or return a token for password login.
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json().catch(() => null);
  // If token returned, store it for later calls
  if (body && body.token) {
    localStorage.setItem("token", body.token);
  }
  return body;
}

export async function signup(payload) {
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function verifyOtp(email, code) {
  const res = await fetch(`${BASE}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const body = await handleRes(res);
  if (body && body.token) localStorage.setItem("token", body.token);
  return body;
}

export async function getAllOrders() {
  try {
    const res = await fetch(`${BASE}/api/orders`, {
      headers: { ...authHeaders() },
    });
    const data = await handleRes(res);
    if (!data) return [];
    return (Array.isArray(data) ? data : [data]).map((o) => ({
      ...o,
      id: o._id || o.id,
      orderNumber: o.orderNumber || o.orderNumber,
      products: (o.items || []).map((it) => ({
        id: it.product?._id || it.product || it.id,
        name:
          it.product?.name ||
          it.name ||
          (it.product && it.product.title) ||
          "Product",
        qty: it.quantity || it.qty || it.q || 1,
        price: it.price || it.unitPrice || 0,
      })),
      total: o.total || 0,
      status: o.status || "",
      shippingAddress: o.shippingAddress || null,
      paymentInfo: o.paymentInfo || null,
      emailSent: o.emailSent || false,
      createdAt: o.createdAt || o.createdAt,
    }));
  } catch (err) {
    // Return empty array on failure to avoid breaking UI
    console.debug("getAllOrders failed", err);
    return [];
  }
}

export async function getOrderById(id) {
  try {
    const res = await fetch(`${BASE}/api/orders/${id}`, {
      headers: { ...authHeaders() },
    });
    const o = await handleRes(res);
    if (!o) return null;
    return {
      ...o,
      id: o._id || o.id,
      products: (o.items || []).map((it) => ({
        id: it.product?._id || it.product || it.id,
        name: it.product?.name || it.name || "",
        qty: it.quantity || it.qty || 1,
        price: it.price || it.unitPrice || 0,
      })),
      total: o.total || 0,
      status: o.status || "",
      shippingAddress: o.shippingAddress || null,
      paymentInfo: o.paymentInfo || null,
      createdAt: o.createdAt || o.createdAt,
    };
  } catch (err) {
    console.debug("getOrderById failed", err);
    return null;
  }
}

export async function createOrder(payload) {
  const res = await fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const o = await handleRes(res);
  if (!o) return null;
  return {
    ...o,
    id: o._id || o.id,
    products: (o.items || []).map((it) => ({
      id: it.product?._id || it.product || it.id,
      name: it.product?.name || it.name || "",
      qty: it.quantity || it.qty || 1,
      price: it.price || it.unitPrice || 0,
    })),
  };
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${BASE}/api/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  const o = await handleRes(res);
  if (!o) return null;
  // Transform the response to match the same format as getAllOrders
  return {
    ...o,
    id: o._id || o.id,
    orderNumber: o.orderNumber || o.orderNumber,
    products: (o.items || []).map((it) => ({
      id: it.product?._id || it.product || it.id,
      name:
        it.product?.name || it.name || (it.product && it.product.title) || "",
      qty: it.quantity || it.qty || it.q || 1,
      price: it.price || it.unitPrice || 0,
    })),
    total: o.total || 0,
    status: o.status || "",
    shippingAddress: o.shippingAddress || null,
    paymentInfo: o.paymentInfo || null,
    createdAt: o.createdAt || o.createdAt,
  };
}

export async function getAnalytics(period = "30days") {
  try {
    const res = await fetch(
      `${BASE}/api/orders/analytics/stats?period=${period}`,
      {
        headers: { ...authHeaders() },
      }
    );
    const data = await handleRes(res);
    return data || null;
  } catch (err) {
    console.error("getAnalytics failed", err);
    return null;
  }
}
