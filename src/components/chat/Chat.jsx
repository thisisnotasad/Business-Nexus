import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import SkeletonLoader from "../common/SkeletonLoader";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

const DEBUG = import.meta.env.VITE_DEBUG === "true";

function Chat({ collaborations, selectedChatId, setIsMobileChatOpen, socket, id, role }) {
  const { user } = useAuth();
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setError(null);
    } catch (err) {
      console.error("Error fetching messages:", err.message, err.response?.data);
      setError("Failed to load messages. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const retryFetchMessages = () => {
    setError(null);
    fetchMessages();
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

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      try {
        const message = {
          id: Date.now().toString(),
          chatId: selectedChatId,
          senderId: id,
          senderName: user?.name || "Unknown User",
          text: newMessage,
          content: newMessage,
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
    },
    [newMessage, selectedChatId, id, user?.name, socket, api]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-900">
        <ChatHeader
          collaborations={collaborations}
          selectedChatId={selectedChatId}
          id={id}
          role={role}
          setIsMobileChatOpen={setIsMobileChatOpen}
        />
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="flex justify-start">
            <div className="w-3/4 bg-slate-100 dark:bg-slate-800 rounded-xl p-4 h-20"></div>
          </div>
          <div className="flex justify-end">
            <div className="w-3/4 bg-indigo-100 dark:bg-indigo-900 rounded-xl p-4 h-20"></div>
          </div>
          <div className="flex justify-start">
            <div className="w-1/2 bg-slate-100 dark:bg-slate-800 rounded-xl p-4 h-16"></div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-900">
        <ChatHeader
          collaborations={collaborations}
          selectedChatId={selectedChatId}
          id={id}
          role={role}
          setIsMobileChatOpen={setIsMobileChatOpen}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-rose-100 dark:bg-rose-900/30 p-4 rounded-full mb-4">
            <FiAlertCircle className="text-rose-600 dark:text-rose-400 text-2xl" />
          </div>
          <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Message Load Error</p>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={retryFetchMessages}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            aria-label="Retry loading messages"
          >
            <FiRefreshCw />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      <ChatHeader
        collaborations={collaborations}
        selectedChatId={selectedChatId}
        id={id}
        role={role}
        setIsMobileChatOpen={setIsMobileChatOpen}
      />
      
      <div className="flex-1 w-full p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent dark:scrollbar-thumb-slate-700">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
            <div className="w-24 h-24 mb-4 opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === id ? "justify-end" : "justify-start"}`}
                role="listitem"
                aria-label={`${msg.senderId === id ? "Sent" : "Received"} message at ${new Date(msg.timestamp).toLocaleTimeString()}`}
              >
                <div
                  className={`
                    max-w-[80%] p-4 rounded-xl relative
                    ${msg.senderId === id ? 
                      "bg-indigo-500 text-white rounded-br-none" : 
                      "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-bl-none"}
                    shadow-sm
                  `}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <p className={`text-xs mt-2 ${
                    msg.senderId === id ? 
                      "text-indigo-100 dark:text-indigo-200" : 
                      "text-slate-500 dark:text-slate-400"
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
        
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 mt-2 ml-2 text-slate-500 dark:text-slate-400 text-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span>{typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...</span>
          </div>
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