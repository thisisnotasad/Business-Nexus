import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

function Chat() {
  const { id, role } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkChatAccess() {
      if (!user || !id) {
        setError("Please log in to access chat.");
        setLoading(false);
        return;
      }
      try {
        const isInvestor = user.role === "investor";
        const entrepreneurId = isInvestor ? id : user.id;
        const investorId = isInvestor ? user.id : id;
        console.log("Checking chat access:", { entrepreneurId, investorId });
        const requests = await api.get(`/requests?entrepreneurId=${entrepreneurId}&investorId=${investorId}&status=Accepted`);
        if (requests.data.length === 0) {
          setError("Chat available only after accepted collaboration request.");
          setLoading(false);
          return;
        }
        const chatId = [user.id, id].sort().join("-");
        console.log("Fetching messages for chatId:", chatId);
        const response = await api.get(`/messages?chatId=${chatId}`);
        setMessages(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chat data:", err);
        setError("Failed to load messages or check requests.");
        setLoading(false);
      }
    }
    checkChatAccess();
  }, [id, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const chatId = [user.id, id].sort().join("-");
      console.log("Sending message:", { chatId, text: newMessage });
      await api.post("/messages", {
        id: Date.now().toString(), // Temporary ID
        chatId,
        senderId: user.id,
        senderName: user.name,
        text: newMessage,
        timestamp: new Date().toISOString()
      });
      const response = await api.get(`/messages?chatId=${chatId}`);
      setMessages(response.data);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err.response?.data || err.message);
      setError("Failed to send message.");
    }
  };

  if (!user) return <p className="text-red-500 text-center">Please log in.</p>;
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Chat</h2>
        <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-100 rounded">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded ${msg.senderId === user.id ? "bg-green-200 ml-auto" : "bg-blue-200 mr-auto"} max-w-xs`}
            >
              <p className="font-semibold">{msg.senderName}</p>
              <p>{msg.text}</p>
              <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white transition-transform hover:scale-105"
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Chat;