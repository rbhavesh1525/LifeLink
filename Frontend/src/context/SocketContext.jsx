import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Get token for authentication
    const token = localStorage.getItem('token');
    if (!token) return;

    // Create socket connection with auth token
    const newSocket = io('http://localhost:5000', {
      auth: {
        token
      }
    });
    
    // Set up event listeners
    newSocket.on('connect', () => {
      console.log('Socket connected with ID:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('getOnlineUsers', (users) => {
      console.log('Online users updated:', users);
      setOnlineUsers(users);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Store socket in state
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      console.log('Disconnecting socket...');
      newSocket.disconnect();
    };
  }, []);

  // Send message directly to a recipient
  const sendMessage = (messageData) => {
    if (socket) {
      console.log('Sending message via socket:', messageData);
      socket.emit('sendMessage', messageData);
    } else {
      console.error('Cannot send message: Socket not connected');
    }
  };

  // Send transfer notification
  const sendTransferNotification = (transferData) => {
    if (socket) {
      console.log('Sending transfer notification:', transferData);
      socket.emit('transferInitiated', transferData);
    } else {
      console.error('Cannot send transfer notification: Socket not connected');
    }
  };

  return (
    <SocketContext.Provider 
      value={{ 
        socket, 
        isConnected, 
        onlineUsers, 
        sendMessage,
        sendTransferNotification
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext); 