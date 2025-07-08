import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineHome, HiOutlineUser, HiOutlineChatAlt2, HiOutlineLogout } from "react-icons/hi";

function Sidebar({ onLogout, userRole }) {
  // Responsive sidebar state
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-800 text-white p-2 rounded-full shadow-lg focus:outline-none"
        style={{ left: 'auto', right: '1.25rem' }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open sidebar"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white flex flex-col shadow-xl z-40 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ minWidth: 0 }}
      >
        <div className="flex items-center gap-2 px-6 py-6 border-b border-blue-500">
          <img src="/src/assets/images/logo.png" alt="Business Nexus Logo" className="h-10 w-10 rounded-full shadow" />
          <span className="text-2xl font-bold font-montserrat tracking-tight">Business Nexus</span>
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            <li>
              <NavLink to={`/dashboard/${userRole}`} className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'}` } onClick={() => setOpen(false)}>
                <HiOutlineHome className="text-xl" /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={`/profile/${userRole}`} className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'}` } onClick={() => setOpen(false)}>
                <HiOutlineUser className="text-xl" /> Profile
              </NavLink>
            </li>
            <li>
              <NavLink to={`/chat/${userRole}`} className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'}` } onClick={() => setOpen(false)}>
                <HiOutlineChatAlt2 className="text-xl" /> Chat
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="px-4 pb-6 mt-auto">
          <button onClick={() => { setOpen(false); onLogout(); }} className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-900 transition font-semibold">
            <HiOutlineLogout className="text-xl" /> Logout
          </button>
        </div>
      </aside>
      {/* Overlay for mobile */}
      {open && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setOpen(false)}></div>}
    </>
  );
}

export default Sidebar;
