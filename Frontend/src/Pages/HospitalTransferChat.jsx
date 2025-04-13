import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { useMessages } from '../context/MessageContext';
import { useSocket } from '../context/SocketContext';
import '../assets/HospitalTransferChat.css';

const HospitalTransferChat = () => {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { messages, sendNewMessage, setActiveChatId } = useMessages();
  const { sendTransferNotification } = useSocket();
  const [messageInput, setMessageInput] = useState('');
  const [transferForm, setTransferForm] = useState({
    name: '',
    age: '',
    condition: '',
    diagnosis: '',
    ReasonForTransfer: ''
  });
  const [showTransferForm, setShowTransferForm] = useState(false);

  // Set the active chat to the hospital ID from URL params
  useEffect(() => {
    if (hospitalId) {
      setActiveChatId(hospitalId);
    }
  }, [hospitalId, setActiveChatId]);

  // Fetch hospital details
  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/get-hospital-info/${hospitalId}`);
        setHospital(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch hospital details');
        setLoading(false);
        console.error('Error fetching hospital details:', err);
      }
    };

    if (hospitalId) {
      fetchHospitalDetails();
    }
  }, [hospitalId]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendNewMessage(messageInput);
      setMessageInput('');
    }
  };

  // Handle form input changes
  const handleTransferFormChange = (e) => {
    const { name, value } = e.target;
    setTransferForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle transfer form visibility
  const toggleTransferForm = () => {
    setShowTransferForm(prev => !prev);
  };

  // Handle transfer request
  const handleTransferRequest = async (e) => {
    e.preventDefault();
    
    try {
      const sourceHospitalId = localStorage.getItem('hospitalId');
      
      // Send API request
      const response = await axios.post(`/api/transfers/start/${hospitalId}`, transferForm);

      // Send socket notification
      if (response.data && response.data.transfer) {
        sendTransferNotification({
          ...response.data.transfer,
          sourceHospital: sourceHospitalId,
          destinationHospital: hospitalId
        });
      }

      // Show confirmation and reset form
      alert('Transfer request initiated successfully');
      setTransferForm({
        name: '',
        age: '',
        condition: '',
        diagnosis: '',
        ReasonForTransfer: ''
      });
      setShowTransferForm(false);
    } catch (err) {
      console.error('Error initiating transfer:', err);
      alert('Failed to initiate transfer');
    }
  };

  // Go back to list of hospitals
  const handleBackClick = () => {
    navigate('/hospital-transfer-request');
  };

  if (loading) return <div className="loading">Loading hospital details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="hospital-transfer-chat-container">
      <div className="transfer-chat-sidebar">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Hospital List
        </button>
        
        {hospital && (
          <div className="selected-hospital-info">
            <h2>{hospital.hospitalName}</h2>
            <p><strong>Location:</strong> {hospital.location}</p>
            <p><strong>Contact:</strong> {hospital.contactNumber}</p>
            <p><strong>Email:</strong> {hospital.email}</p>
            {hospital.specialities && hospital.specialities.length > 0 && (
              <div className="specialities">
                <strong>Specialities:</strong>
                <ul>
                  {hospital.specialities.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}
            <button 
              className="transfer-toggle-btn"
              onClick={toggleTransferForm}
            >
              {showTransferForm ? 'Hide Transfer Form' : 'Initiate Transfer Request'}
            </button>
          </div>
        )}

        {showTransferForm && (
          <form className="transfer-form" onSubmit={handleTransferRequest}>
            <h3>Patient Transfer Details</h3>
            <div className="form-group">
              <label htmlFor="name">Patient Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={transferForm.name}
                onChange={handleTransferFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={transferForm.age}
                onChange={handleTransferFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="condition">Condition</label>
              <select
                id="condition"
                name="condition"
                value={transferForm.condition}
                onChange={handleTransferFormChange}
                required
              >
                <option value="">Select condition</option>
                <option value="Critical">Critical</option>
                <option value="Serious">Serious</option>
                <option value="Stable">Stable</option>
                <option value="Minor">Minor</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="diagnosis">Diagnosis</label>
              <textarea
                id="diagnosis"
                name="diagnosis"
                value={transferForm.diagnosis}
                onChange={handleTransferFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="ReasonForTransfer">Reason For Transfer</label>
              <textarea
                id="ReasonForTransfer"
                name="ReasonForTransfer"
                value={transferForm.ReasonForTransfer}
                onChange={handleTransferFormChange}
                required
              />
            </div>
            <button type="submit" className="transfer-submit-btn">
              Submit Transfer Request
            </button>
          </form>
        )}
      </div>

      <div className="chat-main">
        <h2>Chat with {hospital?.hospitalName}</h2>
        <div className="messages-container">
          {messages.length === 0 ? (
            <p className="no-messages">No messages yet. Start a conversation!</p>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.senderId === localStorage.getItem('hospitalId') ? 'sent' : 'received'}`}
              >
                <p>{msg.text}</p>
                <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSendMessage} className="message-form">
          <input 
            type="text" 
            value={messageInput} 
            onChange={(e) => setMessageInput(e.target.value)} 
            placeholder="Type a message..." 
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default HospitalTransferChat; 