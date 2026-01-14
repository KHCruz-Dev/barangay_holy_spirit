const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/authMiddleware");

const {
  getResidentsPageHandler,
  getAllResidentsProfileHandler,
  getSingleResidentsProfileHandler,
  createResidentsProfileHandler,
  updateResidentsProfileHandler,
  disableResidentsProfileHandler,
  deleteResidentsProfileHandler,
  updateResidentIdStatusHandler,
  bulkUpdateResidentIdStatusHandler,
  getResidentIdStatusCountsHandler,
  bulkGetResidents,
} = require("../controllers/residentsProfileController");

// 🔒 PROTECTED ROUTES
router.use(requireAuth);

// LIST
router.get("/", getResidentsPageHandler);
router.get("/all", getAllResidentsProfileHandler);

// BULK FIRST (IMPORTANT)
router.get("/id-status-counts", getResidentIdStatusCountsHandler);
router.post("/bulk", bulkGetResidents);
router.patch("/bulk/id-status", bulkUpdateResidentIdStatusHandler);

// SINGLE
router.get("/:id", getSingleResidentsProfileHandler);
router.patch("/:id/id-status", updateResidentIdStatusHandler);
router.patch("/:id/disable", disableResidentsProfileHandler);

// CRUD
router.post("/", createResidentsProfileHandler);
router.put("/:id", updateResidentsProfileHandler);
router.delete("/:id", deleteResidentsProfileHandler);

module.exports = router;
