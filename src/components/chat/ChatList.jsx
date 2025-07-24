import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

function ChatList({ collaborations, error, role, id, isMobileChatOpen, setIsMobileChatOpen }) {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Handle keyboard selection for accessibility
  const handleKeyDown = (e, chatId) => {
    if (e.key === "Enter" || e.key === " ") {
      setIsMobileChatOpen(true);
      navigate(`/chat/${role}/${id}/${chatId}`);
    }
  };

  return (
    <div
      className={`
        w-full h-screen md:w-1/3 lg:w-full bg-gradient-to-b from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700
        md:block ${isMobileChatOpen ? "hidden" : "block"} transition-all duration-300 shadow-xl  overflow-hidden
      `}
      role="navigation"
      aria-label="Chat list"
    >
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3 bg-white/80 dark:bg-slate-800/80">
        <button
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-slate-700"
          onClick={() => navigate(`/dashboard/${role}`)}
          aria-label="Back to dashboard"
        >
          <FaChevronLeft size={18} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-montserrat tracking-tight">
          Your Conversations
        </h2>
      </div>

      {error && (
        <div className="p-5 text-center text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50">
          <p className="mb-3">{error}</p>
          <button
            onClick={() => navigate(`/dashboard/${role}`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            aria-label="Go to dashboard"
          >
            Go to Dashboard
          </button>
        </div>
      )}

      <ul 
        className="overflow-y-auto h-[calc(80vh-4rem)] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent dark:scrollbar-thumb-slate-600"
        role="list" 
        aria-label="List of conversations"
      >
        {collaborations.map((collab) => {
          const collaboratorId = collab.requesterId === id ? collab.recipientId : collab.requesterId;
          const collaborator = collab.requesterId === id ? collab.recipient : collab.requester;
          return (
            <li key={collab.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
              <button
                onClick={() => {
                  setIsMobileChatOpen(true);
                  navigate(`/chat/${role}/${id}/${collab.chatId}`);
                }}
                onKeyDown={(e) => handleKeyDown(e, collab.chatId)}
                className={`
                  flex items-center gap-4 p-4 cursor-pointer w-full text-left
                  hover:bg-indigo-50/50 dark:hover:bg-slate-700/30
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  active:bg-indigo-100/30 dark:active:bg-slate-700/50
                `}
                role="listitem"
                aria-label={`Chat with ${collaborator?.name || "User"}`}
                tabIndex={0}
              >
                <div className="relative">
                  <img
                    src={
                      collaborator?.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
                    }
                    alt={collaborator?.name || "Collaborator avatar"}
                    className="w-12 h-12 rounded-full border-2 border-indigo-200 dark:border-indigo-800 object-cover"
                    data-tooltip-id={`collab-${collaboratorId}`}
                    onError={(e) =>
                      (e.target.src =
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150")
                    }
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                </div>
                <Tooltip 
                  id={`collab-${collaboratorId}`} 
                  content={collaborator?.name || "User"} 
                  place="top" 
                  className="z-50"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-100 font-montserrat truncate">
                    {collaborator?.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 capitalize truncate">
                    {collaborator?.role}
                  </p>
                </div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default React.memo(ChatList, (prevProps, nextProps) => {
  return (
    prevProps.collaborations === nextProps.collaborations &&
    prevProps.error === nextProps.error &&
    prevProps.role === nextProps.role &&
    prevProps.id === nextProps.id &&
    prevProps.isMobileChatOpen === nextProps.isMobileChatOpen &&
    prevProps.setIsMobileChatOpen === nextProps.setIsMobileChatOpen
  );
});