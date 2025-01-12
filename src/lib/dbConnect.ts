// Import Mongoose to interact with MongoDB
import mongoose from "mongoose";

// Set up MongoDB connection URI
// Use an environment variable for the URI, or fallback to a local MongoDB instance
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

// Async function to establish a database connection
const dbConnect = async () => {
  // Check if an active connection already exists
  if (mongoose.connection.readyState === 1) {
    console.log("🔗 Already connected to MongoDB!");
    return mongoose.connection; // Return existing connection
  }

  try {
    // Attempt to connect to MongoDB
    const connection = await mongoose.connect(MONGODB_URI, {
      // Set connection options
      serverSelectionTimeoutMS: 5000, // Wait max 5 seconds for server selection
      retryWrites: true, // Enable write retries for better reliability
    });

    // Log successful connection
    console.log("✅ Successfully connected to MongoDB");

    // Return the established connection
    return connection;
  } catch (error) {
    // Handle connection errors
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit the process if connection fails
  }
};

// Export the database connection function as default
export default dbConnect;
