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
      className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-t border-teal-100 dark:border-slate-700 sticky bottom-0"
    >
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-full border border-teal-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-montserrat"
        />
        <button
          type="submit"
          className="bg-teal-600 text-white p-3 rounded-full shadow-md hover:bg-teal-700 transition-transform hover:scale-105"
        >
          <FaPaperPlane size={16} />
        </button>
      </div>
    </form>
  );
}

export default ChatInput;