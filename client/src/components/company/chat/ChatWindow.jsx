import React, { useRef } from 'react';
import { FiSend, FiArrowLeft } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import { STATIC_URL } from "../../../utils/axios";

const ChatWindow = ({
  selectedUser,
  messages,
  inputMessage,
  showEmojiPicker,
  onBack,
  onInputChange,
  onSendMessage,
  onEmojiClick,
  toggleEmojiPicker,
  onFileUpload
}) => {
  const messageEndRef = useRef(null);

  return (
    <>
      <div className="bg-green-500 text-white p-4 flex items-center">
        <button onClick={onBack} className="mr-2">
          <FiArrowLeft className="text-xl" />
        </button>
        {selectedUser && (
          <div className="flex items-center">
            <img
              src={selectedUser?.candidateProfile?.profilePicture 
              ? `${STATIC_URL}/public/${selectedUser.candidateProfile.profilePicture}` 
              : "https://via.placeholder.com/50"}
              alt={selectedUser.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold">{selectedUser.name}</p>
              <p className="text-xs">{selectedUser.status || "Online"}</p>
            </div>
          </div>
        )}
      </div>

      <div
        className="flex-grow overflow-y-auto p-4"
        style={{
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
          wordWrap: "break-word",
        }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 h-full flex items-center justify-center">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === "company" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${message.sender === "company" ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                {message.content && <p>{message.content}</p>}
                {message.files?.length > 0 && (
                  <div className="mt-2">
                    {message.files.map((file, i) => (
                      <div key={i} className="bg-gray-100 rounded p-2 text-sm">
                        {file}
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={onInputChange}
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          />
          <button
            className="px-3 py-2 bg-gray-100 border-t border-b border-gray-300"
            onClick={toggleEmojiPicker}
          >
            😀
          </button>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={onFileUpload}
          />
          <button
            className="px-3 py-2 bg-gray-100 border-t border-b border-gray-300"
            onClick={() => document.getElementById('fileInput').click()}
          >
            📎
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-r-lg hover:bg-green-600"
            onClick={onSendMessage}
          >
            <FiSend />
          </button>
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
    </>
  );
};

export default ChatWindow;