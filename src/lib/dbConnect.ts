import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Ensure this only runs on the server
let conn: Connection | null = null;
let promise: Promise<Connection> | null = null;

async function dbConnect(): Promise<Connection> {
  if (typeof window !== 'undefined') {
    return null as unknown as Connection;
  }

  if (conn) {
    return conn;
  }

  if (!promise) {
    const opts = {
      bufferCommands: false,
    };

    promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
  }

  try {
    conn = await promise;
    return conn;
  } catch (e) {
    promise = null;
    throw e;
  }
}

export default dbConnect;