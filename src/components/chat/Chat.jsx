import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../utils/api";
import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

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

 const socket = io(import.meta.env.REACT_APP_API_URL  || import.meta.env.VITE_API_URL || 'http://localhost:3000', {
  query: { userId: id },
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5, // Increase to 5
  reconnectionDelay: 1000, // Delay between reconnection attempts (ms)
  timeout: 30000, // Increase timeout to 30 seconds
}).on("connect_error", (err) => {
    console.log("Socket.IO URL:", import.meta.env.REACT_APP_API_URL ||  import.meta.env.VITE_API_URL || 'http://localhost:3000' );
  console.error("Socket.IO connection error:", err.message);
  setError("Failed to connect to the chat server. Please check the server and try again.");
})
.on("connect", () => {
    console.log("Socket.IO connected successfully");
  })
  .on("connect_error", (err) => {
    console.error("Socket.IO connection error:", err.message);
    setError("Failed to connect to the chat server. Please check the server and try again.");
  })
  .on("reconnect_attempt", (attempt) => {
    console.log("Reconnection attempt:", attempt);
  });



  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const response = await api.get("/collaborations", {
          params: { userId: id },
        });
        console.log("Collaborations:", response.data);
        setCollaborations(response.data);
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
    if (id === user?.id && role === user?.role) fetchCollaborations();

    return () => socket.disconnect();
  }, [id, role, user]);

  useEffect(() => {
    if (!selectedChatId) return;

    socket.on(`chat:${selectedChatId}`, (msg) => {
      console.log("Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    socket.on(`typing:${selectedChatId}`, () => setIsTyping(true));
    socket.on(`stopTyping:${selectedChatId}`, () => setIsTyping(false));

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/chat/${selectedChatId}`, {
          params: { userId: id },
        });
        console.log("Messages:", response.data);
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const collaboration = collaborations.find((c) => c.chatId === selectedChatId);
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

  if (id !== user?.id || role !== user?.role) {
    return <div className="text-red-500 text-center p-8 animate__fadeIn">Unauthorized Access</div>;
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