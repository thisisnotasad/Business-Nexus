import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const DEBUG = import.meta.env.VITE_DEBUG === "true";

function ChatHeader({ collaborations, selectedChatId, id, role, setIsMobileChatOpen }) {
  const navigate = useNavigate();

  if (!collaborations || !selectedChatId) {
    if (DEBUG) console.log("ChatHeader: Missing collaborations or selectedChatId", { collaborations, selectedChatId });
    return (
      <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-teal-100 dark:border-slate-700 flex items-center gap-3 sticky top-0 z-10">
        <button
          className="text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors" // Removed md:hidden
          onClick={() => {
            if (DEBUG) console.log("Back button clicked, navigating to chat list");
            setIsMobileChatOpen(false);
            navigate(`/chat/${role}/${id}`);
          }}
          aria-label="Back to chat list"
        >
          <FaChevronLeft size={20} />
        </button>
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 font-montserrat">Loading...</p>
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
    <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-teal-100 dark:border-slate-700 flex items-center gap-3 sticky top-0 z-10">
      <button
        className="text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors" // Removed md:hidden
        onClick={() => {
          if (DEBUG) console.log("Back button clicked, navigating to chat list");
          setIsMobileChatOpen(false);
          navigate(`/chat/${role}/${id}`);
        }}
        aria-label="Back to chat list"
      >
        <FaChevronLeft size={20} />
      </button>
      <img
        src={
          collaborator?.avatar ||
          "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
        }
        alt={collaborator?.name || "Collaborator avatar"}
        className="w-10 h-10 rounded-full border-2 border-teal-200 dark:border-slate-600 animate__bounceIn"
        data-tooltip-id={`collab-header-${selectedChatId}`}
        onError={(e) =>
          (e.target.src =
            "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150")
        }
      />
      <Tooltip id={`collab-header-${selectedChatId}`} content={collaborator?.name || "User"} place="top" />
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 font-montserrat">
        {collaborator?.name || "User"}
      </h2>
    </div>
  );
}

export default ChatHeader;