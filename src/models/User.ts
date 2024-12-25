import mongoose from 'mongoose';
import { MessageInterface } from './Message';

export interface UserInterface {
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: MessageInterface[];
}
