// src/service/mail.service.ts
import { BrevoClient } from '@getbrevo/brevo';
import "dotenv/config";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
  timeoutInSeconds: 30,
  maxRetries: 3,
});

export async function sendVerificationEmail(to: string, name: string, code: string) {
  const result = await brevo.transactionalEmails.sendTransacEmail({
    subject: 'Verify your email',
    htmlContent: `<html><body><p>Hello ${name},</p><p>Your verification code is: <strong>${code}</strong></p></body></html>`,
    sender: { name: 'Dennese Keith A. Membrano', email: 'dennesekeithmembrano@gmail.com' },
    to: [{ email: to, name }],
  });
 
  console.log('Email sent. Message ID:', result.messageId);
  return result;
}