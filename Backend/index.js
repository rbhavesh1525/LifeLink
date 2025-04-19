const { app, server } = require('./utils/socket');
const connectdb = require('./dbconfig/dbconfig');
const authRoutes = require('./Routes/authRoutes');
const hospitalRoutes = require('./Routes/HospitalRoutes');
const doctorRoutes = require('./Routes/DoctorRoutes');
const locationRoutes = require('./Routes/LocationRoutes');
const ambulanceRoutes = require('./Routes/AmbulanceRoutes');
const transferRoutes = require('./Routes/transferRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(require('express').json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', doctorRoutes);
app.use('/api', hospitalRoutes);
app.use('/api', locationRoutes);
app.use('/api/ambulance', ambulanceRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/messages', messageRoutes);

// Connect to database
connectdb();

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 