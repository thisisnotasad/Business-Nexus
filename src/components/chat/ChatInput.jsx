import React, { useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";

function ChatInput({ newMessage, setNewMessage, handleSendMessage, selectedChatId, socket }) {
  const typingTimeoutRef = useRef(null);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socket.emit("typing", { chatId: selectedChatId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId: selectedChatId });
    }, 2000);
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-t border-indigo-100 dark:border-slate-700"
    >
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-lg border border-indigo-200 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 transition-transform hover:scale-105"
        >
          <FaPaperPlane size={16} />
        </button>
      </div>
    </form>
  );
}

export default ChatInput;