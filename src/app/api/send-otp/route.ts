import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { OtpEmail } from '@/emails/OtpEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    // Email validation
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Enhanced error logging
    console.log(`Attempting to send OTP to: ${email}`);

    const { error, data } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: 'Your One-Time Password',
      html: await render(OtpEmail({ otp }))
    });

    if (error) {
      console.error('Detailed Resend Email Error:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: 'Failed to send OTP email', details: error }, { status: 500 });
    }

    console.log('OTP Email sent successfully:', data);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Comprehensive OTP Email Send Exception:', error);
    return NextResponse.json({ 
      error: 'Unexpected error occurred', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}