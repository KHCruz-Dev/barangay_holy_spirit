import SidebarLayout from "../../components/Dashboard/Sidebar/SidebarLayout";
import DashboardContent from "./DashboardContent";

const DesktopShell = ({ activeItem, setActiveItem, user }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#EFEFEF] text-gray-800">
      {/* Sidebar */}
      <SidebarLayout
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        user={user}
      />

      {/* Main Content */}
      <main
        className="
          flex-1
          overflow-y-auto
          px-4 py-4
          md:px-6 md:py-6
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            max-w-full
            md:max-w-[95%]
            lg:max-w-7xl
          "
        >
          <DashboardContent activeItem={activeItem} />
        </div>
      </main>
    </div>
  );
};

export default DesktopShell;
