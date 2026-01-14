const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");
const RoleModel = require("../models/roleModel");

/* =========================
   GET USERS (ADMIN ONLY)
========================= */
async function getUsersHandler(req, res) {
  try {
    const users = await UserModel.getUsers();
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
}

/* =========================
   UPDATE STATUS
========================= */
async function updateStatusHandler(req, res) {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const updated = await UserModel.updateAccountStatus(userId, status);
    res.json(updated);
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
}

/* =========================
   UPDATE ROLE
========================= */
async function updateRoleHandler(req, res) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    // Convert role name → UUID
    const roleId = await RoleModel.getRoleIdByName(role);

    if (!roleId) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const updated = await UserModel.updateUserRole(userId, roleId);
    res.json(updated);
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ message: "Failed to update role" });
  }
}

/* =========================
   CHANGE PASSWORD (ADMIN)
========================= */
async function changePasswordHandler(req, res) {
  try {
    const { userId } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await UserModel.updateUserPassword(userId, hashed);

    res.json({ message: "Password updated" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
}

/* =========================
   DELETE ACCOUNT
========================= */
async function deleteAccountHandler(req, res) {
  try {
    const { userId } = req.params;
    await UserModel.deleteAccount(userId);

    res.json({ message: "Account deleted" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Failed to delete account" });
  }
}

module.exports = {
  getUsersHandler,
  updateStatusHandler,
  updateRoleHandler,
  changePasswordHandler,
  deleteAccountHandler,
};
