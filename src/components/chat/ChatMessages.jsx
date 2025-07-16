import React, { useEffect, useRef } from "react";

function ChatMessages({ messages, isTyping, id }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-white/10 dark:bg-slate-900/10">
      {messages.length === 0 && !isTyping && (
        <div className="text-center text-slate-500 dark:text-slate-400">
          No messages yet. Start the conversation!
        </div>
      )}
      {isTyping && <div className="text-slate-500 text-sm animate__fadeIn">Typing...</div>}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`
            mb-4 flex ${msg.senderId === id ? "justify-end" : "justify-start"}
          `}
        >
          <div
            className={`
              max-w-[70%] p-3 rounded-lg shadow-sm
              ${msg.senderId === id
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"}
            `}
          >
            <p>{msg.text}</p>
            <p className="text-xs text-slate-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;