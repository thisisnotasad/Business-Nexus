import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

const DEBUG = import.meta.env.VITE_DEBUG === "true";

function Chat({ collaborations, selectedChatId, setIsMobileChatOpen, socket, id, role }) {
  const { user } = useAuth();
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      if (DEBUG) console.log("Fetching messages for chatId:", selectedChatId, "userId:", id);
      const response = await api.get(`/messages/chat/${selectedChatId}`, {
        params: { userId: id },
      });
      if (DEBUG) console.log("Fetched messages:", JSON.stringify(response.data, null, 2));
      setMessages(response.data || []);
    } catch (err) {
      console.error("Error fetching messages:", err.message, err.response?.data);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (DEBUG) console.log("User object in Chat.jsx:", JSON.stringify(user, null, 2));
    if (!user?.id || String(user.id) !== id || user.role !== role || !selectedChatId || !collaborations) {
      if (DEBUG) console.log("Invalid params or collaborations, redirecting to chat list", { userId: user?.id, id, role, selectedChatId });
      navigate(`/chat/${user?.role}/${user?.id}`);
      return;
    }

    fetchMessages();

    socket.on(`chat:${selectedChatId}`, (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("message", (message) => {
      if (message.chatId === selectedChatId) {
        if (DEBUG) console.log("New message received:", JSON.stringify(message, null, 2));
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("typing", ({ chatId, userId, userName }) => {
      if (chatId === selectedChatId && userId !== id) {
        if (DEBUG) console.log("Typing:", { userId, userName });
        setTypingUsers((prev) => [...new Set([...prev, userName])]);
      }
    });

    socket.on("stopTyping", ({ chatId, userId, userName }) => {
      if (chatId === selectedChatId && userId !== id) {
        if (DEBUG) console.log("Stop typing:", { userId, userName });
        setTypingUsers((prev) => prev.filter((name) => name !== userName));
      }
    });

    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [selectedChatId, socket, id, role, navigate, user?.id, user?.role, collaborations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = {
        id: Date.now().toString(), // Generate ID client-side
        chatId: selectedChatId,
        senderId: id,
        senderName: user?.name || "Unknown User",
        text: newMessage, // Use text instead of content
        content: newMessage, // Keep content for backward compatibility
        timestamp: new Date().toISOString(),
      };
      if (DEBUG) console.log("Sending message:", JSON.stringify(message, null, 2));
      await api.post("/messages", message);
      socket.emit("message", message);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err.message, err.response?.data);
      alert("Failed to send message. Please check the server and try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg justify-center items-center">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 font-montserrat">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg">
      <ChatHeader
        collaborations={collaborations}
        selectedChatId={selectedChatId}
        id={id}
        role={role}
        setIsMobileChatOpen={setIsMobileChatOpen}
      />
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 font-montserrat">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${msg.senderId === id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[70%] p-3 rounded-lg shadow-sm
                  ${msg.senderId === id ? "bg-teal-100 text-slate-800" : "bg-indigo-700 text-slate-800"}
                  dark:${msg.senderId === id ? "bg-teal-900/50 dark:text-slate-100" : "bg-indigo-900/50 dark:text-slate-100"}
                `}
              >
                <p className="text-sm font-montserrat">{msg.content || msg.text}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
        {typingUsers.length > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic font-montserrat">
            {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
          </p>
        )}
      </div>
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        selectedChatId={selectedChatId}
        socket={socket}
      />
    </div>
  );
}

export default Chat;
