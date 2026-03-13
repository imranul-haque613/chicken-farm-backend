// ============================================================
// api.js - Frontend API Helper
// সব HTML pages এ এই file টা include করুন:
// <script src="api.js"></script>
// ============================================================

const API = "http://localhost:5000/api";

// ---- Token helpers ----
const getToken = () => localStorage.getItem("token");
const getUser = () => JSON.parse(localStorage.getItem("loggedInUser") || "null");
const isLoggedIn = () => !!getToken();

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ============================================================
// AUTH
// ============================================================

async function apiSignup(firstName, lastName, email, password) {
  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
  return res.json();
}

async function apiLogin(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("loggedInUser", JSON.stringify(data.user));
  }
  return data;
}

function apiLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("cart");
  window.location.href = "login.html";
}

async function apiGetProfile() {
  const res = await fetch(`${API}/auth/profile`, { headers: authHeaders() });
  return res.json();
}

async function apiUpdateProfile(data) {
  const res = await fetch(`${API}/auth/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

async function apiForgotPassword(email, newPassword) {
  const res = await fetch(`${API}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });
  return res.json();
}

// ============================================================
// CART
// ============================================================

async function apiGetCart() {
  const res = await fetch(`${API}/cart`, { headers: authHeaders() });
  return res.json();
}

async function apiAddToCart(item) {
  const res = await fetch(`${API}/cart`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(item),
  });
  return res.json();
}

async function apiUpdateCartItem(index, qty) {
  const res = await fetch(`${API}/cart/${index}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ qty }),
  });
  return res.json();
}

async function apiRemoveCartItem(index) {
  const res = await fetch(`${API}/cart/${index}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

// ============================================================
// ORDERS
// ============================================================

async function apiPlaceOrder(orderData) {
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(orderData),
  });
  return res.json();
}

async function apiGetMyOrders() {
  const res = await fetch(`${API}/orders/my`, { headers: authHeaders() });
  return res.json();
}

async function apiCancelOrder(orderId, reason = "") {
  const res = await fetch(`${API}/orders/${orderId}/cancel`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ reason }),
  });
  return res.json();
}

// ============================================================
// SEARCH
// ============================================================

async function apiSearch(query) {
  const res = await fetch(`${API}/products/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

// ============================================================
// ADMIN
// ============================================================

async function apiAdminDashboard() {
  const res = await fetch(`${API}/admin/dashboard`, { headers: authHeaders() });
  return res.json();
}

async function apiAdminGetOrders(status = "", page = 1) {
  const res = await fetch(`${API}/admin/orders?status=${status}&page=${page}`, {
    headers: authHeaders(),
  });
  return res.json();
}

async function apiAdminUpdateOrderStatus(orderId, status) {
  const res = await fetch(`${API}/admin/orders/${orderId}/status`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
}

async function apiAdminGetUsers() {
  const res = await fetch(`${API}/admin/users`, { headers: authHeaders() });
  return res.json();
}

// ============================================================
// UTILITY - redirect to login if not logged in
// ============================================================
function requireLogin() {
  if (!isLoggedIn()) {
    alert("Please login first!");
    window.location.href = "login.html";
    return false;
  }
  return true;
}
