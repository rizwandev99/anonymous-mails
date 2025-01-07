import mongoose from 'mongoose';
import User, { UserInterface } from '@/models/User';
import Message, { MessageInterface } from '@/models/Message';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';

const messages: MessageInterface[] = [];
const users: UserInterface[] = [];

async function seedDatabase() {
  try {
    // Connect to the database
    await dbConnect();

    // Clear existing data (optional, be careful in production)
    await User.deleteMany({});
    await Message.deleteMany({});

    // Create dummy messages
    for (let i = 0; i < 10; i++) {
      const message = await Message.create({ 
        content: `Hey, how are you doing today? ${i + 1}` 
      });
      messages.push(message);
    }

    // Create dummy users with hashed passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword1 = await bcrypt.hash('password123', salt);
    const hashedPassword2 = await bcrypt.hash('securepass456', salt);

    const user1 = await User.create({
      email: 'john.doe@example.com',
      password: hashedPassword1,
      verifyCode: '123456',
      verifyCodeExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      isVerified: true,
      isAcceptingMessages: true,
      messages: messages.slice(0, 5).map(m => m._id)
    });
    users.push(user1);

    const user2 = await User.create({
      email: 'jane.smith@example.com',
      password: hashedPassword2,
      verifyCode: '789012',
      verifyCodeExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isVerified: true,
      isAcceptingMessages: true,
      messages: messages.slice(5).map(m => m._id)
    });
    users.push(user2);

    console.log('Database seeded successfully!');
    console.log('Created Users:', users.map(u => u.email));
    console.log('Created Messages:', messages.map(m => m.content));
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Immediately invoked function to seed the database
seedDatabase().catch(console.error);