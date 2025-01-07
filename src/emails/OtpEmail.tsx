import * as React from 'react';
import { 
  Html, 
  Head, 
  Preview, 
  Body, 
  Container, 
  Text, 
  Section, 
  Heading 
} from '@react-email/components';

interface OtpEmailProps {
  otp: string;
}

export function OtpEmail({ otp }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your One-Time Password</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Container>
          <Heading>One-Time Password</Heading>
          <Section>
            <Text>Your OTP is:</Text>
            <Text style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#007bff' 
            }}>
              {otp}
            </Text>
            <Text>This OTP will expire in 10 minutes.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}