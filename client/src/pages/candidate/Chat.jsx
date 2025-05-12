import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api, { STATIC_URL } from '../../utils/axios';
import Header from '../../components/candidate/Header';
import Footer from '../../components/candidate/Footer';
import ChatList from '../../components/candidate/chat/ChatList';
import ChatWindow from '../../components/candidate/chat/ChatWindow';

const ChatPage = () => {
  const { candidateId, companyId } = useParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const messageEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io(STATIC_URL);
    setSocket(newSocket);

    newSocket.on("receiveMessage", (message) => {
      if (message.senderId !== candidateId) {
        setMessages((prev) => {
          const exists = prev.some(
            (m) =>
              m.content === message.content &&
              m.timestamp === message.timestamp &&
              m.senderId === message.senderId
          );
          return exists ? prev : [...prev, message];
        });
      }
    });

    return () => newSocket.disconnect();
  }, [candidateId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/${candidateId}/chat`);
        setCompanies(res.data);
        if (companyId) {
          setSelectedUser(res.data.find(company => company._id === companyId));
          const chatRes = await api.get(`/${candidateId}/chat/${companyId}/messages`);
          setMessages(chatRes.data || []);
          const roomId = `chat_${candidateId}_${companyId}`;
          socket?.emit('joinRoom', roomId);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [candidateId, companyId, socket]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectCompany = (companyId) => {
    navigate(`/${candidateId}/chat/${companyId}`);
  };

  const handleBackToList = () => {
    navigate(`/${candidateId}/chat`);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      senderId: candidateId,
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      await api.post(`/${candidateId}/chat/${companyId}/messages`, messageData);
      const roomId = `chat_${candidateId}_${companyId}`;
      socket?.emit("sendMessage", { roomId, message: messageData });
      setMessages((prev) => [...prev, messageData]);
      setInputMessage('');
    } catch (error) {}
  };

  const handleEmojiClick = (emoji) => {
    setInputMessage((prev) => prev + emoji.emoji);
  };

  return (
    <>
      <Header />
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <div className="w-full max-w-4xl flex flex-col bg-white rounded-xl shadow-lg overflow-hidden h-[85vh]">
          {!companyId ? (
            <>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between shadow-md">
                <h2 className="text-xl font-semibold">Messages</h2>
              </div>
              <ChatList
                companies={companies}
                loading={loading}
                onSelectCompany={handleSelectCompany}
              />
            </>
          ) : (
            <ChatWindow
              selectedUser={selectedUser}
              messages={messages}
              inputMessage={inputMessage}
              showEmojiPicker={showEmojiPicker}
              loading={loading}
              onBack={handleBackToList}
              onInputChange={(e) => setInputMessage(e.target.value)}
              onSendMessage={handleSendMessage}
              onEmojiClick={handleEmojiClick}
              toggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
              messageEndRef={messageEndRef}
              currentUserId={candidateId}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChatPage;