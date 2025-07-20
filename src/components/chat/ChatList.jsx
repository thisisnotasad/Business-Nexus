import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

function ChatList({ collaborations, error, role, id, isMobileChatOpen, setIsMobileChatOpen }) {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <div
      className={`
        w-full md:w-1/3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-r border-teal-100 dark:border-slate-700
        md:block ${isMobileChatOpen ? "hidden" : "block"} transition-all duration-300 shadow-lg
      `}
    >
      <div className="p-4 border-b border-teal-100 dark:border-slate-700 flex items-center gap-3">
        <button
          className="md:hidden text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors"
          onClick={() => navigate(`/dashboard/${role}`)}
        >
          <FaChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400 font-montserrat">Chats</h2>
      </div>
      {error && (
        <div className="p-4 text-center text-slate-500 dark:text-slate-400">
          {error}
          <Link
            to={`/dashboard/${role}`}
            className="mt-2 text-teal-600 dark:text-teal-400 hover:underline"
          >
            Go to Dashboard
          </Link>
        </div>
      )}
      <ul className="overflow-y-auto h-[calc(80vh-4rem)]">
        {collaborations.map((collab) => {
          const collaboratorId = collab.requesterId === id ? collab.recipientId : collab.requesterId;
          const collaborator = collab.requesterId === id ? collab.recipient : collab.requester;
          return (
            <Link
              to={`/chat/${role}/${id}/${collab.chatId}`}
              key={collab.id}
              className={`
                flex items-center gap-3 p-4 cursor-pointer
                hover:bg-teal-50 dark:hover:bg-slate-700/50
                transition-all duration-200
              `}
              onClick={() => setIsMobileChatOpen(true)}
            >
              <img
                src={
                  collaborator?.avatar ||
                  "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
                }
                alt={collaborator?.name}
                className="w-10 h-10 rounded-full border-2 border-teal-200 dark:border-slate-600 animate__bounceIn"
                data-tooltip-id={`collab-${collaboratorId}`}
                onError={(e) =>
                  (e.target.src =
                    "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150")
                }
              />
              <Tooltip id={`collab-${collaboratorId}`} content={collaborator?.name} place="top" />
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100 font-montserrat">{collaborator?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{collaborator?.role}</p>
              </div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export default ChatList;