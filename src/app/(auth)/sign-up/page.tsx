"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { sendOtpEmail, generateOTP } from "@/lib/otpService";
import { useRouter } from "next/navigation";

// Comprehensive type definitions
type SignUpFormType = {
  username: string;
  email: string;
  password: string;
};

type AvailabilityCheckType = "username" | "email";

type AvailabilityResponse = {
  available: boolean;
  message?: string;
};

type SignUpStep = "signup" | "otp";

// Debounce hook with generic type and improved typing
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function SignUpPage() {
  const router = useRouter();

  // Comprehensive state management with explicit types
  const [formData, setFormData] = useState<SignUpFormType>({
    username: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState<string>("");
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [step, setStep] = useState<SignUpStep>("signup");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Availability states
  const [usernameAvailability, setUsernameAvailability] = useState<
    boolean | null
  >(null);
  const [emailAvailability, setEmailAvailability] = useState<boolean | null>(
    null
  );
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState<boolean>(false);

  // Debounced values
  const debouncedUsername = useDebounce(formData.username, 500);
  const debouncedEmail = useDebounce(formData.email, 500);

  // Generic input change handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SignUpFormType
  ) => {
    const newValue = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    // Clear availability state when input is empty
    if (!newValue.trim()) {
      if (field === "username") {
        setUsernameAvailability(null);
      } else if (field === "email") {
        setEmailAvailability(null);
      }
    }
  };

  // Availability check function with improved type safety
  const checkAvailability = async (
    type: AvailabilityCheckType,
    value: string
  ): Promise<boolean | null> => {
    if (!value.trim()) return null;

    const setCheckingState = (isChecking: boolean) => {
      type === "username"
        ? setIsCheckingUsername(isChecking)
        : setIsCheckingEmail(isChecking);
    };

    const setAvailabilityState = (available: boolean | null) => {
      type === "username"
        ? setUsernameAvailability(available)
        : setEmailAvailability(available);
    };

    setCheckingState(true);

    try {
      const response = await fetch("/api/check-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, value }),
      });

      if (!response.ok) {
        throw new Error(`Availability check failed: ${response.status}`);
      }

      const result: AvailabilityResponse = await response.json();

      setAvailabilityState(result.available);
      setCheckingState(false);

      return result.available;
    } catch (error) {
      console.error(`${type} availability check failed`, error);

      setAvailabilityState(null);
      setCheckingState(false);

      return null;
    }
  };

  // Username availability check effect
  useEffect(() => {
    if (debouncedUsername) {
      checkAvailability("username", debouncedUsername);
    }
  }, [debouncedUsername]);

  // Email availability check effect
  useEffect(() => {
    if (debouncedEmail) {
      checkAvailability("email", debouncedEmail);
    }
  }, [debouncedEmail]);

  // Sign-up handler with comprehensive validation
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form fields
    const { username, email, password } = formData;
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Comprehensive validation
    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (usernameAvailability !== true || emailAvailability !== true) {
      alert("Please ensure username and email are available");
      return;
    }

    try {
      const newOtp = generateOTP();
      const success = await sendOtpEmail(email, newOtp);

      if (success) {
        setGeneratedOtp(newOtp);
        setStep("otp");
      } else {
        alert("Failed to send OTP. Please check your email.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // OTP submit handler
  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.trim() === generatedOtp) {
      // Proceed with user registration
      router.push("/dashboard");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-white 
      flex items-center justify-center p-4 overflow-hidden"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-xl 
        border border-gray-200 shadow-lg overflow-hidden"
      >
        <div className="p-10 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-black mb-4">
              {step === "signup" ? "Create Account" : "Verify OTP"}
            </h2>
            <p className="text-gray-600 text-sm tracking-wide">
              {step === "signup"
                ? "Unlock a world of possibilities"
                : "Secure verification in seconds"}
            </p>
          </div>

          {step === "signup" ? (
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => handleInputChange(e, "username")}
                  required
                  className={`w-full px-4 py-4 bg-white border border-gray-300 rounded-xl text-black 
                  transition-all duration-300 focus:outline-none focus:ring-2 ${
                    usernameAvailability === false
                      ? "ring-red-500/50"
                      : usernameAvailability === true
                        ? "ring-green-500/50"
                        : "ring-gray-500/50"
                  }`}
                />
                {isCheckingUsername && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
                    Checking...
                  </div>
                )}
                {usernameAvailability === false && (
                  <p className="text-sm text-red-500 mt-2">
                    Username is not available
                  </p>
                )}
                {usernameAvailability === true && (
                  <p className="text-sm text-green-500 mt-2">
                    Username is available
                  </p>
                )}
              </div>

              <div className="relative group">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, "email")}
                  required
                  className={`w-full px-4 py-4 bg-white border border-gray-300 rounded-xl text-black 
                  transition-all duration-300 focus:outline-none focus:ring-2 ${
                    emailAvailability === false
                      ? "ring-red-500/50"
                      : emailAvailability === true
                        ? "ring-green-500/50"
                        : "ring-gray-500/50"
                  }`}
                />
                {isCheckingEmail && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
                    Checking...
                  </div>
                )}
                {emailAvailability === false && (
                  <p className="text-sm text-red-500 mt-2">
                    Email is already registered
                  </p>
                )}
                {emailAvailability === true && (
                  <p className="text-sm text-green-500 mt-2">
                    Email is available
                  </p>
                )}
              </div>

              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, "password")}
                  required
                  className="w-full px-4 pr-12 py-4 bg-white border border-gray-300 rounded-xl text-black 
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-black text-white rounded-xl 
                transition-all duration-300 transform hover:bg-gray-800 
                flex items-center justify-center"
              >
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl text-black 
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-black text-white rounded-xl 
                transition-all duration-300 transform hover:bg-gray-800 
                flex items-center justify-center"
              >
                Verify OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
