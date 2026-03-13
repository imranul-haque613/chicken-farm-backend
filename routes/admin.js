const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");

// GET /api/admin/dashboard
router.get("/dashboard", protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: "Pending" });
    const confirmed = await Order.countDocuments({ status: "Confirmed" });
    const billing = await Order.countDocuments({ status: "Billing" });
    const shipped = await Order.countDocuments({ status: "Shipped" });
    const delivered = await Order.countDocuments({ status: "Delivered" });
    const cancelled = await Order.countDocuments({ status: "Cancelled" });
    const totalUsers = await User.countDocuments();
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]);
    const revenue = revenueResult[0]?.total || 0;
    res.json({ stats: { totalOrders, pending, confirmed, billing, shipped, delivered, cancelled, totalUsers, revenue } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/orders
router.get("/orders", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate("user", "firstName lastName email phone avatar")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/orders/:id/status
router.put("/orders/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Confirmed", "Billing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    // Cannot change status of a cancelled order
    const existing = await Order.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Order not found" });
    if (existing.status === "Cancelled")
      return res.status(400).json({ message: "Cannot change status of a cancelled order" });

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate("user", "firstName lastName email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "✅ Status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
