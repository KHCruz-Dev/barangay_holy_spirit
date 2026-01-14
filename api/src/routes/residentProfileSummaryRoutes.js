const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/authMiddleware");
const {
  getDashboardSummaryHandler,
} = require("../controllers/residentProfileSummaryController");

router.use(requireAuth);

router.get("/summary", getDashboardSummaryHandler);

module.exports = router;
