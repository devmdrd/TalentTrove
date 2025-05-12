import React from 'react';
import { FiSend, FiArrowLeft } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

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
  messageEndRef,
  currentUserId
}) => {
  const renderMessageContent = (message) => (
    <div className={`max-w-xs p-3 rounded-lg ${message.senderId === currentUserId ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
      {message.content && <p>{message.content}</p>}
      <p className="text-xs opacity-70 mt-1">{formatTimestamp(message.timestamp)}</p>
    </div>
  );

  return (
    <>
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4 hover:bg-green-600 p-2 rounded-full transition duration-300">
          <FiArrowLeft className="text-2xl" />
        </button>
        {selectedUser && (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex justify-center items-center rounded-full bg-white text-green-600 font-bold" style={{ fontSize: '20px' }}>
              {selectedUser?.name ? selectedUser.name[0].toUpperCase() : ''}
            </div>
            <div>
              <p className="font-semibold text-lg">{selectedUser.name}</p>
              <p className="text-xs opacity-75">Active</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-4 bg-gray-50" style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto", wordWrap: "break-word" }}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSend className="text-4xl text-gray-400" />
              </div>
              No messages yet. Start the conversation!
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"} mb-4`}>
              {renderMessageContent(message)}
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200 shadow-inner">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full" onClick={toggleEmojiPicker}>
            😀
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={onInputChange}
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          />
          <button
            className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
            onClick={onSendMessage}
          >
            <FiSend />
          </button>
        </div>

        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4 z-50">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
    </>
  );
};

export default ChatWindow;
