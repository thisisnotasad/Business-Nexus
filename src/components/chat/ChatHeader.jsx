import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

function ChatHeader({ collaborations, selectedChatId, id, setIsMobileChatOpen }) {
  const selectedCollab = collaborations.find((collab) => collab.chatId === selectedChatId);
  const collaborator = selectedCollab
    ? selectedCollab.requesterId === id
      ? selectedCollab.recipient
      : selectedCollab.requester
    : null;

  return (
    <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-indigo-100 dark:border-slate-700 flex items-center gap-3">
      <button
        className="md:hidden text-indigo-600 dark:text-indigo-400"
        onClick={() => setIsMobileChatOpen(false)}
      >
        <FaChevronLeft size={20} />
      </button>
      <img
        src={
          collaborator?.avatar ||
          "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
        }
        alt="Collaborator"
        className="w-8 h-8 rounded-full border-2 border-indigo-200 dark:border-slate-600 animate__bounceIn"
        data-tooltip-id={`collab-header-${selectedChatId}`}
        onError={(e) =>
          (e.target.src =
            "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150")
        }
      />
      <Tooltip id={`collab-header-${selectedChatId}`} content={collaborator?.name || "User"} place="top" />
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{collaborator?.name || "User"}</h2>
    </div>
  );
}

export default ChatHeader;