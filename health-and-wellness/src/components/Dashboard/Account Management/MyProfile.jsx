import React, { useState } from "react";
import { FaIdCard, FaEnvelope, FaPhone, FaClock } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";

import InputFloatingLabel from "../../Common/InputFloatingLabel";
import ToastAlert from "../../Common/ToastAlert";
import profilePic from "/src/assets/images/sample-profile-pic.jpg";

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "John",
    middleName: "A.",
    lastName: "Doe",
    suffix: "Jr.",
    email: "user@example.com",
    password: "********",
    confirmPassword: "",
    contact: "+639270338762",
  });

  const user = {
    ...formData,
    id: "USR123456",
    project_id: "PRJ001",
    user_level_id: "UL001",
    position: "Administrator",
    is_active: true,
    profile_image: profilePic,
    created_at: "2024-01-15T12:30:00Z",
    updated_at: "2024-06-25T08:45:00Z",
    last_login: "2025-07-20T14:00:00Z",
    last_password_reset_at: "2025-06-10T09:20:00Z",
    is_verified: true,
    division_id: "DIV002",
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Block numbers in name fields
    if (
      ["firstName", "middleName", "lastName"].includes(id) &&
      /\d/.test(value)
    )
      return;

    if (id === "contact") {
      if (!/^\d{0,9}$/.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleEdit = () => {
    const contactStripped = formData.contact.replace(/^\+63/, "");
    setFormData((prev) => ({ ...prev, contact: contactStripped }));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      firstName: "John",
      middleName: "A.",
      lastName: "Doe",
      suffix: "Jr.",
      email: "user@example.com",
      password: "********",
      confirmPassword: "",
      contact: "+639270338762",
    });
    setIsEditing(false);
    setToast(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSave = () => {
    const {
      firstName,
      middleName,
      lastName,
      contact,
      password,
      confirmPassword,
    } = formData;

    if (!firstName.trim())
      return setToast({ type: "error", message: "First Name is required." });
    if (/\d/.test(firstName))
      return setToast({
        type: "error",
        message: "First Name must not contain numbers.",
      });

    if (!middleName.trim())
      return setToast({ type: "error", message: "Middle Name is required." });
    if (/\d/.test(middleName))
      return setToast({
        type: "error",
        message: "Middle Name must not contain numbers.",
      });

    if (!lastName.trim())
      return setToast({ type: "error", message: "Last Name is required." });
    if (/\d/.test(lastName))
      return setToast({
        type: "error",
        message: "Last Name must not contain numbers.",
      });

    if (!/^\d{9}$/.test(contact))
      return setToast({
        type: "error",
        message: "Contact must be exactly 9 digits.",
      });

    if (!password)
      return setToast({ type: "error", message: "Password is required." });
    if (password !== confirmPassword)
      return setToast({ type: "error", message: "Passwords do not match." });

    const updatedForm = {
      ...formData,
      contact: `+639${contact}`, // ✅ fixed
    };

    // You can now send `updatedForm` to API/backend if needed.

    setIsEditing(false);
    setToast({ type: "success", message: "Profile updated successfully." });

    setTimeout(() => setToast(null), 4000);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
      <p className="text-sm text-gray-800 mt-2">
        View and manage your account details.
      </p>
      <hr className="my-4 border-gray-400" />
      <div className="flex justify-center items-center px-4">
        <div className="flex w-full max-w-6xl rounded-xl bg-white overflow-hidden shadow-md border border-gray-200 max-h-[80vh]">
          {/* Left Column */}
          <div className="w-64 flex flex-col items-center justify-center p-6 bg-gray-50 border-r border-gray-200 relative">
            <img
              src={user.profile_image}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-green-800 shadow-md object-cover mb-4"
            />
            <div className="w-full h-px bg-gray-500 mt-1 mb-5" />

            <button className="w-full px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition mb-3 shadow-md">
              Change Profile Picture
            </button>

            <button
              onClick={isEditing ? handleSave : handleEdit}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-md border-2 transition duration-200
    text-green-800 border-green-800 bg-transparent
    hover:bg-green-800 hover:text-white hover:shadow-md hover:shadow-green-400
  `}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>

            <div
              className={`w-full transition-all duration-300 ease-in-out transform ${
                isEditing
                  ? "opacity-100 max-h-40 mt-2"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <button
                onClick={handleCancel}
                className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 shadow-md transition"
              >
                Cancel Edit
              </button>

              {toast && (
                <div className="mt-3 flex justify-center">
                  <ToastAlert message={toast.message} type={toast.type} />
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Personal Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Personal Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputFloatingLabel
                  id="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <InputFloatingLabel
                  id="middleName"
                  label="Middle Name"
                  value={formData.middleName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <InputFloatingLabel
                  id="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <InputFloatingLabel
                  id="suffix"
                  label="Suffix"
                  value={formData.suffix}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputFloatingLabel
                  id="email"
                  type="email"
                  label="Email"
                  value={formData.email}
                  disabled
                />
                <InputFloatingLabel
                  id="contact"
                  label={isEditing ? "Contact Number (+63)" : "Contact Number"}
                  value={formData.contact}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {/* Password Field */}
                <div className="relative">
                  <InputFloatingLabel
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[60%] -translate-y-1/2 text-lg text-gray-500 hover:text-blue-500"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  )}
                </div>

                {/* Confirm Password Field */}
                {isEditing && (
                  <div className="relative">
                    <InputFloatingLabel
                      id="confirmPassword"
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-[60%] -translate-y-1/2 text-lg text-gray-500 hover:text-blue-500"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Account Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "User ID", value: user.id, icon: <FaIdCard /> },
                  { label: "User Level", value: user.user_level_id },
                  { label: "Position", value: user.position },
                  {
                    label: "Account Created",
                    value: formatDate(user.created_at),
                  },
                  {
                    label: "Last Login",
                    value: formatDate(user.last_login),
                    icon: <FaClock />,
                  },
                  { label: "Verified", value: user.is_verified ? "Yes" : "No" },
                  { label: "Active", value: user.is_active ? "Yes" : "No" },
                  {
                    label: "Password Reset",
                    value: formatDate(user.last_password_reset_at),
                  },
                  { label: "Last Updated", value: formatDate(user.updated_at) },
                ].map((field, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      {field.icon && <span>{field.icon}</span>}
                      {field.label}
                    </div>
                    <div className="text-sm text-gray-800 mt-1 font-semibold">
                      {field.value || "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
