import { Resend } from 'resend';
import { render } from '@react-email/render';
import { OtpEmail } from '../emails/OtpEmail';

// Add logging to check the API key
const apiKey = process.env.RESEND_API_KEY;
console.log('Resend API Key:', apiKey ? 'Present' : 'Missing');

if (!apiKey) {
  throw new Error('RESEND_API_KEY is not set in the environment variables');
}

const resend = new Resend(apiKey);

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendOtpEmail(email: string, otp: string) {
  // Validate email format
  if (!EMAIL_REGEX.test(email)) {
    console.error('Invalid email format:', email);
    return false;
  }

  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email send timeout')), 10000)
    );

    const sendPromise = resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: 'Your One-Time Password',
      html: await render(OtpEmail({ otp }))
    });

    try {
      const result = await Promise.race([sendPromise, timeoutPromise]);
      
      // Type guard to check if result has an error property
      if (result && typeof result === 'object' && 'error' in result) {
        const error = (result as { error?: any }).error;
        if (error) {
          console.error('OTP Email Send Error:', JSON.stringify(error, null, 2));
          throw new Error('Failed to send OTP email');
        }
      }

      console.log('OTP Email sent successfully to:', email);
      return true;
    } catch (error) {
      console.error('OTP Email Send Error:', error);
      return false;
    }
  } catch (error) {
    console.error('OTP Email Send Exception:', error instanceof Error ? error.message : error);
    return false;
  }
}

export function generateOTP(length: number = 6): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}