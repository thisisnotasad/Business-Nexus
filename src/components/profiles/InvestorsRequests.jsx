import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { io } from "socket.io-client";

const DEBUG = import.meta.env.VITE_DEBUG === "true";

function InvestorsRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const socketUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_LOCAL_API_URL || "http://localhost:3000").trim();
  const socket = io(socketUrl, {
    query: { userId: user.id },
  });

  const fetchRequests = async () => {
    try {
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        Investor Requests
      </h2>
      <div className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-sm">
            {error}
          </div>
        )}
        {requests.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No pending requests at the moment.
            </p>
          </div>
        ) : (
          requests.map((request) => {
            const collaborator = request.investorId === user.id ? request.entrepreneur : request.investor;
            return (
              <div
                key={request.id}
                className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={collaborator.avatar}
                  alt={collaborator.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {collaborator.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {collaborator.role}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {request.profileSnippet}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors duration-200"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default InvestorsRequests;