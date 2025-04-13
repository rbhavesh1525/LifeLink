import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import '../assets/HospitalTransferRequest.css';

const HospitalTransferRequest = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        console.log("Making API request to fetch hospitals...");
        const response = await axios.get('/api/public-hospitals');
        console.log("Hospitals response:", response.data);
        setHospitals(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching hospitals:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to fetch hospitals. Check console for details.');
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  // Handle hospital selection for transfer request
  const handleHospitalSelect = (hospitalId) => {
    navigate(`/hospital-transfer/${hospitalId}`);
  };

  if (loading) return <div className="loading">Loading hospitals...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="hospital-transfer-container">
      <div className="hospitals-list">
        <h2>Available Hospitals</h2>
        <p>Found {hospitals.length} hospitals</p>
        {hospitals.length === 0 ? (
          <p>No hospitals found</p>
        ) : (
          hospitals.map((hospital) => (
            <div 
              key={hospital._id} 
              className="hospital-card"
              onClick={() => handleHospitalSelect(hospital._id)}
            >
              <h3>{hospital.hospitalName}</h3>
              <p><strong>Location:</strong> {hospital.location}</p>
              <p><strong>Contact:</strong> {hospital.contactNumber}</p>
              <p><strong>Email:</strong> {hospital.email}</p>
              <div className="available-specialities">
                <strong>Specialities:</strong>
                <ul>
                  {hospital.specialities?.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HospitalTransferRequest; 