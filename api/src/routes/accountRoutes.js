const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");

const {
  registerAccount,
  loginAccount,
  logoutAccount,
  getAuthenticatedUser, // ✅ ADD
} = require("../controllers/accountController");

router.post("/register", registerAccount);
router.post("/login", loginAccount);
router.post("/logout", logoutAccount);

// ✅ AUTH HYDRATION ROUTE
router.get("/me", requireAuth, getAuthenticatedUser);

module.exports = router;
