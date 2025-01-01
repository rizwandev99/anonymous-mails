import mongoose from 'mongoose';

export interface MessageInterface {
  content: string;
  createdAt: Date;
}