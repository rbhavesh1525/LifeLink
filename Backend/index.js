const messageRoutes = require('./Routes/messageRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes); 