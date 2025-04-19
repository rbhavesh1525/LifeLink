import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
    // Initialize with empty notifications array
    const [notifications, setNotifications] = useState([]);
    const [transferUpdates, setTransferUpdates] = useState([]);
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
    
    const sendTransferNotification = async (transferData) => {
        try {
            // Call transfer API endpoint
            const response = await axios.post(`/api/transfers/start/${transferData.destinationHospitalId}`, transferData);
            console.log('Transfer request initiated:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error sending transfer notification:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/signin-as';
            }
            throw error;
        }
    };
    
    // Function to update transfer status
    const updateTransferStatus = async (transferId, status) => {
        try {
            const response = await axios.put(`/api/transfers/update/${transferId}`, { status });
            console.log('Transfer status updated:', response.data);
            
            // Update local state to reflect the change immediately
            setTransferUpdates(prev => {
                // Check if we already have this transfer update
                const exists = prev.some(update => update.transferId === transferId);
                
                if (exists) {
                    // Update existing status
                    return prev.map(update => 
                        update.transferId === transferId 
                            ? { ...update, status, updatedAt: new Date() } 
                            : update
                    );
                } else {
                    // Add new status update
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
    
    // Function to mark notification as read - using useCallback to prevent recreation
    const markNotificationAsRead = useCallback((notificationId) => {
        console.log(`Marking notification as read: ${notificationId}`);
        
        setNotifications(prevNotifications => {
            const updatedNotifications = prevNotifications.map(notification => {
                if (notification.id === notificationId) {
                    console.log(`Found notification ${notificationId}, marking as read`);
                    return { ...notification, read: true };
                }
                return notification;
            });
            
            console.log('Updated notifications:', updatedNotifications);
            return updatedNotifications;
        });
    }, []);

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
            
            // Listen for transfer notifications
            socket.on('newTransfer', (transferData) => {
                console.log('New transfer notification received:', transferData);
                
                // Add to notifications state
                setNotifications(prev => [
                    ...prev, 
                    { 
                        id: transferData._id || Date.now(), 
                        type: 'transfer',
                        data: transferData,
                        read: false,
                        timestamp: new Date()
                    }
                ]);
            });
            
            // Listen for transfer status updates
            socket.on('transferStatusUpdated', (updateData) => {
                console.log('Transfer status update received:', updateData);
                
                // Add status update notification
                setNotifications(prev => [
                    ...prev,
                    {
                        id: `status-${updateData.transferId}-${Date.now()}`,
                        type: 'transferStatus',
                        data: updateData,
                        read: false,
                        timestamp: new Date()
                    }
                ]);
                
                // Also update the transfer updates state
                setTransferUpdates(prev => {
                    // Check if we already have this transfer update
                    const exists = prev.some(update => update.transferId === updateData.transferId);
                    
                    if (exists) {
                        // Update existing status
                        return prev.map(update => 
                            update.transferId === updateData.transferId 
                                ? { ...update, status: updateData.status, updatedAt: updateData.updatedAt } 
                                : update
                        );
                    } else {
                        // Add new status update
                        return [...prev, { 
                            transferId: updateData.transferId, 
                            status: updateData.status, 
                            updatedAt: updateData.updatedAt 
                        }];
                    }
                });
            });

            // Cleanup
            return () => {
                socket.off('newMessage');
                socket.off('newTransfer');
                socket.off('transferStatusUpdated');
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
        notifications,
        transferUpdates,
        fetchChats,
        fetchMessages,
        sendMessage,
        sendTransferNotification,
        updateTransferStatus,
        markNotificationAsRead
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
};