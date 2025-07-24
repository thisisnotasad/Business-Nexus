import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { io } from "socket.io-client";
import ChatList from "./ChatList";
import Chat from "./Chat";
import SkeletonLoader from "../common/SkeletonLoader";
import { FiRefreshCw, FiAlertCircle } from "react-icons/fi";

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
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
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
      setError("Failed to load chats. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const retryFetchCollaborations = () => {
    setError(null);
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

    socket.on("connect_error", (err) => {
      if (DEBUG) console.log("Socket connection error:", err.message);
    });

    return () => {
      socket.off("collaborationUpdated");
      socket.off("requestUpdated");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [user?.id, id, role, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-white dark:bg-slate-900">
        <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-slate-700">
          <div className="h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-10"></div>
          <div className="p-2 space-y-2">
            {[...Array(8)].map((_, index) => (
              <SkeletonLoader key={index} type="chat" />
            ))}
          </div>
        </div>
        <div className="hidden md:flex flex-1 flex-col">
          <div className="h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-10"></div>
          <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50">
            <div className="text-center p-6 max-w-md">
              <div className="w-24 h-24 mx-auto mb-4 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
              <div className="h-6 w-3/4 mx-auto bg-slate-200 dark:bg-slate-700 rounded mb-3 animate-pulse"></div>
              <div className="h-4 w-1/2 mx-auto bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center p-6 max-w-md">
          <div className="bg-rose-100 dark:bg-rose-900/30 p-4 rounded-full mb-4 inline-flex">
            <FiAlertCircle className="text-rose-600 dark:text-rose-400 text-2xl" />
          </div>
          <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Connection Error</p>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={retryFetchCollaborations}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium mx-auto"
            aria-label="Retry loading chats"
          >
            <FiRefreshCw className="animate-spin" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="flex h-screen w-full bg-white dark:bg-slate-900">
      {/* Chat List - Always visible on desktop, togglable on mobile */}
      <div className={`
        ${chatId ? 'hidden md:flex' : 'flex'} 
        w-full md:w-1/3 lg:w-1/4
        border-r border-slate-200 dark:border-slate-700
        flex-col
      `}>
        <ChatList
          collaborations={collaborations}
          error={error}
          role={role}
          id={id}
          isMobileChatOpen={!!chatId}
          setIsMobileChatOpen={(open) => {
            if (!open) navigate(`/chat/${role}/${id}`);
          }}
        />
      </div>

      {/* Chat View - Takes remaining space when chat is selected */}
      <div className={`
        ${chatId ? 'flex' : 'hidden md:flex'} 
        flex-1 flex-col
      `}>
        {chatId ? (
          <Chat
            collaborations={collaborations}
            selectedChatId={chatId}
            setIsMobileChatOpen={() => navigate(`/chat/${role}/${id}`)}
            socket={socket}
            id={id}
            role={role}
          />
        ) : (
          // Desktop empty state
          <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50">
            <div className="text-center p-6 max-w-md">
              <div className="w-24 h-24 mx-auto mb-4 text-slate-300 dark:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-1">Select a conversation</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatWrapper;