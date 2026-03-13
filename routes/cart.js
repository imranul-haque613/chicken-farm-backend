const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { protect } = require("../middleware/auth");

// GET /api/cart  - get my cart
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cart  - add item to cart
router.post("/", protect, async (req, res) => {
  try {
    const { item, type, qty, unitPrice, totalPrice } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ item, type, qty, unitPrice, totalPrice }],
      });
    } else {
      // Check if same item+type exists
      const existingIndex = cart.items.findIndex(
        (i) => i.item === item && i.type === type
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].qty += qty;
        cart.items[existingIndex].totalPrice =
          cart.items[existingIndex].unitPrice * cart.items[existingIndex].qty;
      } else {
        cart.items.push({ item, type, qty, unitPrice, totalPrice });
      }
      await cart.save();
    }

    res.json({ message: "✅ Added to cart", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/cart/:index  - update item quantity
router.put("/:index", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const i = parseInt(req.params.index);
    const { qty } = req.body;

    if (qty < 1) {
      cart.items.splice(i, 1);
    } else {
      cart.items[i].qty = qty;
      cart.items[i].totalPrice = cart.items[i].unitPrice * qty;
    }

    await cart.save();
    res.json({ message: "✅ Cart updated", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart/:index  - remove item
router.delete("/:index", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items.splice(parseInt(req.params.index), 1);
    await cart.save();
    res.json({ message: "✅ Item removed", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart  - clear cart
router.delete("/", protect, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
    res.json({ message: "✅ Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
