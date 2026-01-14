import { useState } from "react";
import { FiMenu, FiChevronLeft } from "react-icons/fi";
import SidebarLayout from "../../components/Dashboard/Sidebar/SidebarLayout";
import DashboardContent from "./DashboardContent";

import { usePersistedState } from "../../hooks/usePersistedState";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { useSwipeClose } from "../../hooks/useSwipeClose";

const TabletShell = () => {
  const [activeItem, setActiveItem] = usePersistedState(
    "tablet-active-menu",
    "Analytics"
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useLockBodyScroll(sidebarOpen);

  const swipeHandlers = useSwipeClose(() => setSidebarOpen(false));

  return (
    <div className="relative h-screen bg-[#EFEFEF] text-gray-800 overflow-hidden">
      {/* ===== TOP BAR ===== */}
      <header className="flex items-center gap-3 px-4 py-3 bg-white shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <FiMenu className="w-6 h-6 text-green-900" />
        </button>

        <span className="font-semibold text-green-900 truncate">
          {activeItem}
        </span>
      </header>

      {/* ===== SIDEBAR OVERLAY ===== */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
          {...swipeHandlers}
          className={`
            absolute left-0 top-0 h-full w-72 bg-white shadow-xl
            transform transition-transform duration-300 ease-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Subtle close affordance */}
          <div className="absolute right-[-18px] top-1/2 -translate-y-1/2">
            <div className="bg-white shadow-md rounded-full p-1">
              <FiChevronLeft className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          <SidebarLayout
            activeItem={activeItem}
            setActiveItem={(item) => {
              setActiveItem(item);
              setSidebarOpen(false);
            }}
          />
        </aside>
      </div>

      {/* ===== CONTENT ===== */}
      <main className="h-[calc(100vh-56px)] overflow-y-auto p-4">
        <DashboardContent activeItem={activeItem} />
      </main>
    </div>
  );
};

export default TabletShell;
