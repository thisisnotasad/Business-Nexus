import React, { useEffect, useRef } from "react";

function ChatMessages({ messages, isTyping, id }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-white/10 dark:bg-slate-900/10" role="log" aria-live="polite">
      {messages.length === 0 && !isTyping && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          No messages yet. Start the conversation!
        </div>
      )}
      {isTyping && <div className="text-gray-600 dark:text-gray-400 text-sm animate__fadeIn">Typing...</div>}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`mb-4 flex ${msg.senderId === id ? "justify-end" : "justify-start"} animate__animated animate__fadeIn`}
          role="listitem"
          aria-label={`${msg.senderId === id ? "Sent" : "Received"} message at ${new Date(msg.timestamp).toLocaleTimeString()}`}
        >
          <div
            className={`
              max-w-[70%] p-3 rounded-lg shadow-md relative
              ${msg.senderId === id ? "bg-teal-300 text-gray-900 message-bubble-sent" : "bg-gray-300 text-gray-900 message-bubble-received"}
              dark:${msg.senderId === id ? "bg-teal-700 text-white message-bubble-sent" : "bg-slate-600 text-white message-bubble-received"}
            `}
          >
            <p>{msg.text}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

// Memoize ChatMessages to prevent re-renders unless props change
export default React.memo(ChatMessages, (prevProps, nextProps) => {
  return (
    prevProps.messages === nextProps.messages &&
    prevProps.isTyping === nextProps.isTyping &&
    prevProps.id === nextProps.id
  );
});