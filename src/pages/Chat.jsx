import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import Button from "../components/common/Button";

function Chat() {
  const { userId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      try {
        const chatId = [currentUser.id, parseInt(userId)].sort().join("-");
        const response = await api.get(`/messages?chatId=${chatId}`);
        setMessages(response.data);
        setLoading(true);
      } catch (err) {
        setError("Failed to load messages.");
        setLoading(false);
        console.error("Error fetching messages:", err);
      }
    }
    if (currentUser && userId) fetchMessages();
  }, [userId, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const chatId = [currentUser.id, parseInt(userId)].sort().join("-");
      await api.post("/messages", {
        chatId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: newMessage,
        timestamp: new Date().toISOString(),
      });
      setNewMessage("");
      const response = await api.get(`/messages?chatId=${chatId}`);
      setMessages(response.data);
    } catch (err) {
      setError("Failed to send message.");
      console.error("Error sending message:", err);
    }
  };

  if (!currentUser) return <p className="text-red-500 text-center">Please log in.</p>;
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 ${msg.senderId === currentUser.id ? "text-right" : "text-left"}`}
            >
              <p className="text-sm text-gray-500">
                {msg.senderName} - {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
              <p className="inline-block bg-gray-100 p-2 rounded">{msg.text}</p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}

export default Chat;