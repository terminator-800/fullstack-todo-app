import { BrevoClient } from '@getbrevo/brevo';
import "dotenv/config";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
  timeoutInSeconds: 30,
  maxRetries: 3,
});

export async function sendEmail(to: string, name: string) {
  const result = await brevo.transactionalEmails.sendTransacEmail({
    subject: 'Hello from Brevo!',
    htmlContent: `<html><body><p>Hello ${name},</p><p>This is my first transactional email.</p></body></html>`,
    sender: { name: 'Alex from Brevo', email: 'hello@brevo.com' },
    to: [{ email: to, name }],
  });

  console.log('Email sent. Message ID:', result.messageId);
  return result;
}