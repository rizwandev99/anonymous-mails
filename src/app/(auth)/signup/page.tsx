"use client";

import React, { useState } from "react";
import { sendOtpEmail, generateOTP } from "@/lib/otpService";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all fields");
      return;
    }

    // Generate and send OTP
    const newOtp = generateOTP();
    const success = await sendOtpEmail(email, newOtp);

    if (success) {
      setGeneratedOtp(newOtp);
      setStep("otp");
    } else {
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      // TODO: Save user details to database
      alert("Sign up successful!");
      router.push("/"); // Redirect to home or dashboard
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (step === "signup") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Sign Up
          </h2>
          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 border rounded text-black"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded text-black"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border rounded text-black pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    );
  }

  // OTP Verification Step
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Verify OTP
        </h2>
        <form onSubmit={handleOtpVerification} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full p-2 border rounded text-black"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}