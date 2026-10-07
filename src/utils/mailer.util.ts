import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import {
  MAILER_EMAIL,
  MAILER_FROM_NAME,
  MAILER_PASSWORD,
  MAILER_TRANSPORT_HOST,
  MAILER_TRANSPORT_PORT,
  MAILER_TRANSPORT_SECURE,
} from '../config';
import logger from './logger';

/**
 * ============================================================================
 * MAILER UTILITY (Connection-Pooled & Production-Ready from mapanytime-api)
 * ============================================================================
 *
 * Usage:
 *   await sendEmail({
 *     to: "user@example.com",
 *     subject: "Welcome to Our Platform",
 *     html: "<h1>Welcome!</h1><p>Your account is ready.</p>"
 *   });
 */

let transporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: MAILER_TRANSPORT_HOST,
      port: MAILER_TRANSPORT_PORT,
      secure: MAILER_TRANSPORT_SECURE,
      auth: MAILER_EMAIL ? { user: MAILER_EMAIL, pass: MAILER_PASSWORD } : undefined,
    });
  }
  return transporter;
}

/** True when enough is configured for email sending */
export function isMailerConfigured(): boolean {
  return Boolean(MAILER_TRANSPORT_HOST && MAILER_EMAIL && MAILER_PASSWORD);
}

/**
 * Checks the mail transport connection at boot
 */
export async function verifyMailer(): Promise<boolean> {
  if (!isMailerConfigured()) {
    logger.info(
      '[Mailer] Optional SMTP transport not configured — set MAILER_TRANSPORT_HOST, MAILER_EMAIL, MAILER_PASSWORD in .env to enable outgoing emails.',
    );
    return false;
  }

  try {
    await getTransporter().verify();
    logger.info(
      `[Mailer] Transport verified: ${MAILER_EMAIL} via ${MAILER_TRANSPORT_HOST}:${MAILER_TRANSPORT_PORT}`,
    );
    return true;
  } catch (_error) {
    logger.warn(
      `[Mailer] Transport check warning for ${MAILER_TRANSPORT_HOST}:${MAILER_TRANSPORT_PORT} — emails will not be delivered.`,
    );
    return false;
  }
}

/**
 * Send an email with HTML/plain-text support
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
  cc,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  cc?: string | null;
}): Promise<string> {
  if (!isMailerConfigured()) {
    logger.warn(`[Mailer:Mock] Email to ${to} skipped because mailer is not configured in .env`);
    return 'mock-message-id';
  }

  const mailOptions: SendMailOptions = {
    from: `${MAILER_FROM_NAME} <${MAILER_EMAIL}>`,
    to,
    subject,
  };

  if (text) mailOptions.text = text;
  if (html) mailOptions.html = html;
  if (cc) mailOptions.cc = cc;

  const info = await getTransporter().sendMail(mailOptions);
  logger.info(`[Mailer] Sent "${subject}" to ${to} (id: ${info.messageId})`);

  if (MAILER_TRANSPORT_HOST.includes('ethereal')) {
    logger.info(`[Mailer] Ethereal preview: ${nodemailer.getTestMessageUrl(info)}`);
  }

  return info.messageId;
}
