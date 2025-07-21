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
        w-full md:w-1/3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-r border-teal-100 dark:border-slate-700
        md:block ${isMobileChatOpen ? "hidden" : "block"} transition-all duration-300 shadow-lg
      `}
      role="navigation"
      aria-label="Chat list"
    >
      <div className="p-4 border-b border-teal-100 dark:border-slate-700 flex items-center gap-3">
        <button
          className="text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors"
          onClick={() => navigate(`/dashboard/${role}`)}
          aria-label="Back to dashboard"
        >
          <FaChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400 font-montserrat">Chats</h2>
      </div>
      {error && (
        <div className="p-4 text-center text-slate-500 dark:text-slate-400">
          {error}
          <button
            onClick={() => navigate(`/dashboard/${role}`)}
            className="mt-2 text-teal-600 dark:text-teal-400 hover:underline"
            aria-label="Go to dashboard"
          >
            Go to Dashboard
          </button>
        </div>
      )}
      <ul className="overflow-y-auto h-[calc(80vh-4rem)]" role="list" aria-label="List of conversations">
        {collaborations.map((collab) => {
          const collaboratorId = collab.requesterId === id ? collab.recipientId : collab.requesterId;
          const collaborator = collab.requesterId === id ? collab.recipient : collab.requester;
          return (
            <li key={collab.id}>
              <button
                onClick={() => {
                  setIsMobileChatOpen(true);
                  navigate(`/chat/${role}/${id}/${collab.chatId}`);
                }}
                onKeyDown={(e) => handleKeyDown(e, collab.chatId)}
                className={`
                  flex items-center gap-3 p-4 cursor-pointer w-full text-left
                  hover:bg-teal-50 dark:hover:bg-slate-700/50
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500
                `}
                role="listitem"
                aria-label={`Chat with ${collaborator?.name || "User"}`}
                tabIndex={0}
              >
                <img
                  src={
                    collaborator?.avatar ||
                    "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
                  }
                  alt={collaborator?.name || "Collaborator avatar"}
                  className="w-10 h-10 rounded-full border-2 border-teal-200 dark:border-slate-600 animate__bounceIn"
                  data-tooltip-id={`collab-${collaboratorId}`}
                  onError={(e) =>
                    (e.target.src =
                      "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150")
                  }
                />
                <Tooltip id={`collab-${collaboratorId}`} content={collaborator?.name || "User"} place="top" />
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100 font-montserrat">{collaborator?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{collaborator?.role}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Memoize ChatList to prevent re-renders unless props change
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