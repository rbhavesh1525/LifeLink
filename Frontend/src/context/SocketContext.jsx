import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connectedUserId, setConnectedUserId] = useState(null);

    // Cleanup on unmount or socket change
    useEffect(() => {
        if (socket) {
            console.log(`Socket initialized with ID: ${socket.id}`);
            
            // Setup connection event listeners
            socket.on('connect', () => {
                console.log(`Socket connected successfully with ID: ${socket.id}`);
                console.log(`Connected as user: ${connectedUserId}`);
            });
            
            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });
            
            socket.on('disconnect', (reason) => {
                console.log(`Socket disconnected. Reason: ${reason}`);
            });
            
            socket.on('reconnect', (attemptNumber) => {
                console.log(`Socket reconnected after ${attemptNumber} attempts`);
            });
            
            // Cleanup function
            return () => {
                console.log('Disconnecting socket...');
                socket.disconnect();
            };
        }
    }, [socket, connectedUserId]);

    const connectSocket = (userId) => {
        if (!userId) {
            console.error('Cannot connect socket: User ID is missing');
            return;
        }
        
        console.log(`Connecting socket for user ID: ${userId}`);
        
        try {
            const newSocket = io('http://localhost:5000', {
                query: { userId },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });
            
            setSocket(newSocket);
            setConnectedUserId(userId);
        } catch (error) {
            console.error('Error creating socket connection:', error);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, connectSocket, connectedUserId }}>
            {children}
        </SocketContext.Provider>
    );
}; 