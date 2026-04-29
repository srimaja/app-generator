import jwt from "jsonwebtoken";

const SECRET = "secret123";

export const generateToken = (user: any) => {
  return jwt.sign(user, SECRET, { expiresIn: "1h" });
};

export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};