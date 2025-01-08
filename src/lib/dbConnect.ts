// Import Mongoose to interact with MongoDB
import mongoose from 'mongoose';

// Set up MongoDB connection URI
// Priority: Use environment variable, fallback to local MongoDB instance
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anonymous-mails';

// Async function to establish database connection
const dbConnect = async () => {
  // Step 1: Check if an active connection already exists
  // mongoose.connection.readyState:
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    // Step 2: Attempt to connect to MongoDB
    // Configure connection with timeout and retry settings
    const connection = await mongoose.connect(MONGODB_URI, {
      // Wait max 5 seconds for server selection
      serverSelectionTimeoutMS: 5000,
      // Enable write retries for better reliability
      retryWrites: true,
    });

    // Step 3: Log successful connection
    console.log('✅ Successfully connected to MongoDB');
    
    // Step 4: Return the established connection
    return connection;
  } catch (error) {
    // Step 5: Handle connection errors
    // Log the error and exit the process if connection fails
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Export the database connection function as default
export default dbConnect;