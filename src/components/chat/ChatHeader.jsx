import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaEllipsisV } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const DEBUG = import.meta.env.VITE_DEBUG === "true";

function ChatHeader({ collaborations, selectedChatId, id, role, setIsMobileChatOpen }) {
  const navigate = useNavigate();

  if (!collaborations || !selectedChatId) {
    if (DEBUG) console.log("ChatHeader: Missing collaborations or selectedChatId", { collaborations, selectedChatId });
    return (
      <div className="p-4 bg-gradient-to-r from-white/95 to-indigo-50/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-slate-700"
            onClick={() => {
              if (DEBUG) console.log("Back button clicked, navigating to chat list");
              setIsMobileChatOpen(false);
              navigate(`/chat/${role}/${id}`);
            }}
            aria-label="Back to chat list"
          >
            <FaChevronLeft size={18} />
          </button>
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
      </div>
    );
  }

  const selectedCollab = collaborations.find((collab) => collab.chatId === selectedChatId);
  const collaborator = selectedCollab
    ? selectedCollab.requesterId === id
      ? selectedCollab.recipient
      : selectedCollab.requester
    : null;

  return (
    <div className="p-4 bg-gradient-to-r from-white/95 to-indigo-50/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-slate-700"
          onClick={() => {
            if (DEBUG) console.log("Back button clicked, navigating to chat list");
            setIsMobileChatOpen(false);
            navigate(`/chat/${role}/${id}`);
          }}
          aria-label="Back to chat list"
        >
          <FaChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={
                collaborator?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
              }
              alt={collaborator?.name || "Collaborator avatar"}
              className="w-10 h-10 rounded-full border-2 border-indigo-200 dark:border-indigo-800 object-cover"
              data-tooltip-id={`collab-header-${selectedChatId}`}
              onError={(e) =>
                (e.target.src =
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150")
              }
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></span>
          </div>
          <Tooltip id={`collab-header-${selectedChatId}`} content={collaborator?.name || "User"} place="top" className="z-50" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 font-montserrat">
            {collaborator?.name || "User"}
          </h2>
        </div>
      </div>
      
      <button
        className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
        aria-label="More options"
      >
        <FaEllipsisV size={16} />
      </button>
    </div>
  );
}

export default ChatHeader;