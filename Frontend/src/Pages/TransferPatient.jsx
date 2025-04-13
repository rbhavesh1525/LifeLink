import React, { useState, useEffect, useRef } from 'react';
import axios from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/authStore';
import { useSocket } from '../context/SocketContext';

function TransferPatient() {
    const [transferData, setTransferData] = useState({
        name: '',
        age: '',
        condition: '',
        diagnosis: '',
        ReasonForTransfer: ''
    });
    const [selectedHospital, setSelectedHospital] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [transferInitiated, setTransferInitiated] = useState(false);
    const [selectedHospitalName, setSelectedHospitalName] = useState('');
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const { socket, sendMessage: socketSendMessage } = useSocket();

    // Listen for new messages from socket
    useEffect(() => {
        if (!socket) return;

        const messageHandler = (message) => {
            console.log('New message received via socket:', message);
            
            // Only add message if it's relevant to the active chat
            if (selectedHospital && 
                (message.senderId === selectedHospital || 
                 message.receiverId === selectedHospital)) {
                
                setMessages((prev) => {
                    // Check if we've already received this message
                    const messageExists = prev.some(
                        (m) => m._id === message._id || 
                        (m.text === message.text && 
                         m.senderId === message.senderId && 
                         m.receiverId === message.receiverId &&
                         m.createdAt === message.createdAt)
                    );
                    
                    if (messageExists) return prev;
                    return [...prev, message];
                });
            }
        };

        // Add event listener
        socket.on("newMessage", messageHandler);

        // Cleanup event listener on unmount
        return () => {
            socket.off("newMessage", messageHandler);
        };
    }, [socket, selectedHospital]);

    // Fetch available hospitals
    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await axios.get('/api/public-hospitals');
                setHospitals(response.data.filter(hospital => hospital._id !== user?.id));
            } catch (error) {
                console.error('Error fetching hospitals:', error);
                toast.error('Failed to fetch hospitals');
            }
        };
        fetchHospitals();
    }, [user]);

    // Fetch existing messages when hospital is selected
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedHospital) return;
            try {
                const response = await axios.get(`/api/messages/${selectedHospital}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        if (selectedHospital) {
            fetchMessages();
        }
    }, [selectedHospital]);

    // Auto scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleTransferDataChange = (e) => {
        setTransferData({
            ...transferData,
            [e.target.name]: e.target.value
        });
    };

    const handleHospitalSelect = (e) => {
        const hospital = hospitals.find(h => h._id === e.target.value);
        setSelectedHospital(e.target.value);
        setSelectedHospitalName(hospital ? hospital.hospitalName : '');
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedHospital) return;

        try {
            // First send to backend to get an ID
            const response = await axios.post(`/api/messages/${selectedHospital}`, {
                text: newMessage
            });
            
            // Get the saved message with ID from response
            const savedMessage = response.data;
            
            // Send through socket with the ID from backend
            socketSendMessage(savedMessage);
            
            // Add to local state with the server-generated ID
            setMessages(prev => [...prev, savedMessage]);
            
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    const handleTransferSubmit = async (e) => {
        e.preventDefault();
        if (!selectedHospital) {
            toast.error('Please select a destination hospital');
            return;
        }

        try {
            const response = await axios.post(`/api/transfers/start/${selectedHospital}`, transferData);
            setTransferInitiated(true);
            toast.success('Transfer request initiated successfully');
            
            // Send automatic message about transfer initiation
            const transferMessage = `Transfer request initiated for patient ${transferData.name}. Please review the details and respond.`;
            const msgResponse = await axios.post(`/api/messages/${selectedHospital}`, {
                text: transferMessage
            });
            
            // Add message to local state
            setMessages(prev => [...prev, msgResponse.data]);
            
            // Emit socket event for real-time notification
            if (socket) {
                socket.emit('transferInitiated', {
                    destinationHospital: selectedHospital,
                    patientName: transferData.name,
                    sourceHospital: user?.id,
                    transferData: response.data.transfer
                });
            }
        } catch (error) {
            console.error('Error initiating transfer:', error);
            toast.error('Failed to initiate transfer');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex gap-4">
                {/* Left side - Transfer Form */}
                <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Initiate Patient Transfer</h2>
                    {!transferInitiated ? (
                        <form onSubmit={handleTransferSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Destination Hospital</label>
                                    <select
                                        value={selectedHospital}
                                        onChange={handleHospitalSelect}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    >
                                        <option value="">Select Hospital</option>
                                        {hospitals.map(hospital => (
                                            <option key={hospital._id} value={hospital._id}>
                                                {hospital.hospitalName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Patient Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={transferData.name}
                                        onChange={handleTransferDataChange}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={transferData.age}
                                        onChange={handleTransferDataChange}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Condition</label>
                                    <input
                                        type="text"
                                        name="condition"
                                        value={transferData.condition}
                                        onChange={handleTransferDataChange}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Diagnosis</label>
                                    <input
                                        type="text"
                                        name="diagnosis"
                                        value={transferData.diagnosis}
                                        onChange={handleTransferDataChange}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Reason for Transfer</label>
                                    <textarea
                                        name="ReasonForTransfer"
                                        value={transferData.ReasonForTransfer}
                                        onChange={handleTransferDataChange}
                                        className="w-full p-2 border rounded-md"
                                        rows="3"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Initiate Transfer
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                <h3 className="text-lg font-semibold text-green-800">Transfer Request Initiated</h3>
                                <p className="text-green-600">Transfer request for {transferData.name} has been sent to {selectedHospitalName}</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                                <h4 className="font-medium mb-2">Transfer Details:</h4>
                                <ul className="space-y-2">
                                    <li><span className="font-medium">Patient:</span> {transferData.name}</li>
                                    <li><span className="font-medium">Age:</span> {transferData.age}</li>
                                    <li><span className="font-medium">Condition:</span> {transferData.condition}</li>
                                    <li><span className="font-medium">Diagnosis:</span> {transferData.diagnosis}</li>
                                    <li><span className="font-medium">Reason:</span> {transferData.ReasonForTransfer}</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right side - Chat Interface */}
                <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">
                        Chat with {selectedHospitalName || 'Hospital'}
                    </h2>
                    <div className="h-[500px] flex flex-col">
                        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`p-2 rounded-lg max-w-[80%] ${
                                        message.senderId === user?.id
                                            ? 'ml-auto bg-blue-500 text-white'
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 p-2 border rounded-md"
                                placeholder="Type your message..."
                                disabled={!selectedHospital}
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                disabled={!selectedHospital}
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransferPatient;