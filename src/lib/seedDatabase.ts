import 'dotenv/config'
import mongoose from 'mongoose';
import User from '@/models/User';
import Message from '@/models/Message';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';

// Function to populate the database with initial test data
async function seedDatabase() {
  try {
    // Step 1: Establish a connection to the database
    console.log('Connecting to the database...');
    await dbConnect();

    // Step 2: Clear existing data to start with a clean slate
    console.log('Clearing existing database records...');
    await Promise.all([
      User.deleteMany({}),   // Remove all existing users
      Message.deleteMany({}) // Remove all existing messages
    ]);

    // Step 3: Generate secure password hashes
    console.log('Generating secure password hashes...');
    const passwordSalt = await bcrypt.genSalt(10);
    const johnPassword = await bcrypt.hash('password123', passwordSalt);
    const janePassword = await bcrypt.hash('securepass456', passwordSalt);

    // Step 4: Create sample messages
    console.log('Creating sample messages...');
    const sampleMessages = await Message.create([
      { content: 'Hello, welcome to Anonymous Mails!' },
      { content: 'This is a test message for John' },
      { content: 'Another test message for John' },
      { content: 'First message for Jane' },
      { content: 'Second message for Jane' }
    ]);

    // Step 5: Create sample user accounts
    console.log('Creating sample user accounts...');
    await User.create([
      {
        // First test user
        username: 'john.doe@example.com',
        email: 'john.doe@example.com',
        password: johnPassword,
        verifyCode: '123456',
        verifyCodeExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        isVerified: true,
        isAcceptingMessages: true,
        messages: sampleMessages.slice(0, 3).map(m => m._id)
      },
      {
        // Second test user
        username: 'jane.smith@example.com',
        email: 'jane.smith@example.com',
        password: janePassword,
        verifyCode: '789012',
        verifyCodeExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isVerified: true,
        isAcceptingMessages: true,
        messages: sampleMessages.slice(3).map(m => m._id)
      }
    ]);

    // Final confirmation
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    // Detailed error logging
    console.error('❌ Failed to seed database:', error);
    
    // Provide more context about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message
      });
    }
  } finally {
    // Always close the database connection
    console.log('Closing database connection...');
    await mongoose.connection.close();
  }
}

// Run the seeding function and catch any unhandled errors
seedDatabase().catch(error => {
  console.error('Unhandled error in seedDatabase:', error);
  process.exit(1); // Exit with error code
});