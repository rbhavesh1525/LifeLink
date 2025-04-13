import React, { useEffect, useState, useRef } from "react";
import axios from "../utils/api";
import { toast } from "react-toastify";
import useAuthStore from "../Store/authStore";
import { FaSearch, FaExchangeAlt, FaCalendarAlt, FaComment, FaArrowRight, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { useSocket } from "../context/SocketContext";

function PatientTransferRecords() {
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [outgoingTransfers, setOutgoingTransfers] = useState([]);
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "outgoing"
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeChatHospital, setActiveChatHospital] = useState(null);
  const [activeTransfer, setActiveTransfer] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [updatingTransferIds, setUpdatingTransferIds] = useState([]);
  const user = useAuthStore((state) => state.user);
  const { socket, sendMessage } = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Listen for new messages from socket
  useEffect(() => {
    if (!socket) return;

    const messageHandler = (message) => {
      console.log("Received new message via socket:", message);
      
      // Only add message if it's relevant to the active chat
      if (activeChatHospital && 
          (message.senderId === activeChatHospital._id || 
           message.receiverId === activeChatHospital._id)) {
            
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
      } else {
        console.log("Message not for current chat");
      }
    };

    // Add event listener
    socket.on("newMessage", messageHandler);

    // Cleanup event listener on unmount
    return () => {
      socket.off("newMessage", messageHandler);
    };
  }, [socket, activeChatHospital]); // Add activeChatHospital as dependency

  // Additional socket listener for transfer status updates
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (data) => {
      console.log("Transfer status updated via socket:", data);
      toast.info(`Transfer status updated to ${data.status} by ${data.hospitalName}`);
      
      // Remove this transfer from loading state
      setUpdatingTransferIds(prev => prev.filter(id => id !== data.transferId));
      
      // Refresh the transfers list
      fetchTransfers();
    };

    socket.on("transferStatusUpdated", handleStatusUpdate);

    return () => {
      socket.off("transferStatusUpdated", handleStatusUpdate);
    };
  }, [socket]);

  const fetchTransfers = async () => {
    try {
      setLoadingStatus(true);
      // Get pending transfers (where this hospital is the destination)
      const pendingResponse = await axios.get("/api/transfers/pending");
      console.log("Fetched pending transfers:", pendingResponse.data);
      setPendingTransfers(pendingResponse.data);

      // Get outgoing transfers (where this hospital is the source)
      const outgoingResponse = await axios.get("/api/transfers/outgoing");
      console.log("Fetched outgoing transfers:", outgoingResponse.data);
      setOutgoingTransfers(outgoingResponse.data);
      setLoadingStatus(false);
    } catch (error) {
      console.error("Error fetching transfers:", error);
      toast.error("Failed to fetch transfers");
      setLoadingStatus(false);
    }
  };

  const updateTransferStatus = async (transferId, newStatus) => {
    try {
      // Add this transfer to loading state
      setUpdatingTransferIds(prev => [...prev, transferId]);
      
      console.log(`Updating transfer ${transferId} to status: ${newStatus}`);
      const response = await axios.put(`/api/transfers/update/${transferId}`, { status: newStatus });
      console.log("Update response:", response.data);
      
      // Optimistically update the transfer in the UI
      setPendingTransfers(prev => 
        prev.map(transfer => 
          transfer._id === transferId 
            ? { ...transfer, status: newStatus } 
            : transfer
        )
      );
      
      setOutgoingTransfers(prev => 
        prev.map(transfer => 
          transfer._id === transferId 
            ? { ...transfer, status: newStatus } 
            : transfer
        )
      );
      
      toast.success(`Transfer status updated to ${newStatus}`);
      
      // Immediately fetch transfers to update the UI
      await fetchTransfers();
      
      // Remove this transfer from loading state
      setUpdatingTransferIds(prev => prev.filter(id => id !== transferId));
    } catch (error) {
      console.error("Error updating transfer status:", error);
      toast.error("Failed to update transfer status");
      
      // Remove this transfer from loading state even if there's an error
      setUpdatingTransferIds(prev => prev.filter(id => id !== transferId));
    }
  };

  const openChat = async (transfer) => {
    setActiveTransfer(transfer);
    
    // Determine other hospital (source if we're destination, destination if we're source)
    const otherHospital = 
      activeTab === "pending" ? transfer.sourceHospital : transfer.destinationHospital;
    
    setActiveChatHospital(otherHospital);
    setIsChatOpen(true);

    try {
      // Fetch messages between the two hospitals
      const response = await axios.get(`/api/messages/${otherHospital._id}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load chat history");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatHospital) return;

    try {
      const messageData = {
        text: newMessage,
        senderId: user.id,
        receiverId: activeChatHospital._id,
        createdAt: new Date().toISOString()
      };

      // First send to backend to get an ID
      const response = await axios.post(`/api/messages/${activeChatHospital._id}`, { text: newMessage });
      
      // Get the saved message with ID from response
      const savedMessage = response.data;
      
      // Send through socket with the ID from backend
      sendMessage(savedMessage);
      
      // Add to local state with the server-generated ID
      setMessages(prev => [...prev, savedMessage]);
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  // Filter transfers based on search term and status
  const filterTransfers = (transfers) => {
    return transfers.filter((transfer) => {
      // Filter by search term (patient name or condition)
      const searchMatch =
        transfer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.condition.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status if not "all"
      const statusMatch =
        statusFilter === "all" || (transfer.status && transfer.status === statusFilter);

      return searchMatch && statusMatch;
    });
  };

  const filteredPendingTransfers = filterTransfers(pendingTransfers);
  const filteredOutgoingTransfers = filterTransfers(outgoingTransfers);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      {/* Heading Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Patient Transfer Records</h1>
        <p className="text-gray-600">Manage incoming and outgoing patient transfers</p>
      </div>

      {/* Tab Selection */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "pending"
              ? "text-blue-600 border-b-2 border-blue-600 font-medium"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          <FaArrowRight className="inline mr-2" /> Incoming Transfers
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "outgoing"
              ? "text-blue-600 border-b-2 border-blue-600 font-medium"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("outgoing")}
        >
          <FaArrowLeft className="inline mr-2" /> Outgoing Transfers
        </button>
      </div>

      {/* Transfer Records Heading and Search Section */}
      <div className="flex justify-between items-center mb-4">
        {/* Transfer Records Heading with Icon */}
        <div className="flex items-center space-x-2">
          <FaExchangeAlt className="text-gray-700 text-xl" />
          <h2 className="text-lg font-semibold text-gray-800">
            {activeTab === "pending" ? "Incoming Transfer Requests" : "Outgoing Transfer Requests"}
          </h2>
        </div>

        {/* Search and Filter Section */}
        <div className="flex items-center space-x-3">
          {/* Search Input */}
          <div className="flex items-center border border-gray-300 rounded px-3 py-2">
            <input
              type="text"
              placeholder="Search patient or condition"
              className="w-full focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="text-gray-500 cursor-pointer hover:text-gray-700" />
          </div>

          {/* Filter Dropdown */}
          <select
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Transfer Records Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-300">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {activeTab === "pending" ? "From Hospital" : "To Hospital"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Condition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <FaCalendarAlt className="inline-block mr-1 text-gray-500" /> Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === "pending" ? filteredPendingTransfers : filteredOutgoingTransfers)
              .length > 0 ? (
              (activeTab === "pending" ? filteredPendingTransfers : filteredOutgoingTransfers).map(
                (transfer) => (
                  <tr key={transfer._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{transfer.name}</td>
                    <td className="px-6 py-4">
                      {activeTab === "pending"
                        ? transfer.sourceHospital.hospitalName
                        : transfer.destinationHospital.hospitalName}
                    </td>
                    <td className="px-6 py-4">{transfer.condition}</td>
                    <td className="px-6 py-4">
                      {new Date(transfer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          transfer.status || "pending"
                        )}`}
                      >
                        {transfer.status ? transfer.status.toUpperCase() : "PENDING"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {/* Chat Button */}
                        <button
                          onClick={() => openChat(transfer)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Chat"
                        >
                          <FaComment />
                        </button>

                        {/* Status Update Buttons (only for pending transfers) */}
                        {activeTab === "pending" && (!transfer.status || transfer.status === "pending") && (
                          <>
                            <button
                              onClick={() => updateTransferStatus(transfer._id, "accepted")}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                              disabled={updatingTransferIds.includes(transfer._id)}
                            >
                              {updatingTransferIds.includes(transfer._id) ? (
                                <>
                                  <FaSpinner className="animate-spin mr-1" /> Processing...
                                </>
                              ) : (
                                "Accept"
                              )}
                            </button>
                            <button
                              onClick={() => updateTransferStatus(transfer._id, "rejected")}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                              disabled={updatingTransferIds.includes(transfer._id)}
                            >
                              {updatingTransferIds.includes(transfer._id) ? (
                                <>
                                  <FaSpinner className="animate-spin mr-1" /> Processing...
                                </>
                              ) : (
                                "Reject"
                              )}
                            </button>
                          </>
                        )}

                        {/* Complete Button (only for accepted transfers) */}
                        {transfer.status === "accepted" && (
                          <button
                            onClick={() => updateTransferStatus(transfer._id, "completed")}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                            disabled={updatingTransferIds.includes(transfer._id)}
                          >
                            {updatingTransferIds.includes(transfer._id) ? (
                              <>
                                <FaSpinner className="animate-spin mr-1" /> Processing...
                              </>
                            ) : (
                              "Complete"
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No transfer records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Chat Sidebar */}
      {isChatOpen && activeChatHospital && (
        <div className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg p-4 flex flex-col border-l border-gray-300 z-50">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-lg font-semibold">
              Chat with {activeChatHospital.hospitalName}
            </h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>

          {activeTransfer && (
            <div className="bg-blue-50 p-3 my-2 rounded-md text-sm">
              <p className="font-semibold">Transfer Details:</p>
              <p>Patient: {activeTransfer.name}</p>
              <p>Condition: {activeTransfer.condition}</p>
              <p>Status: {activeTransfer.status || "Pending"}</p>
            </div>
          )}

          <div className="flex-grow overflow-y-auto my-4 p-2">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 italic">No messages yet</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 max-w-3/4 ${
                    msg.senderId === user.id
                      ? "ml-auto bg-blue-100 rounded-bl-lg rounded-tl-lg rounded-tr-lg"
                      : "mr-auto bg-gray-100 rounded-br-lg rounded-tr-lg rounded-tl-lg"
                  } p-3 rounded-lg`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs text-gray-500 text-right mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex mt-auto">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PatientTransferRecords;
