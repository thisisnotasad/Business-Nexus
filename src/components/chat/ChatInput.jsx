import React, { useRef, useCallback } from "react";
import { FiSend, FiSmile, FiPaperclip } from "react-icons/fi";
import { debounce } from "../../utils/debounce";

function ChatInput({ newMessage, setNewMessage, handleSendMessage, selectedChatId, socket }) {
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce the typing event to limit socket emissions
  const debouncedTyping = useCallback(
    debounce(() => {
      socket.emit("typing", { chatId: selectedChatId });
    }, 300),
    [socket, selectedChatId]
  );

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    debouncedTyping();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId: selectedChatId });
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-end gap-2 w-full">
        {/* Attachment and emoji buttons (hidden on small screens) */}
        <div className="hidden sm:flex gap-1 pb-2">
          <button
            type="button"
            className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Add attachment"
          >
            <FiPaperclip size={18} />
          </button>
          <button
            type="button"
            className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Add emoji"
          >
            <FiSmile size={18} />
          </button>
        </div>

        {/* Message input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full p-3 pl-4 pr-12 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-montserrat"
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`p-3 rounded-full shadow-sm transition-all ${
            newMessage.trim()
              ? "bg-indigo-600 text-white hover:bg-indigo-700 transform hover:scale-105"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
          }`}
          aria-label="Send message"
        >
          <FiSend size={18} />
        </button>
      </div>
    </form>
  );
}

export default React.memo(ChatInput);