import React, { useEffect, useRef } from "react";

function ChatMessages({ messages, isTyping, id }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div 
      className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent dark:scrollbar-thumb-slate-600"
      role="log" 
      aria-live="polite"
      style={{ background: "radial-gradient(circle at top left, rgba(224, 231, 255, 0.1) 0%, transparent 50%)" }}
    >
      {messages.length === 0 && !isTyping && (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
          <div className="w-24 h-24 mb-4 opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      )}

      {isTyping && (
        <div className="flex items-center gap-2 mb-6 ml-2 text-slate-500 dark:text-slate-400 text-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span>Typing...</span>
        </div>
      )}

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
                max-w-[80%] p-3 rounded-2xl relative
                ${msg.senderId === id ? 
                  "bg-indigo-500 text-white rounded-br-none" : 
                  "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-bl-none"}
                transition-all duration-200
                shadow-sm hover:shadow-md
              `}
            >
              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
              <p 
                className={`text-xs mt-1 text-right ${
                  msg.senderId === id ? 
                    "text-indigo-100 dark:text-indigo-200" : 
                    "text-slate-500 dark:text-slate-400"
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              
              {/* Message status indicator (only for sent messages) */}
              {msg.senderId === id && (
                <span className="absolute -bottom-3 -right-1 text-xs text-slate-400 dark:text-slate-500">
                  ✓✓
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
}

export default React.memo(ChatMessages, (prevProps, nextProps) => {
  return (
    prevProps.messages === nextProps.messages &&
    prevProps.isTyping === nextProps.isTyping &&
    prevProps.id === nextProps.id
  );
});