import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EntrepreneursList from "../components/ProfileLists/EntrepreneursList";

const InvestorDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow p-8">
      <div className="w-full flex justify-between items-center mb-2">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 font-semibold"
        >
          Go to Main Dashboard
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 font-semibold"
        >
          Logout
        </button>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2 font-montserrat drop-shadow">
        Welcome, Investor!
      </h1>
      <p className="text-lg text-blue-700 mb-6 text-center max-w-xl">
        Manage your portfolio, track investments, and discover new opportunities
        tailored for you.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">💼</span>
          <h2 className="font-semibold text-lg mb-1">My Investments</h2>
          <p className="text-gray-500 text-sm mb-3 text-center">
            View and manage all your current investments in one place.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            View Investments
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">📈</span>
          <h2 className="font-semibold text-lg mb-1">Opportunities</h2>
          <p className="text-gray-500 text-sm mb-3 text-center">
            Browse new startups and business opportunities to invest in.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            Explore
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">💬</span>
          <h2 className="font-semibold text-lg mb-1">Messages</h2>
          <p className="text-gray-500 text-sm mb-3 text-center">
            Connect and chat with entrepreneurs directly.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            Go to Chat
          </button>
        </div>
      </div>
      <div className="w-full flex justify-center items-center mt-2">
        <EntrepreneursList />
      </div>
    </div>
  );
};

export default InvestorDashboard;
