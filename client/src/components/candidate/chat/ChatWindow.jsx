import React from 'react';
import { FiSend, FiArrowLeft, FiSmile } from 'react-icons/fi';
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
    <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
      message.senderId === currentUserId 
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none' 
        : 'bg-gray-100 text-gray-800 rounded-tl-none'
    }`}>
      {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
      <p className={`text-xs mt-1 ${message.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'}`}>
        {formatTimestamp(message.timestamp)}
      </p>
    </div>
  );

  return (
    <>
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center shadow-md">
        <button 
          onClick={onBack} 
          className="mr-4 hover:bg-blue-400 p-2 rounded-full transition duration-300"
        >
          <FiArrowLeft className="text-xl" />
        </button>
        {selectedUser && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex justify-center items-center rounded-full bg-white text-blue-600 font-bold">
              {selectedUser?.name ? selectedUser.name[0].toUpperCase() : ''}
            </div>
            <div>
              <p className="font-semibold">{selectedUser.name}</p>
              <p className="text-xs opacity-90 flex items-center">
                <span className="w-2 h-2 bg-green-300 rounded-full mr-1"></span>
                Active now
              </p>
            </div>
          </div>
        )}
      </div>

      <div 
        className="flex-grow overflow-y-auto p-4 bg-[#f5f7fb]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(245, 247, 251, 0.9), rgba(245, 247, 251, 0.9))',
          backgroundAttachment: 'fixed'
        }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSend className="text-3xl text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No messages yet</h3>
            <p className="text-gray-500 max-w-md px-4">
              Send your first message to start the conversation with {selectedUser?.name}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex ${message.senderId === currentUserId ? "items-end" : "items-start"} space-x-2`}>
                  {message.senderId !== currentUserId && (
                    <div className="w-8 h-8 flex justify-center items-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm mt-1">
                      {selectedUser?.name ? selectedUser.name[0].toUpperCase() : ''}
                    </div>
                  )}
                  {renderMessageContent(message)}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200 relative">
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 z-50">
            <EmojiPicker 
              onEmojiClick={onEmojiClick} 
              width={300}
              height={350}
              searchDisabled
              skinTonesDisabled
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors duration-150"
            onClick={toggleEmojiPicker}
          >
            <FiSmile className="text-xl" />
          </button>
          
          <input
            type="text"
            value={inputMessage}
            onChange={onInputChange}
            className="flex-grow p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition duration-300"
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          />
          
          <button
            className={`p-3 rounded-full transition duration-300 flex items-center justify-center ${
              inputMessage.trim() 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            onClick={onSendMessage}
            disabled={!inputMessage.trim()}
          >
            <FiSend className="text-lg" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;