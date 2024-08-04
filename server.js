const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); // Assuming userRoutes handle user-related API
app.use('/api/pet', petRoutes); // Assuming petRoutes handle pet-related API
app.use('/api/subscription', subscriptionRoutes); // Subscription API routes


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Successfully connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

// Start server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
