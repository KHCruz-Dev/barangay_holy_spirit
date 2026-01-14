import React, { useState } from "react";
import InputFloatingLabel from "../../../Common/InputFloatingLabel";
import DefaultAvatar from "../../../../assets/images/sample-profile-pic.jpg";
import { Eye, EyeOff } from "lucide-react";
import { ROLES } from "../../../../config/navigation/roles";
import ComboFloatingLabel from "../../../Common/ComboFloatingLabel";

import {
  updateUserStatus,
  updateUserRole,
  changeUserPassword,
  deleteUser,
} from "../../../../config/services/users/userService";

const UserManagementModal = ({ user, onClose, onUpdated = () => {} }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState(user?.role || "");

  if (!user) return null;

  async function handleStatus(status) {
    await updateUserStatus(user.id, status);
    onUpdated();
    onClose();
  }

  async function handleSaveRole() {
    try {
      await updateUserRole(user.id, role);

      alert("User role updated successfully");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  }

  async function handleChangePassword() {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await changeUserPassword(user.id, password, confirmPassword);
    alert("Password updated");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this account?")) return;
    await deleteUser(user.id);
    onUpdated();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="flex gap-6 items-center border-b pb-4">
          <img
            src={user.img_url || DefaultAvatar}
            alt={user.fullName}
            className="w-24 h-24 rounded-full border-2 border-green-700 object-cover"
          />

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {user.fullName}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm mt-1">
              Role: <span className="font-medium">{user.role}</span>
            </p>
            <p className="text-sm">
              Status:{" "}
              <span className="font-medium text-orange-600">{user.status}</span>
            </p>
          </div>
        </div>

        {/* ACCOUNT STATUS */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Account Status
          </h3>

          <div className="flex gap-2 flex-wrap">
            <button
              className="px-4 py-2 text-sm border border-green-700 text-green-700 rounded hover:bg-green-700 hover:text-white transition"
              onClick={() => handleStatus("Active")}
            >
              Approve
            </button>

            <button
              className="px-4 py-2 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
              onClick={() => handleStatus("Rejected")}
            >
              Reject
            </button>

            <button
              className="px-4 py-2 text-sm border border-gray-500 text-gray-600 rounded hover:bg-gray-600 hover:text-white transition"
              onClick={() => handleStatus("Disabled")}
            >
              Disable
            </button>
          </div>
        </section>

        {/* ROLE MANAGEMENT */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Role Management
          </h3>

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <ComboFloatingLabel
                label="User Role"
                options={Object.values(ROLES).map((r) => ({
                  label: r.replace("_", " "),
                  value: r,
                }))}
                value={role}
                requireMatch
                onChange={(value) => setRole(value)}
              />
            </div>

            <button
              className="h-[44px] px-4 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
              onClick={handleSaveRole}
            >
              Save Role
            </button>
          </div>
        </section>

        {/* SECURITY */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Security</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <InputFloatingLabel
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[60%] -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>

            <div className="relative">
              <InputFloatingLabel
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-[60%] -translate-y-1/2 text-gray-500"
              >
                {showConfirm ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          <button
            className="mt-3 px-5 py-2 text-sm border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-600 hover:text-white transition"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </section>

        {/* DANGER ZONE */}
        <section className="mt-8 border-t pt-4">
          <h3 className="text-sm font-semibold text-red-600 mb-2">
            Danger Zone
          </h3>

          <button
            className="px-5 py-2 text-sm border border-red-700 text-red-700 rounded hover:bg-red-700 hover:text-white transition"
            onClick={handleDelete}
          >
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
};

export default UserManagementModal;
