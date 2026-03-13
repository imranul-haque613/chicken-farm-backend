const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const MONGO_URI = "mongodb://imranul890_db_user:im100imranHASH@ac-xwfvvyj-shard-00-00.c5cqssa.mongodb.net:27017,ac-xwfvvyj-shard-00-01.c5cqssa.mongodb.net:27017,ac-xwfvvyj-shard-00-02.c5cqssa.mongodb.net:27017/chickenfarm?ssl=true&replicaSet=atlas-wtf8n2-shard-0&authSource=admin&appName=Project0";
const PORT = 5000;
const JWT_SECRET = "ChickenFarm_Imranul_2026_Secret";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("../frontend"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/products", require("./routes/products"));

// MongoDB connect
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    family: 4,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

module.exports = { JWT_SECRET };