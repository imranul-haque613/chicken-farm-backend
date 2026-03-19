const mongoose = require("mongoose");

const PriceSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  prices: { type: Object, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Price", PriceSchema);
