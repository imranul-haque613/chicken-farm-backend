const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/auth");

router.post("/", protect, async (req, res) => {
  try {
    const { deliveryAddress, deliveryLocation, deliveryCharge, paymentMethod, grandTotal, transactionId, phone } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const order = await Order.create({
      user: req.user.id, items: cart.items,
      deliveryAddress, deliveryLocation, deliveryCharge,
      paymentMethod, grandTotal, transactionId: transactionId || "",
      phone: phone || "", status: "Confirmed",
    });

    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
    res.status(201).json({ message: "✅ Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "firstName lastName email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user._id.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    if (order.status === "Delivered")
      return res.status(400).json({ message: "Delivered orders cannot be cancelled" });
    if (order.status === "Cancelled")
      return res.status(400).json({ message: "Order already cancelled" });

    order.status = "Cancelled";
    order.cancelReason = req.body.reason || "Cancelled by user";
    await order.save();
    res.json({ message: "✅ Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
