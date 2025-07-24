import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { io } from "socket.io-client";
import { FiUser, FiCheck, FiX, FiClock, FiMessageSquare, FiBriefcase } from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";

const DEBUG = import.meta.env.VITE_DEBUG === "true";

function InvestorsRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_LOCAL_API_URL || "http://localhost:3000").trim();
  const socket = io(socketUrl, {
    query: { userId: user.id },
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      if (DEBUG) console.log("Fetching requests with params:", { userId: user.id, status: "pending" });
      const response = await api.get("/requests", {
        params: { userId: user.id, status: "pending" },
      });
      if (DEBUG) {
        console.log("API response:", JSON.stringify(response, null, 2));
        console.log("Fetched pending requests:", JSON.stringify(response.data, null, 2));
      }
      setRequests(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching requests:", err.message, err.response?.data);
      setError("Failed to load requests. Please try again.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      if (DEBUG) console.log("No user ID, skipping fetch");
      return;
    }

    fetchRequests();

    socket.on("connect", () => {
      if (DEBUG) console.log("Socket connected for InvestorsRequests:", socket.id);
    });

    socket.on("requestUpdated", ({ userId: updatedUserId }) => {
      if (updatedUserId === user.id) {
        if (DEBUG) console.log("Request updated, refetching requests for user:", user.id);
        fetchRequests();
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error in InvestorsRequests:", err.message);
    });

    return () => {
      socket.off("requestUpdated");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [user.id]);

  const handleAccept = async (requestId) => {
    try {
      if (DEBUG) console.log("Accepting request:", requestId);
      await api.put(`/requests/${requestId}/accept`, { id: user.id });
      if (DEBUG) console.log("Request accepted:", requestId);
    } catch (err) {
      console.error("Error accepting request:", err.message, err.response?.data);
      setError("Failed to accept request. Please try again.");
    }
  };

  const handleReject = async (requestId) => {
    try {
      if (DEBUG) console.log("Rejecting request:", requestId);
      await api.put(`/requests/${requestId}/reject`, { id: user.id });
      if (DEBUG) console.log("Request rejected:", requestId);
    } catch (err) {
      console.error("Error rejecting request:", err.message, err.response?.data);
      setError("Failed to reject request. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Collaboration Requests</h1>
        <p className="text-lg text-gray-600">
          Review and manage your pending investor collaboration requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{requests.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiBriefcase className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New This Week</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {requests.filter(r => new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <HiOutlineLightningBolt className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Response Time</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">24h</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiClock className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Pending Requests</h2>
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Filter
            </button>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Sort
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading requests...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 bg-red-50 border-l-4 border-red-500">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && requests.length === 0 && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <FiUser className="text-gray-400 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No pending requests</h3>
            <p className="text-gray-500 max-w-md">
              You don't have any pending collaboration requests at this time. When you receive new requests, they'll appear here.
            </p>
          </div>
        )}

        {/* Requests List */}
        {!loading && requests.length > 0 && (
          <div className="divide-y divide-gray-100">
            {requests.map((request) => {
              const collaborator = request.investorId === user.id ? request.entrepreneur : request.investor;
              const requestDate = new Date(request.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={collaborator.avatar || "/default-avatar.png"}
                          alt={collaborator.name}
                          className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{collaborator.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{collaborator.role}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <FiClock className="mr-1" />
                          <span>Requested {requestDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="md:w-1/2">
                      <p className="text-gray-700 mb-3">{request.profileSnippet}</p>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {request.investmentStage || "Early Stage"}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {request.industry || "Technology"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        <FiCheck />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        <FiX />
                        <span>Decline</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg transition-colors duration-200">
                        <FiMessageSquare />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default InvestorsRequests;