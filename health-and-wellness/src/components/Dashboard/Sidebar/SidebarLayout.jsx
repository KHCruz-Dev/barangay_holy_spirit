import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SidebarItem from "./SidebarItem";
import SidebarDropdown from "./SidebarDropdown";
import { sidebarNav } from "../../../config/navigation/sidebarNav";

import { apiPost } from "../../../config/services/api";
import { useAuth } from "../../../context/authContext";

import { formatRole } from "../../../utils/formatRole";

// images
import profilePic from "../../../assets/images/sample-profile-pic.jpg";
import HAWLogo from "../../../assets/images/BHS-Health-and-Wellness-Logo.png";

const SidebarLayout = ({ activeItem, setActiveItem }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // HARD GUARD
  if (!user || !user.role) return null;

  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const hasAccess = (roles = []) => roles.includes(user.role);

  const handleLogout = async () => {
    try {
      await apiPost("/api/auth/logout"); // clears JWT cookie
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null); // ✅ clear auth context
      navigate("/login"); // ✅ redirect
    }
  };

  const getFullName = (user) =>
    [
      user.first_name || user.firstName,
      user.middle_name || user.middleName,
      user.last_name || user.lastName,
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <aside className="w-72 bg-white border-r flex flex-col">
      {/* ================= BRAND HEADER ================= */}
      <div className="px-5 py-4 bg-green-50 border-b">
        <div className="flex items-center gap-3">
          <img
            src={HAWLogo}
            alt="Alagang Valmocina"
            crossOrigin="anonymous"
            className="h-10 w-10 object-contain"
          />
          <div className="leading-tight">
            <h1 className="text-green-900 text-base font-bold">
              ALAGANG VALMOCINA
            </h1>
            <p className="text-xs text-green-700">Health & Wellness</p>
          </div>
        </div>
      </div>

      {/* ================= USER IDENTITY ================= */}
      <div className="px-5 py-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src={profilePic}
            alt="User"
            className="w-11 h-11 rounded-full object-cover border"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {getFullName(user)}
            </p>
            <p className="text-xs text-gray-500 tracking-wide">
              {formatRole(user.role)}
            </p>
          </div>
        </div>
      </div>

      {/* ================= NAVIGATION ================= */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {sidebarNav.map((item) => {
          if (!hasAccess(item.roles)) return null;

          if (item.children) {
            const visibleChildren = item.children.filter((child) =>
              hasAccess(child.roles)
            );
            if (visibleChildren.length === 0) return null;

            return (
              <SidebarDropdown
                key={item.label}
                label={item.label}
                Icon={item.icon}
                dropdownId={item.dropdownId}
                isOpen={activeDropdown === item.dropdownId}
                onToggle={toggleDropdown}
              >
                {visibleChildren.map((child) => (
                  <SidebarItem
                    key={child.label}
                    label={child.label}
                    Icon={child.icon}
                    isActive={activeItem === child.label}
                    onClick={() => {
                      setActiveItem(child.label);
                      setActiveDropdown(item.dropdownId);
                    }}
                  />
                ))}
              </SidebarDropdown>
            );
          }

          return (
            <SidebarItem
              key={item.label}
              label={item.label}
              Icon={item.icon}
              isActive={activeItem === item.label}
              onClick={() => {
                setActiveItem(item.label);
                setActiveDropdown(null);
              }}
            />
          );
        })}
      </nav>

      {/* ================= LOGOUT ================= */}
      <div className="px-4 py-3 border-t bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SidebarLayout;
