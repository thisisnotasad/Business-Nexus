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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <Sidebar onLogout={handleLogout} userRole={user?.role || "investor"} user={user} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-auto">
        <DashboardHeader user={user} />
        <div className="bg-white dark:bg-slate-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-6 min-h-[70vh] border border-slate-100/50 dark:border-slate-800/50 transition-all duration-300 animate__fadeIn">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;