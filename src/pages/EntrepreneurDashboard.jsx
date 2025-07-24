import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaLightbulb, FaComments } from "react-icons/fa";

const EntrepreneurDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
  };


  return (
    <div className="min-h-[100vh] flex flex-col bg-gradient-to-br from-indigo-50 to-teal-50 rounded-xl shadow-xl p-8 animate__fadeIn">
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-teal-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-teal-700 transition-transform hover:scale-105 font-semibold"
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
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-500 mb-3 font-montserrat text-center drop-shadow-lg animate__fadeIn">
        Welcome, Entrepreneur!
      </h1>
      <p className="text-lg text-slate-600 mb-8 text-center max-w-2xl mx-auto">
        Pitch your ideas, connect with investors, and grow your business network.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow animate__fadeIn">
          <FaBuilding className="text-4xl text-teal-600 mb-3 animate__bounceIn" />
          <h2 className="font-semibold text-xl text-slate-800 mb-2">My Business</h2>
          <p className="text-slate-500 text-sm mb-4 text-center">
            View and update your business profile and details.
          </p>
          <button
            onClick={() => navigate(`/profile/entrepreneur/${user?.id}`)}
            className="bg-teal-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-teal-700 transition-transform hover:scale-105"
          >
            View Business
          </button>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow animate__fadeIn">
          <FaLightbulb className="text-4xl text-teal-600 mb-3 animate__bounceIn" />
          <h2 className="font-semibold text-xl text-slate-800 mb-2">Pitch Ideas</h2>
          <p className="text-slate-500 text-sm mb-4 text-center">
            Submit new business ideas and proposals to investors.
          </p>
          <button
            onClick={() => navigate("/pitch")}
            className="bg-teal-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-teal-700 transition-transform hover:scale-105"
          >
            Pitch Now
          </button>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow animate__fadeIn">
          <FaComments className="text-4xl text-teal-600 mb-3 animate__bounceIn" />
          <h2 className="font-semibold text-xl text-slate-800 mb-2">Messages</h2>
          <p className="text-slate-500 text-sm mb-4 text-center">
            Chat and connect with potential investors.
          </p>
          <button
            onClick={() => navigate(`/chat/entrepreneur/${user?.id}`)}
            className="bg-teal-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-teal-700 transition-transform hover:scale-105"
          >
            Go to Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;