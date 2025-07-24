import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaChartLine, FaComments } from "react-icons/fa";

const InvestorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    logout(); // Navigation handled in AuthContext
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-teal-50 rounded-xl shadow-xl p-8 animate__fadeIn">
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-700 transition-transform hover:scale-105 font-semibold"
        >
          Main Dashboard
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition-transform hover:scale-105 font-semibold"
        >
          Logout
        </button>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 mb-3 font-montserrat text-center drop-shadow-lg animate__fadeIn">
        Welcome, Investor!
      </h1>
      <p className="text-lg text-slate-600 mb-8 text-center max-w-2xl mx-auto">
        Discover new opportunities, manage your portfolio, and connect with innovative entrepreneurs.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow animate__fadeIn">
          <FaBriefcase className="text-4xl text-indigo-600 mb-3 animate__bounceIn" />
          <h2 className="font-semibold text-xl text-slate-800 mb-2">My Investments</h2>
          <p className="text-slate-500 text-sm mb-4 text-center">
            View and manage all your current investments in one place.
          </p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-700 transition-transform hover:scale-105">
            View Investments
          </button>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow animate__fadeIn">
          <FaChartLine className="text-4xl text-indigo-600 mb-3 animate__bounceIn" />
          <h2 className="font-semibold text-xl text-slate-800 mb-2">Opportunities</h2>
          <p className="text-slate-500 text-sm mb-4 text-center">
            Browse new startups and business opportunities to invest in.
          </p>
          <button
            onClick={() => navigate("/discover")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-700 transition-transform hover:scale-105"
          >
            Explore
          </button>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow animate__fadeIn">
          <FaComments className="text-4xl text-indigo-600 mb-3 animate__bounceIn" />
          <h2 className="font-semibold text-xl text-slate-800 mb-2">Messages</h2>
          <p className="text-slate-500 text-sm mb-4 text-center">
            Connect and chat with entrepreneurs directly.
          </p>
          <button
            onClick={() => navigate(`/chat/investor/${user?.id}`)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-700 transition-transform hover:scale-105"
          >
            Go to Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;