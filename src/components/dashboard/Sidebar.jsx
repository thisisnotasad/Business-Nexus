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

  // Helper function to check active state
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-slate-800 shadow-lg
        border-r border-slate-200 dark:border-slate-700 flex flex-col z-40
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* ... (keep the brand header and user profile sections the same) ... */}

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
                        ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'}
                      transition-colors duration-200
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={`p-1.5 rounded-lg ${isActive ? 'bg-indigo-100 dark:bg-slate-600' : 'bg-slate-100 dark:bg-slate-700'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700">
              <HiOutlineLogout className="w-5 h-5" />
            </span>
            <span>Logout</span>
          </button>
        </div>
        
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;