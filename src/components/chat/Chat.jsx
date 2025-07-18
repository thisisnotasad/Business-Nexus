import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../utils/api";
import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

// Toggle debug logging
const DEBUG = import.meta.env.VITE_DEBUG === "true";

// Singleton Socket.IO instance
let socket = null;

function Chat() {
  const { user } = useAuth();
  const { role, id } = useParams();
  const [collaborations, setCollaborations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const socketInitialized = useRef(false);
  const hasFetchedCollaborations = useRef(false);

  // Compute Socket.IO URL
  const socketUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_LOCAL_API_URL || "http://localhost:3000").trim();

  // Initialize Socket.IO
  useEffect(() => {
    if (socketInitialized.current) return;

    if (DEBUG) localStorage.debug = "socket.io-client:*";

    socket = io(socketUrl, {
      query: { userId: id },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 60000,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected successfully to:", socketUrl);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message, "URL:", socketUrl);
      setError("Failed to connect to the chat server. Please try again.");
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket.IO disconnected:", reason);
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    socket.on("message_error", ({ error }) => {
      console.error("Server message error:", error);
      setError(error);
    });

    if (DEBUG) {
      socket.on("reconnect_attempt", (attempt) => {
        console.log("Reconnection attempt:", attempt);
      });
    }

    socketInitialized.current = true;

    // Cleanup only on page unload
    return () => {
      window.addEventListener("beforeunload", () => {
        socket.disconnect();
        if (DEBUG) console.log("Socket.IO disconnected");
      });
    };
  }, [socketUrl, id]);

  // Fetch collaborations
  useEffect(() => {
    if (id !== user?.id || role !== user?.role) return;
    if (hasFetchedCollaborations.current) return;

    const fetchCollaborations = async () => {
      try {
        const response = await api.get("/collaborations", {
          params: { userId: id },
        });
        if (DEBUG) console.log("Fetched collaborations:", JSON.stringify(response.data, null, 2));
        setCollaborations(response.data);
        hasFetchedCollaborations.current = true;
        if (response.data.length > 0) {
          setSelectedChatId(response.data[0].chatId);
          setIsMobileChatOpen(true);
        } else {
          setError("No chats yet. Start a collaboration from the dashboard!");
        }
      } catch (err) {
        console.error("Error fetching collaborations:", err);
        setError("Failed to load chats. Please try again.");
      }
    };

    fetchCollaborations();
  }, [id, role, user]);

  // Handle real-time messages and typing
  useEffect(() => {
    if (!selectedChatId || !socket) return;

    socket.on(`chat:${selectedChatId}`, (msg) => {
      if (DEBUG) console.log("Received message:", JSON.stringify(msg, null, 2));
      setMessages((prev) => [...prev, msg]);
    });

    socket.on(`typing:${selectedChatId}`, () => {
      if (DEBUG) console.log("Typing detected in chat:", selectedChatId);
      setIsTyping(true);
    });

    socket.on(`stopTyping:${selectedChatId}`, () => {
      if (DEBUG) console.log("Stopped typing in chat:", selectedChatId);
      setIsTyping(false);
    });

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/chat/${selectedChatId}`, {
          params: { userId: id },
        });
        if (DEBUG) console.log("Fetched messages:", JSON.stringify(response.data, null, 2));
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again.");
      }
    };

    fetchMessages();

    return () => {
      socket.off(`chat:${selectedChatId}`);
      socket.off(`typing:${selectedChatId}`);
      socket.off(`stopTyping:${selectedChatId}`);
    };
  }, [selectedChatId, id]);

  // Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatId || !socket) return;

    try {
      const collaboration = collaborations.find((c) => c.chatId === selectedChatId);
      if (!collaboration) {
        setError("No collaboration selected. Please select a chat.");
        return;
      }

      const recipientId = collaboration.requesterId === id ? collaboration.recipientId : collaboration.requesterId;
      const message = {
        id: Date.now().toString(),
        chatId: selectedChatId,
        senderId: id,
        senderName: user.name,
        text: newMessage,
        timestamp: new Date().toISOString(),
      };

      await api.post("/messages", message);
      socket.emit("message", message);
      setNewMessage("");
      socket.emit("stopTyping", { chatId: selectedChatId });
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  // Handle typing events
  const handleTyping = () => {
    if (selectedChatId && socket) {
      socket.emit("typing", { chatId: selectedChatId });
    }
  };

  // Handle stop typing events
  const handleStopTyping = () => {
    if (selectedChatId && socket) {
      socket.emit("stopTyping", { chatId: selectedChatId });
    }
  };

  // Check for unauthorized access
  if (id !== user?.id || role !== user?.role) {
    return (
      <div className="text-red-500 text-center p-8 animate__fadeIn">
        Unauthorized Access
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] bg-gradient-to-br from-indigo-50 to-teal-50 rounded-xl shadow-xl animate__fadeIn">
      <ChatList
        collaborations={collaborations}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        setIsMobileChatOpen={setIsMobileChatOpen}
        isMobileChatOpen={isMobileChatOpen}
        error={error}
        role={role}
        id={id}
      />
      <div className={`flex-1 flex flex-col ${isMobileChatOpen ? "block" : "hidden md:block"}`}>
        {selectedChatId ? (
          <>
            <ChatHeader
              collaborations={collaborations}
              selectedChatId={selectedChatId}
              id={id}
              setIsMobileChatOpen={setIsMobileChatOpen}
            />
            <ChatMessages messages={messages} isTyping={isTyping} id={id} />
            <ChatInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              selectedChatId={selectedChatId}
              socket={socket}
              handleTyping={handleTyping}
              handleStopTyping={handleStopTyping}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
            Select a collaborator to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;