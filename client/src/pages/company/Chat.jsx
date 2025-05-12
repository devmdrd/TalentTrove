import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api, { STATIC_URL } from '../../utils/axios';
import Header from '../../components/company/Header';
import Footer from '../../components/company/Footer';
import ChatList from '../../components/company/chat/ChatList';
import ChatWindow from '../../components/company/chat/ChatWindow';

const ChatPage = () => {
  const { companyId, candidateId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
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
      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            m.content === message.content &&
            m.timestamp === message.timestamp &&
            m.senderId === message.senderId
        );
        return exists ? prev : [...prev, message];
      });
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/company/${companyId}/chat${candidateId ? `?candidateId=${candidateId}` : ''}`);
        if (candidateId) {
          setSelectedUser(res.data.candidateId);
          setMessages(res.data.messages || []);
          const roomId = `chat_${candidateId}_${companyId}`;
          socket?.emit('joinRoom', roomId);
        } else {
          setCandidates(res.data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyId, candidateId, socket]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectCandidate = (id) => {
    navigate(`/company/${companyId}/chat/${id}`);
  };

  const handleBackToList = () => {
    navigate(`/company/${companyId}/chat`);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      senderId: companyId,
      recipientId: candidateId,
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      await api.post(`/company/${companyId}/chat/${candidateId}/messages`, messageData);
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
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-lg flex flex-col bg-white border border-gray-300 rounded-lg overflow-hidden h-4/5">
          {!candidateId ? (
            <>
              <div className="bg-green-500 text-white p-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Chats</h2>
              </div>
              <ChatList
                candidates={candidates}
                loading={loading}
                onSelectCandidate={handleSelectCandidate}
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
              currentUserId={companyId}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChatPage;
