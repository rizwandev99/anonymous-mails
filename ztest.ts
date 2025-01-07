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
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.models.Message || mongoose.model<MessageInterface>('Message', MessageSchema);
