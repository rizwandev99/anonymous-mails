import * as React from "react";
import { Html, Text, Section, Container } from "@react-email/components";

interface OtpEmailProps {
  otp: string;
}

export function OtpEmail({ otp }: OtpEmailProps) {
  return (
    <Html>
      <Container>
        <Section>
          <Text>Your One-Time Password (OTP) is:</Text>
          <Text
            style={{
              backgroundColor: "#f0f0f0",
              padding: "10px",
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {otp}
          </Text>
          <Text>
            This OTP will expire in 10 minutes. Do not share it with anyone.
          </Text>
        </Section>
      </Container>
    </Html>
  );
}
