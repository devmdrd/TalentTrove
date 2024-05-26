import React, { useState, useRef, useEffect, useCallback } from "react";
import EmojiPicker from "emoji-picker-react";
import moment from "moment";
import { getMessages, getRecruiters, sendMessage } from "../../services/candidateServices";
import io from "socket.io-client";
// import { BiSearch } from "react-icons/bi";
import { FiMessageCircle, FiUpload, FiSend } from "react-icons/fi";
import Header from "../../components/candidate/Header";
import Footer from "../../components/candidate/Footer";

const ChatPage = () => {
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const messageContainerRef = useRef(null);
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    const newSocket = io(`https://talenttrove-9jlw.onrender.com`);
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
    fetchRecruiters();
  }, []);

  // useEffect(() => {
  //   if (candidateId) {
  //     fetchMessages(candidateId);
  //   }
  // }, [candidateId]);

  const handleMessage = (message) => {
    console.log("Message received:", message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const fetchRecruiters = async () => {
    try {
      const response = await getRecruiters();
      setRecruiters(response);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const fetchMessages = async (recruiterId) => {
    console.log(recruiterId);
    try {
      const response = await getMessages(recruiterId);
      setMessages(response);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleRecruiterSelect = (recruiterId) => {
    const recruiter = recruiters.find(
      (recruiter) => recruiter.id === recruiterId
    );
    setSelectedRecruiter(recruiter);
    fetchMessages(recruiter.id);
    socket.emit("joinRoom", recruiter.id);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      content: inputMessage,
      sender: "candidate",
      timestamp: moment().format("h:mm A"),
    };

    try {
      socket.emit("message", messageData, selectedRecruiter.id, (response) => {
        console.log("Message sent:", response);
      });

      setInputMessage("");
      await sendMessage(messageData, selectedRecruiter.id);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEmojiClick = (emoji) => {
    setInputMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  const handleFileUpload = (file) => {
    setInputMessage(file.name);
  };

  const handleImageUpload = (image) => {
    setInputMessage(image.name);
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
          <RecruiterList
            recruiters={recruiters}
            handleRecruiterSelect={handleRecruiterSelect}
          />
          <ChatSection
            selectedRecruiter={selectedRecruiter}
            messages={messages}
            inputMessage={inputMessage}
            handleInputChange={handleInputChange}
            handleSendMessage={handleSendMessage}
            handleFileUpload={handleFileUpload}
            handleImageUpload={handleImageUpload}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            fileInputRef={fileInputRef}
            imageInputRef={imageInputRef}
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

const RecruiterList = ({ recruiters, handleRecruiterSelect }) => (
  <div className="p-4">
    <div className="max-w-full overflow-x-auto">
      <ul className="flex">
        {recruiters?.map((recruiter) => (
          <li
            key={recruiter.id}
            className="flex items-center mr-4 p-2 rounded-md cursor-pointer"
            style={{ minWidth: "120px" }}
            onClick={() => handleRecruiterSelect(recruiter.id)}
          >
            <img
              src={"https://via.placeholder.com/50"}
              alt={recruiter.name}
              className="w-10 h-10 rounded-full mr-2"
            />
            <div className="flex flex-col">
              <p className="text-sm font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                {recruiter.name.length > 10
                  ? recruiter.name.slice(0, 10) + "..."
                  : recruiter.name}
              </p>
              <p className="text-xs text-gray-500 overflow-hidden whitespace-nowrap overflow-ellipsis">
                {recruiter.status || "Online"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const ChatSection = ({
  selectedRecruiter,
  messages,
  inputMessage,
  handleInputChange,
  handleSendMessage,
  handleFileUpload,
  handleImageUpload,
  showEmojiPicker,
  setShowEmojiPicker,
  fileInputRef,
  imageInputRef,
  messageContainerRef,
  handleEmojiClick,
}) => (
  <div className="flex-grow flex flex-col">
    {selectedRecruiter ? (
      <>
        <UserInfo selectedRecruiter={selectedRecruiter} />
        <Messages
          messages={messages}
          messageContainerRef={messageContainerRef}
        />
        <MessageInput
          inputMessage={inputMessage}
          handleInputChange={handleInputChange}
          handleSendMessage={handleSendMessage}
          handleFileUpload={handleFileUpload}
          handleImageUpload={handleImageUpload}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          fileInputRef={fileInputRef}
          imageInputRef={imageInputRef}
          handleEmojiClick={handleEmojiClick}
        />
      </>
    ) : (
      <NoUserSelected />
    )}
  </div>
);

const UserInfo = ({ selectedRecruiter }) => (
  <div className="bg-white border-b border-gray-300 p-4 flex items-center">
    <img
      src={"https://via.placeholder.com/50"}
      alt={selectedRecruiter.name}
      className="w-15 h-15 rounded-full mr-4"
    />
    <div>
      <p className="text-lg font-semibold">{selectedRecruiter.name}</p>
      <p className="text-sm text-gray-500">
        {selectedRecruiter.status || "Online"}
      </p>
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
  handleImageUpload,
  showEmojiPicker,
  setShowEmojiPicker,
  fileInputRef,
  imageInputRef,
  handleEmojiClick,
}) => (
  <div className="p-4 bg-white flex items-center">
    <button
      className="mr-2 text-gray-500 hover:text-gray-700"
      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
    >
      😀
    </button>
    <input
      type="file"
      ref={fileInputRef}
      onChange={(e) => handleFileUpload(e.target.files[0])}
      className="hidden"
    />
    {/* <button className="mr-2 text-gray-500 hover:text-gray-700" onClick={() => fileInputRef.current.click()}>
      📁
    </button> */}
    <input
      type="file"
      accept="image/*"
      ref={imageInputRef}
      onChange={(e) => handleImageUpload(e.target.files[0])}
      className="hidden"
    />
    {/* <button className="mr-2 text-gray-500 hover:text-gray-700" onClick={() => imageInputRef.current.click()}>
      🖼️
    </button> */}
    <input
      type="text"
      value={inputMessage}
      onChange={handleInputChange}
      className="flex-grow mx-2 px-4 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      placeholder="Type your message..."
      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
    />
    <button
      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      onClick={handleSendMessage}
    >
      Send
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
    message.sender === "candidate" ? "text-white justify-end" : "justify-start";

  const containerStyle = {
    maxWidth: "calc(100% - 8px)", // Adjust for padding
    backgroundColor: message.sender === "candidate" ? "#34D399" : "#E5E7EB",
    borderRadius: "0.5rem",
    padding: "0.5rem",
  };

  return (
    <div className={`flex ${messageClass} mb-4`}>
      <div style={containerStyle}>
        {message.content && <p>{message.content}</p>}
        {message.files && message.files.length > 0 && (
          <div>
            {message.files.map((file, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-lg p-2 mb-2 flex items-center"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-12 h-12 rounded-lg mr-2"
                />
                <span className="mr-2">{file.name}</span>
              </div>
            ))}
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
