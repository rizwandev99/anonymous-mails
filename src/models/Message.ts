import mongoose from 'mongoose';

export interface MessageInterface {
  content: string;
  createdAt: Date;
}

const MessageSchema = new mongoose.Schema<MessageInterface>({
  content: { 
    type: String, 
    required: [true, 'Message content is required'] 
  },
  
});