import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

// Create a socket instance that connects to the backend
const socket = io('http://localhost:5000', {
  autoConnect: false,
});

// Function to connect socket with authentication
export const connectSocket = () => {
  const token = localStorage.getItem('token');
  
  if (token && !socket.connected) {
    socket.auth = { token };
    socket.connect();
  }
  
  return socket;
};

// Function to disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket; 