const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  item: String, type: String, qty: Number, unitPrice: Number, totalPrice: Number,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  deliveryCharge: { type: Number, default: 50 },
  deliveryAddress: { type: String, required: true },
  deliveryLocation: { type: String, default: "Inside Salanga" },
  phone: { type: String, default: "" },
  paymentMethod: { type: String, default: "bKash" },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  status: { type: String, enum: ["Pending", "Confirmed", "Billing", "Shipped", "Delivered", "Cancelled"], default: "Confirmed" },
  grandTotal: { type: Number, required: true },
  transactionId: { type: String, default: "" },
  cancelReason: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
