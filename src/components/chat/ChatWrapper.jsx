import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { io } from "socket.io-client";
import ChatList from "./ChatList";
import Chat from "./Chat";
import SkeletonLoader from "../common/SkeletonLoader";

const DEBUG = import.meta.env.VITE_DEBUG === "true";

function ChatWrapper() {
  const { role, id, chatId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collaborations, setCollaborations] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(!!chatId);
  const socketUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_LOCAL_API_URL || "http://localhost:3000").trim();
  const socket = io(socketUrl, {
    query: { userId: String(user?.id || "") },
  });

  const fetchCollaborations = async () => {
    try {
      setIsLoading(true);
      if (DEBUG) console.log("Fetching collaborations with params:", { userId: String(user.id), status: "accepted" });
      const response = await api.get("/collaborations", {
        params: { userId: String(user.id), status: "accepted" },
      });
      if (DEBUG) {
        console.log("API response:", JSON.stringify(response, null, 2));
        console.log("Fetched collaborations:", JSON.stringify(response.data, null, 2));
      }
      setCollaborations(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching collaborations:", err.message, err.response?.data);
      setError("Failed to load chats. Network issue or server error. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const retryFetchCollaborations = () => {
    setError(null); // Clear error to show loading state again
    fetchCollaborations();
  };

  useEffect(() => {
    if (!user?.id || String(user.id) !== id || user.role !== role) {
      if (DEBUG) console.log("Invalid user or role, redirecting to dashboard");
      navigate(`/dashboard/${user?.role || "entrepreneur"}`);
      return;
    }

    fetchCollaborations();

    socket.on("connect", () => {
      if (DEBUG) console.log("Socket connected for ChatWrapper:", socket.id);
    });

    socket.on("collaborationUpdated", ({ userId: updatedUserId }) => {
      if (updatedUserId === String(user.id)) {
        if (DEBUG) console.log("Collaboration updated, refetching for user:", user.id);
        fetchCollaborations();
      }
    });

    socket.on("requestUpdated", ({ userId: updatedUserId }) => {
      if (updatedUserId === String(user.id)) {
        if (DEBUG) console.log("Request updated, refetching collaborations for user:", user.id);
        fetchCollaborations();
      }
    });

    return () => {
      socket.off("collaborationUpdated");
      socket.off("requestUpdated");
      socket.off("connect");
    };
  }, [user?.id, id, role, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
        <div className="w-full md:w-1/3">
          {[...Array(5)].map((_, index) => (
            <SkeletonLoader key={index} type="chat" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[80vh] bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 shadow-xl flex-col items-center justify-center p-6">
        <p className="text-center text-gray-600 dark:text-gray-400 font-montserrat mb-4">{error}</p>
        <button
          onClick={retryFetchCollaborations}
          className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors font-montserrat"
          aria-label="Retry loading chats"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
      {chatId ? (
        <Chat
          collaborations={collaborations}
          selectedChatId={chatId}
          setIsMobileChatOpen={setIsMobileChatOpen}
          socket={socket}
          id={id}
          role={role}
        />
      ) : (
        <ChatList
          collaborations={collaborations}
          error={error}
          role={role}
          id={id}
          isMobileChatOpen={isMobileChatOpen}
          setIsMobileChatOpen={setIsMobileChatOpen}
        />
      )}
    </div>
  );
}

export default ChatWrapper;