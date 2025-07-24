import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  HiOutlineHome, 
  HiOutlineUser , 
  HiOutlineChatAlt2, 
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLightBulb,
} from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const primaryColor = user?.role === "investor" ? "orange" : "yellow";

  const navItems = [
    {
      path: `/dashboard/${user?.role}`,
      icon: <HiOutlineHome className="w-5 h-5" />,
      label: "Dashboard"
    },
    {
      path: `/profile/${user?.role}/${user?.id}`,
      icon: <HiOutlineUser  className="w-5 h-5" />,
      label: "Profile"
    },
    {
      path: `/chat/${user?.role}/${user?.id}`,
      icon: <HiOutlineChatAlt2 className="w-5 h-5" />,
      label: "Messages",
      badge: 3
    },
    ...(user?.role === 'investor' ? [{
      path: `/discover/investor/${user?.id}`,
      icon: <HiOutlineUser Group className="w-5 h-5" />,
      label: "Discover"
    }] : [{
      path: `/requests/entrepreneur/${user?.id}`,
      icon: <HiOutlineLightBulb className="w-5 h-5" />,
      label: "Requests"
    }]),
    {
      path: '/settings',
      icon: <FiSettings className="w-5 h-5" />,
      label: "Settings"
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className={`md:hidden fixed top-6 right-8 z-50 p-2.5 rounded-full bg-${primaryColor}-600 text-white shadow-lg hover:bg-${primaryColor}-700 transition-all duration-300 hover:scale-105 animate__fadeIn`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white/90 backdrop-blur-md shadow-lg
        border-r border-${primaryColor}-200 flex flex-col z-40
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className={`p-4 border-b border-${primaryColor}-200`}>
          <h2 className={`text-xl font-bold text-${primaryColor}-600 animate__fadeIn`}>
            Business Nexus
          </h2>
        </div>

        {/* User Profile */}
        {user && (
          <div className={`p-4 border-b border-${primaryColor}-200`}>
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || "https://via.placeholder.com/150"}
                alt={user.name}
                className="h-10 w-10 rounded-full border-2 border-orange-200 animate__bounceIn"
                onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
              />
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.path);
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      ${isActive 
                        ? `bg-${primaryColor}-50 text-${primaryColor}-600 font-semibold` 
                        : 'text-gray-600 hover:bg-orange-50'}
                      transition-all duration-200 hover:scale-[1.02]
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={`p-1.5 rounded-lg ${isActive ? `bg-${primaryColor}-100` : 'bg-orange-100'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`ml-auto bg-${primaryColor}-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate__bounceIn`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-orange-50 transition-all duration-200 hover:scale-[1.02]"
          >
            <span className="p-1.5 rounded-lg bg-orange-100">
              <HiOutlineLogout className="w-5 h-5" />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
