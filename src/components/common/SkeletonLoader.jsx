import React from "react";

function SkeletonLoader({ type = "chat" }) {
  // Skeleton for chat list items
  if (type === "chat") {
    return (
      <div className="flex items-center gap-3 p-4 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        <div className="flex-1">
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
          <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Skeleton for message bubbles
  if (type === "message") {
    return (
      <div className="mb-4 flex justify-start animate-pulse">
        <div className="max-w-[70%] p-3 rounded-lg bg-slate-200 dark:bg-slate-700">
          <div className="h-4 w-32 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
          <div className="h-3 w-16 bg-slate-300 dark:bg-slate-600 rounded"></div>
        </div>
      </div>
    );
  }

  return null;
}

export default SkeletonLoader;