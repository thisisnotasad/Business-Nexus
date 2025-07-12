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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Sidebar onLogout={handleLogout} userRole={user?.role || "investor"} user={user} />
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto">
        <DashboardHeader
          title="Dashboard"
          subtitle={`Welcome back, ${user?.name || ''}`}
          user={user}
        />
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 min-h-[70vh] border border-slate-100 dark:border-slate-800 transition-colors duration-200">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;