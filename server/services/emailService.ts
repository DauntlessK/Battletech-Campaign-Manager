import nodemailer from "nodemailer";
import type { Campaign } from "../types/models";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@battletech.local";

// MAIL_MODE: 'off' | 'mock' | 'smtp'
const MAIL_MODE = (process.env.MAIL_MODE || (process.env.NODE_ENV === "production" ? "smtp" : "off")).toLowerCase();

function isSmtpConfigured() {
  return !!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);
}

async function createTransporter() {
  if (!isSmtpConfigured()) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  if (MAIL_MODE === "off") {
    console.log("[emailService] MAIL_MODE=off; skipping sendEmail to", to);
    return false;
  }

  if (MAIL_MODE === "mock") {
    console.log("[emailService] MAIL_MODE=mock; mock-send to", to, "subject:", subject);
    return true;
  }

  // MAIL_MODE === 'smtp'
  const transporter = await createTransporter();
  if (!transporter) {
    console.log("[emailService] SMTP not configured; cannot send email to", to);
    return false;
  }

  const info = await transporter.sendMail({ from: EMAIL_FROM, to, subject, text, html });
  console.log("[emailService] sent message", info.messageId);
  return true;
}

export async function sendInviteEmail(toEmail: string, toName: string | undefined, campaign: Campaign, invitedByName?: string) {
  const subject = `Invitation to join campaign: ${campaign.name}`;
  const text = `Hello ${toName ?? "Player"},\n\nYou have been invited by ${invitedByName ?? "a player"} to join the campaign '${campaign.name}'.\n\nLog in to accept or decline the invitation.\n\nThanks,\nBattletech Campaign Manager`;
  const html = `<p>Hello ${toName ?? "Player"},</p><p>You have been invited by <strong>${invitedByName ?? "a player"}</strong> to join the campaign '<strong>${campaign.name}</strong>'.</p><p>Log in to accept or decline the invitation.</p><p>Thanks,<br/>Battletech Campaign Manager</p>`;

  return sendEmail(toEmail, subject, text, html);
}
