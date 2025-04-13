import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/api';
import { useSocket } from './SocketContext';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { socket, sendMessage } = useSocket();

  // Fetch messages for active chat
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
    }
  }, [activeChat]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      // Only add message if it's from the active chat
      if (activeChat && (data.senderId === activeChat || data.receiverId === activeChat)) {
        setMessages(prev => [...prev, data]);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, activeChat]);

  // Fetch messages from API
  const fetchMessages = async (receiverId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/messages/${receiverId}`);
      setMessages(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch messages');
      setLoading(false);
      console.error('Error fetching messages:', err);
    }
  };

  // Send a new message
  const sendNewMessage = async (text) => {
    if (!activeChat) return;

    const hospitalId = localStorage.getItem('hospitalId');
    const messageData = {
      text,
      senderId: hospitalId,
      receiverId: activeChat,
      createdAt: new Date().toISOString()
    };

    try {
      // Add to local state immediately
      setMessages(prev => [...prev, messageData]);

      // Send through socket
      sendMessage(messageData);

      // Save to database
      await axios.post(`/api/messages/${activeChat}`, { text });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const setActiveChatId = (hospitalId) => {
    setActiveChat(hospitalId);
  };

  return (
    <MessageContext.Provider value={{ 
      messages, 
      loading, 
      error, 
      activeChat, 
      setActiveChatId,
      sendNewMessage
    }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext); 