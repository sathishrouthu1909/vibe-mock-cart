import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Mock Products
const products = [
  {
    id: "1",
    name: "T-Shirt",
    price: 19.99,
    image: "http://localhost:5173/uploads/Tshirt.JPG"
  },
  {
    id: "2",
    name: "Hoodie",
    price: 49.0,
    image: "http://localhost:5173/uploads/Hoodie.JPG"
  },
  {
    id: "3",
    name: "Cap",
    price: 15.5,
    image: "http://localhost:5173/uploads/Cap.JPG"
  },
  {
    id: "4",
    name: "Bottle",
    price: 12.25,
    image: "http://localhost:5173/uploads/Bottle.JPG"
  },
  {
    id: "5",
    name: "Backpack",
    price: 39.99,
    image: "http://localhost:5173/uploads/Backpack.JPG"
  },
  {
    id: "6",
    name: "Sneakers",
    price: 59.99,
    image: "http://localhost:5173/uploads/Sneakers.JPG"
  }
];


let cart = [];

// API Routes
app.get("/api/products", (req, res) => res.json({ products }));

app.get("/api/cart", (req, res) => {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  res.json({ cart, total });
});

app.post("/api/cart", (req, res) => {
  const { productId, qty } = req.body;
  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const existing = cart.find((i) => i.productId === productId);
  if (existing) existing.qty += qty;
  else cart.push({ productId, name: product.name, price: product.price, qty });

  res.json({ cart, total: cart.reduce((s, i) => s + i.price * i.qty, 0) });
});

app.delete("/api/cart/:id", (req, res) => {
  const id = req.params.id;
  cart = cart.filter((i) => i.productId !== id);
  res.json({ cart, total: cart.reduce((s, i) => s + i.price * i.qty, 0) });
});

app.post("/api/checkout", (req, res) => {
  const { name, email } = req.body;
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const receipt = {
    orderId: "R" + Math.floor(Math.random() * 100000),
    customer: { name, email },
    total,
    timestamp: new Date().toISOString(),
  };
  cart = [];
  res.json({ receipt });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
