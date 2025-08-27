const jwt = require("jsonwebtoken");

// Read secret from environment with a safe default note (should be set in .env)
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // Expect: Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = userPayload;
    next();
  });
}

module.exports = {
  authenticateToken,
  JWT_SECRET,
};
