// Try local backend first (when on localhost), but automatically fall back
// to the deployed backend if local server is not running.
const API_LOCAL = "http://localhost:5000/api";
const API_DEPLOY = "https://chicken-farm-backend-h8sc.onrender.com/api";

function apiBaseCandidates() {
  const preferLocal =
    location.hostname === "localhost";
  return preferLocal ? [API_LOCAL, API_DEPLOY] : [API_DEPLOY, API_LOCAL];
}

async function apiFetch(path, options) {
  const bases = apiBaseCandidates();
  let lastErr;

  for (const base of bases) {
    try {
      const res = await fetch(`${base}${path}`, options);
      // If local returns "not found" for an endpoint, try the next base.
      if (!res.ok && base === bases[0] && (res.status === 404 || res.status === 500)) {
        continue;
      }
      return await res.json();
    } catch (err) {
      lastErr = err;
      // Connection refused / network error => try next base
    }
  }

  throw lastErr || new Error("API fetch failed");
}

const getToken = () => localStorage.getItem("token");
const getUser = () => JSON.parse(localStorage.getItem("loggedInUser") || "null");
const isLoggedIn = () => !!getToken();

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// AUTH
async function apiSignup(firstName, lastName, email, password, phone = "") {
  const res = await apiFetch(`/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password, phone }),
  });
  return res;
}

async function apiLogin(email, password) {
  const res = await apiFetch(`/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = res;
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("loggedInUser", JSON.stringify(data.user));
  }
  return data;
}

function apiLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

async function apiGetProfile() {
  return apiFetch(`/auth/profile`, { headers: authHeaders() });
}

async function apiUpdateProfile(data) {
  const res = await apiFetch(`/auth/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res;
}

async function apiForgotPassword(email, newPassword) {
  const res = await apiFetch(`/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });
  return res;
}

// CART
async function apiGetCart() {
  return apiFetch(`/cart`, { headers: authHeaders() });
}

async function apiAddToCart(item) {
  const res = await apiFetch(`/cart`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(item),
  });
  return res;
}

async function apiUpdateCartItem(index, qty) {
  const res = await apiFetch(`/cart/${index}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ qty }),
  });
  return res;
}

async function apiRemoveCartItem(index) {
  const res = await apiFetch(`/cart/${index}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res;
}

// ORDERS
async function apiPlaceOrder(orderData) {
  const res = await apiFetch(`/orders`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(orderData),
  });
  return res;
}

async function apiGetMyOrders() {
  return apiFetch(`/orders/my`, { headers: authHeaders() });
}

async function apiCancelOrder(orderId, reason = "") {
  const res = await apiFetch(`/orders/${orderId}/cancel`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ reason }),
  });
  return res;
}

// SEARCH
async function apiSearch(query) {
  return apiFetch(
    `/products/search?q=${encodeURIComponent(query)}`
  );
}

// ADMIN
async function apiAdminDashboard() {
  return apiFetch(`/admin/dashboard`, { headers: authHeaders() });
}

async function apiAdminGetOrders(status = "", page = 1) {
  return apiFetch(`/admin/orders?status=${encodeURIComponent(status)}&page=${page}`, {
    headers: authHeaders(),
  });
}

async function apiAdminUpdateOrderStatus(orderId, status) {
  const res = await apiFetch(`/admin/orders/${orderId}/status`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  return res;
}

async function apiAdminGetUsers() {
  return apiFetch(`/admin/users`, { headers: authHeaders() });
}

// REQUIRE LOGIN - redirect with return URL
function requireLogin() {
  if (!isLoggedIn()) {
    const currentPage = location.pathname.split("/").pop();
    window.location.href = `login.html?redirect=${currentPage}`;
    return false;
  }
  return true;
}

// PRICES
async function apiGetPrices() {
  try {
    return await apiFetch(`/admin/prices`);
  } catch (e) {
    return null;
  }
}

async function apiAdminSavePrices(category, prices) {
  const res = await apiFetch(`/admin/prices`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ category, prices }),
  });
  return res;
}

async function apiChangePassword(newPassword) {
  const res = await apiFetch(`/auth/change-password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ newPassword }),
  });
  return res;
}

async function apiAdminResetStats() {
  const res = await apiFetch(`/admin/reset-stats`, {
    method: "POST",
    headers: authHeaders(),
  });
  return res;
}
