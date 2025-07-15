import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  HiOutlineHome, 
  HiOutlineUser, 
  HiOutlineChatAlt2, 
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLightBulb,
  HiOutlineUserGroup
} from "react-icons/hi";
import { FiSettings } from "react-icons/fi";

function Sidebar({ onLogout, userRole, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      path: `/dashboard/${userRole}`,
      icon: <HiOutlineHome className="w-5 h-5" />,
      label: "Dashboard"
    },
    {
      path: `/profile/${userRole}/${user?.id}`,
      icon: <HiOutlineUser className="w-5 h-5" />,
      label: "Profile"
    },
    {
      path: `/chat/${userRole}/${user?.id}`,
      icon: <HiOutlineChatAlt2 className="w-5 h-5" />,
      label: "Messages",
      badge: 3
    },
    ...(userRole === 'investor' ? [{
      path: '/discover',
      icon: <HiOutlineUserGroup className="w-5 h-5" />,
      label: "Discover"
    }] : [{
      path: '/pitch',
      icon: <HiOutlineLightBulb className="w-5 h-5" />,
      label: "My Pitch"
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
        className="md:hidden fixed top-6 right-8 z-50 p-2.5 rounded-full bg-indigo-900 text-white shadow-lg hover:bg-indigo-1000 transition-all duration-300 hover:scale-105 animate__fadeIn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900 bg-opacity-90 backdrop-blur-md shadow-xl
        border-r border-indigo-100/50 dark:border-slate-800/50 flex flex-col z-40
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-4 border-b border-indigo-100/50 dark:border-slate-800/50">
          <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 animate__fadeIn">
            Business Nexus
          </h2>
        </div>

        {/* User Profile */}
        {user && (
          <div className="p-4 border-b border-indigo-100/50 dark:border-slate-800/50">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
                alt={user.name}
                className="h-10 w-10 rounded-full border-2 border-indigo-200 dark:border-slate-600 animate__bounceIn"
                onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150")}
              />
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{userRole}</p>
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
                        ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 font-semibold' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800/50'}
                      transition-all duration-200 hover:scale-[1.02]
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={`p-1.5 rounded-lg ${isActive ? 'bg-teal-100 dark:bg-teal-800' : 'bg-indigo-100 dark:bg-slate-700'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate__bounceIn">
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
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 dark:text-red-400 hover:bg-indigo-50 dark:hover:bg-slate-800/50 transition-all duration-200 hover:scale-[1.02]"
          >
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-slate-700">
              <HiOutlineLogout className="w-5 h-5" />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 dark:bg-black/70 z-30 md:hidden transition-opacity duration-300" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;