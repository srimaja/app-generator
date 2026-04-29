import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// ===== In-memory DB =====
let db: any[] = [];
let users: any[] = [];

// ===== Load Config =====
const configPath = path.join(__dirname, "../config/app.json");

let config: any = {};
try {
  const raw = fs.readFileSync(configPath, "utf-8");
  config = JSON.parse(raw);
} catch (err) {
  console.error("Error reading config:", err);
}

// ===== Middleware (Mock Auth) =====
const authMiddleware = (req: any, res: any, next: any) => {
  // attach dummy user
  req.user = { id: "user1" };
  next();
};

// ===== Health Check =====
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ===== Get Config =====
app.get("/config", (req, res) => {
  res.json(config);
});

// ===== Register =====
app.post("/auth/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  users.push({ id: Date.now().toString(), email, password });

  res.json({ message: "User registered" });
});

// ===== Login =====
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ message: "Login success", user });
});

// ===== Create Data =====
app.post("/data", authMiddleware, (req: any, res) => {
  const item = {
    id: Date.now().toString(),
    entity: config.entity || "default",
    data: req.body,
    userId: req.user.id,
  };

  db.push(item);

  res.json({ message: "Saved", item });
});

// ===== Get Data =====
app.get("/data", authMiddleware, (req: any, res) => {
  const userData = db.filter(
    (item) =>
      item.entity === config.entity &&
      item.userId === req.user.id
  );

  res.json(userData);
});

// ===== Delete Data =====
app.delete("/data/:id", authMiddleware, (req: any, res) => {
  const { id } = req.params;

  db = db.filter((item) => item.id !== id);

  res.json({ message: "Deleted" });
});

// ===== Update Data =====
app.put("/data/:id", authMiddleware, (req: any, res) => {
  const { id } = req.params;

  const index = db.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Not found" });
  }

  db[index].data = req.body;

  res.json({ message: "Updated", item: db[index] });
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});