import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-black">
        <DashboardContent />
      </main>
    </div>
  );
};

export default DashboardLayout;
