import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full border border-blue-200">
        <span className="text-7xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">404</span>
        <h1 className="text-3xl font-bold text-blue-800 mb-2 font-montserrat">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">Sorry, the page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Go to Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
