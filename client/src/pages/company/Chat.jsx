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

  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io(STATIC_URL);
    setSocket(newSocket);
    newSocket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
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
          socket?.emit('joinRoom', candidateId);
        } else {
          setCandidates(res.data);
        }
      } catch (error) {
        console.error('Error fetching chat data:', error);
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
    if (!inputMessage.trim() && !fileInputRef.current?.files?.length) return;
    const messageData = {
      senderId: companyId,
      content: inputMessage.trim(),
      files: fileInputRef.current?.files?.length > 0 
        ? Array.from(fileInputRef.current.files).map(file => file.name)
        : []
    };
    try {
      await api.post(`/company/${companyId}/chat/${candidateId}/messages`, messageData);
      setInputMessage('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleEmojiClick = (emoji) => {
    setInputMessage(prev => prev + emoji.emoji);
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const fileNames = files.map(file => file.name).join(', ');
      setInputMessage(prev => prev ? `${prev} [Files: ${fileNames}]` : `[Files: ${fileNames}]`);
    }
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
              onFileUpload={handleFileUpload}
              messageEndRef={messageEndRef}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChatPage;