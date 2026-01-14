const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/requireAuth");
const { requireRole } = require("../middleware/requireRole");

const UsersController = require("../controllers/userController");
const { ROLES } = require("../config/roles");

/* =========================
   USERS (ADMIN ONLY)
========================= */
router.get(
  "/",
  requireAuth,
  requireRole(ROLES.ADMINISTRATOR),
  UsersController.getUsersHandler
);

router.patch(
  "/:userId/status",
  requireAuth,
  requireRole(ROLES.ADMINISTRATOR),
  UsersController.updateStatusHandler
);

router.patch(
  "/:userId/role",
  requireAuth,
  requireRole(ROLES.ADMINISTRATOR),
  UsersController.updateRoleHandler
);

router.patch(
  "/:userId/password",
  requireAuth,
  requireRole(ROLES.ADMINISTRATOR),
  UsersController.changePasswordHandler
);

router.delete(
  "/:userId",
  requireAuth,
  requireRole(ROLES.ADMINISTRATOR),
  UsersController.deleteAccountHandler
);

module.exports = router;
