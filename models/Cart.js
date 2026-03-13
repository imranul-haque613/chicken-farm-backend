const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  item: String,
  type: String,
  qty: Number,
  unitPrice: Number,
  totalPrice: Number,
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
