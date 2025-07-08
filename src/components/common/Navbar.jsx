
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-cyan-950 py-3 shadow-lg navbar rounded-b-xl">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center gap-2 text-cyan-300 text-2xl font-black tracking-tight font-montserrat transition-colors duration-200 hover:text-cyan-400">
          <span className="inline-block w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          </span>
          Business Nexus
        </Link>
        {/* Hamburger Icon */}
        <button
          className="md:hidden flex items-center px-3 py-2 border border-cyan-700 rounded text-cyan-300 hover:text-cyan-400 hover:border-cyan-400 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Nav Links */}
        <ul
          className={`font-poppins font-medium flex-col md:flex-row md:flex md:space-x-6 bg-cyan-900/95 md:bg-transparent px-4 py-3 md:p-0 rounded-lg absolute md:static top-16 left-4 right-4 z-20 transition-all duration-300 ${menuOpen ? 'flex' : 'hidden'} md:flex`}
        >
          <li>
            <Link to="/" className="block text-cyan-100 px-3 py-2 rounded-lg hover:bg-cyan-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="block text-cyan-100 px-3 py-2 rounded-lg hover:bg-cyan-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/services" className="block text-cyan-100 px-3 py-2 rounded-lg hover:bg-cyan-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400" onClick={() => setMenuOpen(false)}>
              Services
            </Link>
          </li>
          <li>
            <Link to="/contact" className="block text-cyan-100 px-3 py-2 rounded-lg hover:bg-cyan-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar
