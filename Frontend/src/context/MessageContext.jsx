import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from './SocketContext';

const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const { socket } = useSocket();

    // Get token from localStorage since we use that for authentication
    const token = localStorage.getItem('token');
    const hospitalId = localStorage.getItem('hospitalId');

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.defaults.baseURL = 'http://localhost:5000';
        }
    }, [token]);

    const fetchChats = async () => {
        try {
            // Since there's no /users endpoint in the messageRoutes, 
            // we're using the public-hospitals endpoint which does exist
            const { data } = await axios.get('/api/public-hospitals');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            if (error.response?.status === 401) {
                // Handle unauthorized error
                localStorage.removeItem('token');
                window.location.href = '/signin-as';
            }
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            // This matches the backend GET /:id route in messageRoutes
            const { data } = await axios.get(`/api/messages/${chatId}`);
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/signin-as';
            }
        }
    };

    const sendMessage = async (content, chatId) => {
        try {
            // Updated to match the backend POST /:id route in messageRoutes
            const { data } = await axios.post(`/api/messages/${chatId}`, {
                text: content
            });
            
            setMessages(prevMessages => [...prevMessages, data]);
            
            if (socket) {
                // Use the correct event name as defined in the backend socket.js
                socket.emit('sendMessage', data);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/signin-as';
            }
        }
    };

    useEffect(() => {
        if (socket) {
            // Listen for the correct event name as emitted from the backend
            socket.on('newMessage', (newMessage) => {
                console.log('New message received in ChatContext:', newMessage);
                // Only update messages if we're in the correct chat
                setMessages(prevMessages => {
                    // Check if this message belongs to the current chat
                    if (selectedChat && 
                        ((selectedChat._id === newMessage.senderId && hospitalId === newMessage.receiverId) || 
                         (hospitalId === newMessage.senderId && selectedChat._id === newMessage.receiverId))) {
                        // Check if message already exists to prevent duplicates
                        const messageExists = prevMessages.some(
                            msg => msg._id === newMessage._id
                        );
                        
                        if (messageExists) {
                            console.log('Message already exists, not adding duplicate');
                            return prevMessages;
                        }
                        
                        console.log('Adding new message to conversation');
                        return [...prevMessages, newMessage];
                    }
                    return prevMessages;
                });
            });

            // Cleanup
            return () => {
                socket.off('newMessage');
            };
        }
    }, [socket, selectedChat, hospitalId]);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                chats,
                setChats,
                messages,
                setMessages,
                users,
                setUsers,
                fetchChats,
                fetchMessages,
                sendMessage
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}; 