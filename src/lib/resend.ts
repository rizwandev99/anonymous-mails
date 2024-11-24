import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.com",
      to: email,
      subject: "Anonymous mail- Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Email sending Succesfull" };
  } catch (emailError) {
    console.error("Failed to send Email");
    return { success: false, message: "Email sending failed" };
  }
}
