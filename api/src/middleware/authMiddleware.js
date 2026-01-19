const { verifyToken } = require("../utils/jwt");

function requireAuth(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const decoded = verifyToken(token);

    // ✅ Attach only what we trust and need
    req.user = {
      sub: decoded.sub, // user id
      role: decoded.role, // role
      department_id: decoded.department_id,
    };

    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE ERROR:", err);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = {
  requireAuth,
};
