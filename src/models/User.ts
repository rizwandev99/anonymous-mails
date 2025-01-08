import mongoose from 'mongoose';
import { MessageInterface } from './Message';

export interface UserInterface {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: MessageInterface[];
}

const UserSchema = new mongoose.Schema<UserInterface>({
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    unique: true,
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'] 
  },
  verifyCode: { 
    type: String, 
    required: [true, 'Verify code is required'] 
  },
  verifyCodeExpiry: { 
    type: Date, 
    required: [true, 'Verify code expiry is required'] 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  isAcceptingMessages: { 
    type: Boolean, 
    default: true 
  },
  messages: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message' 
  }]
});

// export default mongoose.models.User || mongoose.model<UserInterface>('User', UserSchema);

const User = mongoose.models.User || mongoose.model<UserInterface>('User', UserSchema);

export default User;