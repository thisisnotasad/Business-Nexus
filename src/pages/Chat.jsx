import React from "react";
import Input from "../components/common/Input";

const Chat = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white/90 p-6 rounded-2xl shadow-xl w-full max-w-[90vw] sm:max-w-md mx-auto mt-10 border border-blue-100 backdrop-blur-sm">
          <h1 className="text-2xl font-semibold text-gray-700">Chat Page</h1>
          <p className="text-gray-600">
            This is the chat page where users can communicate.
          </p>
          {/* Add chat functionality here */}
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Type your message..."
              className="border p-2 w-full"
            />
            <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600 transition duration-300">
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
