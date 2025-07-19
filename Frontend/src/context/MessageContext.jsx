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
            const { data } = await axios.get('/api/public-hospitals');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/signin-as';
            }
        }
    };

    const fetchMessages = async (chatId) => {
        try {
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
            const { data } = await axios.post(`/api/messages/${chatId}`, {
                text: content
            });
            setMessages(prevMessages => [...prevMessages, data]);
            if (socket) {
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

    // Function to update transfer status
    const updateTransferStatus = async (transferId, status) => {
        try {
            const response = await axios.put(`/api/transfers/update/${transferId}`, { status });
            setTransferUpdates(prev => {
                const exists = prev.some(update => update.transferId === transferId);
                if (exists) {
                    return prev.map(update =>
                        update.transferId === transferId
                            ? { ...update, status, updatedAt: new Date() }
                            : update
                    );
                } else {
                    return [...prev, {
                        transferId,
                        status,
                        updatedAt: new Date()
                    }];
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating transfer status:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/signin-as';
            }
            throw error;
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on('newMessage', (newMessage) => {
                setMessages(prevMessages => {
                    if (selectedChat &&
                        ((selectedChat._id === newMessage.senderId && hospitalId === newMessage.receiverId) ||
                            (hospitalId === newMessage.senderId && selectedChat._id === newMessage.receiverId))) {
                        const messageExists = prevMessages.some(
                            msg => msg._id === newMessage._id
                        );
                        if (messageExists) {
                            return prevMessages;
                        }
                        return [...prevMessages, newMessage];
                    }
                    return prevMessages;
                });
            });
            return () => {
                socket.off('newMessage');
            };
        }
    }, [socket, selectedChat, hospitalId]);

    const contextValue = {
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
        sendMessage,
        updateTransferStatus
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
};