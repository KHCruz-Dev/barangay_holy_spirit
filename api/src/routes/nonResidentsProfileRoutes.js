// src/routes/nonResidentsProfileRoutes.js
const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/authMiddleware");

const {
  getNonResidentsPageHandler,
  getSingleNonResidentsProfileHandler,
  createNonResidentsProfileHandler,
  updateNonResidentsProfileHandler,
} = require("../controllers/nonResidentsProfileController");

router.use(requireAuth);

router.get("/", getNonResidentsPageHandler);
router.get("/:id", getSingleNonResidentsProfileHandler);
router.post("/", createNonResidentsProfileHandler);
router.put("/:id", updateNonResidentsProfileHandler);

module.exports = router;
