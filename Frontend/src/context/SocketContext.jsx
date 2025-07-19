import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (socket) {
            return () => {
                socket.disconnect();
            };
        }
    }, [socket]);

    const connectSocket = (userId) => {
        const newSocket = io('http://localhost:5000', {
            query: { userId },
        });
        setSocket(newSocket);
    };

    return (
        <SocketContext.Provider value={{ socket, connectSocket }}>
            {children}
        </SocketContext.Provider>
    );
}; 