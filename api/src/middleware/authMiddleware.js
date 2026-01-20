const { verifyToken } = require("../utils/jwt");

function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
        code: "NO_TOKEN",
      });
    }

    const decoded = verifyToken(token);

    // ✅ Attach only what we trust and need
    req.user = {
      sub: decoded.sub,
      role: decoded.role,
      department_id: decoded.department_id,
    };

    next();
  } catch (err) {
    // 🔕 Do NOT spam logs for expected expiration
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please login again.",
        code: "TOKEN_EXPIRED",
        expiredAt: err.expiredAt,
      });
    }

    // ❗ Only log real auth problems
    if (process.env.NODE_ENV !== "production") {
      console.error("AUTH MIDDLEWARE ERROR:", err);
    }

    return res.status(401).json({
      message: "Invalid token",
      code: "INVALID_TOKEN",
    });
  }
}

module.exports = {
  requireAuth,
};
