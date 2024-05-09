import React, { useState, useRef, useEffect, useCallback } from "react";
import EmojiPicker from "emoji-picker-react";
import moment from "moment";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
// import { BiSearch, BiPaperclip } from "react-icons/bi";
import { FiSend, FiMessageCircle } from "react-icons/fi";
import Header from "../../components/recruiter/Header";
import Footer from "../../components/recruiter/Footer";
import {
  getCandidates,
  getMessages,
  sendMessage,
} from "../../services/recruiterServices";

const ChatPage = () => {
  const { candidateId } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const messageContainerRef = useRef(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const newSocket = io(`http://localhost:3001`);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("message", handleMessage);

    newSocket.on("error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      if (newSocket) {
        newSocket.off("connect");
        newSocket.off("message", handleMessage);
        newSocket.off("error");
        newSocket.close();
      }
    };
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (candidateId) {
      fetchMessages(candidateId);
    }
  }, [candidateId]);

  const handleMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const fetchCandidates = async () => {
    try {
      const response = await getCandidates();
      setCandidates(response);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const fetchMessages = async (candidateId) => {
    try {
      const response = await getMessages(candidateId);
      setMessages(response);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleUserSelect = (candidateId) => {
    const user = candidates.find((candidate) => candidate._id === candidateId);
    setSelectedUser(user);
    fetchMessages(user._id);
    socket.emit("joinRoom", candidateId);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    const messageData = {
      sender: "recruiter",
      timestamp: moment().format("h:mm A"),
    };

    // Check if there is text input
    if (inputMessage.trim()) {
      messageData.content = inputMessage;
    }

    // Check if a file is selected
    if (fileInputRef.current.files.length > 0) {
      messageData.files = [fileInputRef.current.files[0]]; // Pass the file as an array
    }

    // Check if either text or a file is included before sending
    if (messageData.content || messageData.files) {
      try {
        socket.emit("message", messageData, selectedUser._id, (response) => {
          console.log("Message sent:", response);
        });

        setInputMessage(""); // Reset text input after sending
        fileInputRef.current.value = ""; // Reset file input after sending
        await sendMessage(selectedUser._id, messageData);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      // Handle case when neither text nor file is included
      console.error("No text or file included in the message.");
    }
  };

  const handleEmojiClick = (emoji) => {
    setInputMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Only take the first file
    setInputMessage(file.name);
    // handleSendMessage(file);
  };

  const scrollToBottom = useCallback(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, messages]);

  return (
    <>
      <Header />
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-lg flex flex-col bg-white border border-gray-300 rounded-lg overflow-hidden h-4/5">
          <Header1 />
          <UserList
            candidates={candidates}
            handleUserSelect={handleUserSelect}
          />
          <ChatSection
            selectedUser={selectedUser}
            messages={messages}
            inputMessage={inputMessage}
            handleInputChange={handleInputChange}
            handleSendMessage={handleSendMessage}
            handleFileUpload={handleFileUpload}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            fileInputRef={fileInputRef}
            messageContainerRef={messageContainerRef}
            handleEmojiClick={handleEmojiClick}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

const Header1 = () => (
  <div className="bg-green-500 text-white p-4 flex items-center justify-between">
    <h2 className="text-lg font-semibold">Messenger</h2>
    <div className="flex items-center">
      {/* <BiSearch className="mr-2" /> */}
    </div>
  </div>
);

const UserList = ({ candidates, handleUserSelect }) => (
  <div className="p-4">
    <div className="max-w-full overflow-x-auto">
      <ul className="flex">
        {candidates.map((candidate) => (
          <li
            key={candidate._id}
            className="flex items-center mr-4 p-2 rounded-md cursor-pointer"
            style={{ minWidth: "120px" }}
            onClick={() => handleUserSelect(candidate._id)}
          >
            <img
              src={"https://via.placeholder.com/50"}
              alt={candidate.name}
              className="w-10 h-10 rounded-full mr-2"
            />
            <div className="flex flex-col">
              <p className="text-sm font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                {candidate.name.length > 10
                  ? candidate.name.slice(0, 10) + "..."
                  : candidate.name}
              </p>
              <p className="text-xs text-gray-500 overflow-hidden whitespace-nowrap overflow-ellipsis">
                {candidate.status || "Online"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const ChatSection = ({
  selectedUser,
  messages,
  inputMessage,
  handleInputChange,
  handleSendMessage,
  handleFileUpload,
  showEmojiPicker,
  setShowEmojiPicker,
  fileInputRef,
  messageContainerRef,
  handleEmojiClick,
}) => (
  <div className="flex-grow flex flex-col">
    {selectedUser ? (
      <>
        <UserInfo selectedUser={selectedUser} />
        <Messages
          messages={messages}
          messageContainerRef={messageContainerRef}
        />
        <MessageInput
          inputMessage={inputMessage}
          handleInputChange={handleInputChange}
          handleSendMessage={handleSendMessage}
          handleFileUpload={handleFileUpload}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          fileInputRef={fileInputRef}
          messageContainerRef={messageContainerRef}
          handleEmojiClick={handleEmojiClick}
        />
      </>
    ) : (
      <NoUserSelected />
    )}
  </div>
);

const UserInfo = ({ selectedUser }) => (
  <div className="bg-white border-b border-gray-300 p-4 flex items-center">
    <img
      src={"https://via.placeholder.com/50"}
      alt={selectedUser.name}
      className="w-15 h-15 rounded-full mr-4"
    />
    <div>
      <p className="text-lg font-semibold">{selectedUser.name}</p>
      <p className="text-sm text-gray-500">{selectedUser.status || "Online"}</p>
    </div>
  </div>
);

const Messages = ({ messages, messageContainerRef }) => (
  <div
    className="flex-grow overflow-y-auto p-4"
    ref={messageContainerRef}
    style={{
      maxHeight: "calc(100vh - 480px)",
      overflowY: "auto",
      wordWrap: "break-word",
    }}
  >
    {messages.length === 0 ? (
      <div className="text-center text-gray-500">
        Start a conversation to see messages
      </div>
    ) : (
      messages.map((message, index) => (
        <Message key={index} message={message} />
      ))
    )}
  </div>
);

const MessageInput = ({
  inputMessage,
  handleInputChange,
  handleSendMessage,
  handleFileUpload,
  showEmojiPicker,
  setShowEmojiPicker,
  fileInputRef,
  messageContainerRef,
  handleEmojiClick,
}) => (
  <div className="p-4 bg-white flex items-center">
    <input
      type="text"
      value={inputMessage}
      onChange={handleInputChange}
      className="flex-grow mx-2 px-4 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      placeholder="Type your message..."
      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
    />
    <button
      className="mr-2 text-gray-500 hover:text-gray-700"
      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
    >
      😀
    </button>
    {/* <button className="mr-2 text-gray-500 hover:text-gray-700" onClick={() => fileInputRef.current.click()}>
      <BiPaperclip />
    </button> */}
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileUpload}
      className="hidden"
    />
    <button
      className="px-2 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      onClick={handleSendMessage}
    >
      <FiSend />
    </button>
    {showEmojiPicker && (
      <div className="absolute bottom-24 right-4">
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </div>
    )}
  </div>
);

const Message = ({ message }) => {
  const messageClass =
    message.sender === "recruiter" ? "text-white justify-end" : "justify-start";

  const containerStyle = {
    maxWidth: "calc(100% - 8px)", // Adjust for padding
    backgroundColor: message.sender === "recruiter" ? "#34D399" : "#E5E7EB",
    borderRadius: "0.5rem",
    padding: "0.5rem",
  };

  return (
    <div className={`flex ${messageClass} mb-4`}>
      <div style={containerStyle}>
        {message.content && <p>{message.content}</p>}
        {message.files && message.files.length > 0 && (
          <div>
            {message.files.map((file, index) => {
              const blob = new Blob([file]); // Create a Blob from the File object
              return (
                <div
                  key={index}
                  className="bg-gray-200 rounded-lg p-2 mb-2 flex items-center"
                >
                  <img
                    src={URL.createObjectURL(blob)}
                    alt={file?.name}
                    className="w-12 h-12 rounded-lg mr-2"
                  />
                  <span className="mr-2">{file?.name}</span>
                </div>
              );
            })}
          </div>
        )}
        <span className="text-xs">{message.timestamp}</span>
      </div>
    </div>
  );
};

const NoUserSelected = () => (
  <div className="flex-grow flex justify-center items-center">
    <div className="text-center text-gray-500 h-full w-full flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-full mb-4">
        <FiMessageCircle className="text-6xl text-gray-400" />
      </div>
      <p>Please select a user to start chatting</p>
    </div>
  </div>
);

export default ChatPage;
