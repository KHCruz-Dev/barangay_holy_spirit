const {
  getAdminSummary,
  getStaffSummary,
  getIdPrinterSummary,
} = require("../models/residentProfileSummaryModel");

const { ROLES } = require("../config/roles");

async function getDashboardSummaryHandler(req, res) {
  try {
    const user = req.user;

    // =========================
    // ADMINISTRATOR
    // =========================
    if (user.role === ROLES.ADMINISTRATOR) {
      const summary = await getAdminSummary();

      return res.json({
        role: ROLES.ADMINISTRATOR,
        summary,
      });
    }

    // =========================
    // ENCODER-TYPE ROLES
    // =========================
    if (
      user.role === ROLES.ENCODER ||
      user.role === ROLES.REGISTRATION_STAFF ||
      user.role === ROLES.COORDINATOR
    ) {
      const summary = await getStaffSummary(user.sub);

      return res.json({
        role: "ENCODER_VIEW",
        summary,
      });
    }

    // =========================
    // FALLBACK (ID_PRINTER or others)
    // =========================
    return res.json({
      role: user.role,
      summary: {},
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ message: "Failed to load dashboard summary" });
  }
}

async function getDashboardSummaryHandler(req, res) {
  try {
    const user = req.user;

    // =========================
    // ADMIN
    // =========================
    if (user.role === ROLES.ADMINISTRATOR) {
      const summary = await getAdminSummary();
      return res.json({ role: user.role, summary });
    }

    // =========================
    // STAFF
    // =========================
    if (
      user.role === ROLES.ENCODER ||
      user.role === ROLES.REGISTRATION_STAFF ||
      user.role === ROLES.COORDINATOR
    ) {
      const summary = await getStaffSummary(user.sub);
      return res.json({ role: "ENCODER_VIEW", summary });
    }

    // =========================
    // ✅ ID PRINTER
    // =========================
    if (user.role === ROLES.ID_PRINTER) {
      const summary = await getIdPrinterSummary();
      return res.json({ role: user.role, summary });
    }

    // =========================
    // FALLBACK
    // =========================
    return res.json({ role: user.role, summary: {} });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ message: "Failed to load dashboard summary" });
  }
}

module.exports = {
  getDashboardSummaryHandler,
  getDashboardSummaryHandler,
};
