import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <Sidebar onLogout={handleLogout} userRole={user?.role || "investor"} />
      <main className="flex-1 p-6 md:p-10">
        <DashboardHeader
          title="Dashboard"
          subtitle="Welcome to your business dashboard."
          user={user}
        />
        <div className="bg-white/80 rounded-2xl shadow-lg p-6 min-h-[60vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
