import connectToDatabase from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get type (username or email) and value from request
    const { type, value } = await req.json();

    // Check if type and value are provided
    if (!type || !value) {
      return NextResponse.json(
        { error: 'Type and value are required' }, 
        { status: 400 }
      );
    }

    // Check if username or email exists
    let exists = false;
    if (type === 'username') {
      exists = !!await User.exists({ username: value });
    } else if (type === 'email') {
      exists = !!await User.exists({ email: value });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be username or email' }, 
        { status: 400 }
      );
    }

    // Return availability status
    return NextResponse.json({ 
      available: !exists 
    });
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}