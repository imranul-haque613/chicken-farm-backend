const express = require("express");
const router = express.Router();

// Product data (static - can move to DB later)
const products = [
  {
    id: 1,
    name: "Hen",
    slug: "hen",
    page: "hen.html",
    image: "hen.jpg",
    description: "Fresh farm hen - Boiler, Sonali, Deshi, Pakistani",
    types: [
      { name: "Boiler", pricePerKg: 180 },
      { name: "Sonali", pricePerKg: 260 },
      { name: "Deshi", pricePerKg: 450 },
      { name: "Pakistani", pricePerKg: 380 },
    ],
  },
  {
    id: 2,
    name: "Egg",
    slug: "egg",
    page: "egg.html",
    image: "egg.jpg",
    description: "Fresh farm eggs - Regular, Brown, Deshi",
    types: [
      { name: "Regular", pricePerPcs: 10 },
      { name: "Brown", pricePerPcs: 12 },
      { name: "Deshi", pricePerPcs: 15 },
    ],
  },
  {
    id: 3,
    name: "Meat",
    slug: "meat",
    page: "meat.html",
    image: "meat.jpg",
    description: "Fresh chicken meat - Boiler, Sonali, Deshi, Pakistani",
    types: [
      { name: "Boiler Meat", pricePerKg: 280 },
      { name: "Sonali Meat", pricePerKg: 350 },
      { name: "Deshi Meat", pricePerKg: 520 },
      { name: "Pakistani Meat", pricePerKg: 300 },
    ],
  },
  {
    id: 4,
    name: "Baby Chicks",
    slug: "baby",
    page: "baby.html",
    image: "chicks.jpg",
    description: "Healthy baby chicks - Broiler, Layer",
    types: [
      { name: "Broiler", pricePerPcs: 60 },
      { name: "Layer", pricePerPcs: 80 },
    ],
  },
];

// GET /api/products  - all products
router.get("/", (req, res) => {
  res.json(products);
});

// GET /api/products/search?q=hen  - search
router.get("/search", (req, res) => {
  const query = (req.query.q || "").toLowerCase().trim();

  if (!query) return res.json(products);

  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.types.some((t) => t.name.toLowerCase().includes(query))
  );

  res.json(results);
});

// GET /api/products/:slug  - single product
router.get("/:slug", (req, res) => {
  const product = products.find((p) => p.slug === req.params.slug);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

module.exports = router;
