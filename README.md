# 🐔 Chicken Farm - Full Stack Setup Guide

## ফোল্ডার Structure
```
chicken-farm/
├── backend/          ← এই folder (server code)
│   ├── server.js
│   ├── .env
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── api.js        ← frontend এ copy করুন
└── frontend/         ← আপনার existing HTML/CSS/JS files
```

---

## Step 1: MongoDB Atlas Setup

1. https://cloud.mongodb.com এ login করুন
2. **New Project** → **Create Cluster** (Free tier)
3. **Connect** → **Connect your application**
4. Connection string copy করুন:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/chickenfarm
   ```
5. `.env` file এ `MONGO_URI=` এর পরে paste করুন

---

## Step 2: Backend Install & Run

```bash
# backend folder এ যান
cd chicken-farm-backend

# dependencies install
npm install

# server start
npm run dev
```

Server চালু হলে দেখবেন:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

---

## Step 3: Frontend Connect করুন

1. `api.js` file টা আপনার **frontend folder** এ copy করুন
2. প্রতিটা HTML file এর `<head>` এ add করুন:
   ```html
   <script src="api.js"></script>
   ```

---

## Step 4: Frontend files আপডেট করুন

### login.js - এভাবে বদলান:
```javascript
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const data = await apiLogin(email, password);
  if (data.token) {
    alert("✅ Login Successful!");
    window.location.href = "main.html";
  } else {
    alert("❌ " + data.message);
  }
});
```

### signup.js - এভাবে বদলান:
```javascript
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = await apiSignup(
    document.getElementById("firstName").value.trim(),
    document.getElementById("lastName").value.trim(),
    document.getElementById("signupEmail").value.trim(),
    document.getElementById("signupPassword").value.trim()
  );
  if (data.token) {
    alert("✅ Signup successful!");
    window.location.href = "main.html";
  } else {
    alert("❌ " + data.message);
  }
});
```

### baby.js / hen.js / egg.js / meat.js - Add to Cart:
```javascript
orderBtn.addEventListener("click", async () => {
  if (!requireLogin()) return;
  // ... validation ...
  const result = await apiAddToCart({
    item: "Baby Chicks",
    type: typeSelect.options[typeSelect.selectedIndex].text,
    qty: qty,
    unitPrice: unitPrice,
    totalPrice: unitPrice * qty,
  });
  if (result.cart) window.location.href = "cart.html";
  else alert("❌ " + result.message);
});
```

### cart.js - Confirm Order:
```javascript
async function confirmOrder() {
  if (!requireLogin()) return;
  const delivery = Number(document.getElementById("deliverySelect").value);
  const address = document.querySelector('input[placeholder="Enter full delivery address"]').value;
  const payMethod = document.querySelector('input[name="pay"]:checked')?.nextSibling?.textContent?.trim() || "bKash";

  const cart = await apiGetCart();
  const subtotal = cart.items.reduce((s, i) => s + i.totalPrice, 0);

  const result = await apiPlaceOrder({
    deliveryAddress: address,
    deliveryCharge: delivery,
    paymentMethod: payMethod,
    grandTotal: subtotal + delivery,
  });

  if (result.order) {
    alert("✅ Order Confirmed!");
    window.location.href = "order-success.html";
  } else {
    alert("❌ " + result.message);
  }
}
```

### history.js - Load from API:
```javascript
async function renderHistory() {
  if (!requireLogin()) return;
  const orders = await apiGetMyOrders();
  // ... render orders ...
}
```

---

## Step 5: Admin Setup

Admin user তৈরি করতে MongoDB Atlas এ গিয়ে:
1. **Browse Collections** → `users` collection
2. আপনার user find করুন
3. `role` field টা `"admin"` করুন

---

## API Endpoints Summary

| Method | URL | কাজ |
|--------|-----|-----|
| POST | /api/auth/signup | নতুন user |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Profile দেখা |
| PUT | /api/auth/profile | Profile update |
| GET | /api/cart | Cart দেখা |
| POST | /api/cart | Item add |
| PUT | /api/cart/:i | Qty update |
| DELETE | /api/cart/:i | Item remove |
| POST | /api/orders | Order place |
| GET | /api/orders/my | আমার orders |
| PUT | /api/orders/:id/cancel | Order cancel |
| GET | /api/products/search?q= | Search |
| GET | /api/admin/dashboard | Admin stats |
| GET | /api/admin/orders | সব orders |
| PUT | /api/admin/orders/:id/status | Status update |

---

## কোনো সমস্যা হলে জানান! 🚀
