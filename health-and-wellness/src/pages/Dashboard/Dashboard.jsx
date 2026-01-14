import React, { useState } from "react";
import DesktopShell from "./DesktopShell";
import TabletShell from "./TabletShell";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useAuth } from "../../context/authContext";

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState("Analytics");

  const { user, loading } = useAuth(); // 🔥 SINGLE SOURCE OF TRUTH
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return isTablet ? (
    <TabletShell
      activeItem={activeItem}
      setActiveItem={setActiveItem}
      user={user}
    />
  ) : (
    <DesktopShell
      activeItem={activeItem}
      setActiveItem={setActiveItem}
      user={user}
    />
  );
};

export default Dashboard;
