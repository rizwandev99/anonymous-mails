export async function sendOtpEmail(email: string, otp: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('OTP Send Error:', result.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('OTP Email Send Network Error:', error);
    return false;
  }
}

export function generateOTP(length: number = 6): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}