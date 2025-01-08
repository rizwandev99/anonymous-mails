import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, verifyCode } = await request.json();

    // Validate input
    if (!email || !verifyCode) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    // Find user by email and verify code
    const user = await User.findOne({ 
      email, 
      verifyCode, 
      verifyCodeExpiry: { $gt: new Date() } 
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 404 });
    }

    // Update user verification status
    user.isVerified = true;
    user.verifyCode = ''; // Clear the verify code after successful verification
    await user.save();

    return NextResponse.json({ 
      message: 'User verified successfully', 
      user: { 
        email: user.email, 
        username: user.username, 
        isVerified: user.isVerified 
      } 
    }, { status: 200 });

  } catch (error) {
    console.error('User Verification Error:', error);
    return NextResponse.json({ 
      error: 'Verification failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}