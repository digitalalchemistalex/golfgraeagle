export interface MailOptions {
  to: string;
  toName: string;
  subject: string;
  html: string;
}

const FROM_NAME  = 'GolfGraeagle.com';
const FROM_EMAIL = 'info@golfgraeagle.com';

export async function sendMail(opts: MailOptions): Promise<void> {
  const host = process.env.GGE_SMTP_HOST;
  const port = parseInt(process.env.GGE_SMTP_PORT || '465');
  const user = process.env.GGE_SMTP_USER;
  const pass = process.env.GGE_SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn(`[mailer] SMTP not configured — skipping email to ${opts.to}`);
    return;
  }

  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host, port, secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to:   `"${opts.toName}" <${opts.to}>`,
    subject: opts.subject,
    html: opts.html,
  });

  console.log(`[mailer] ✅ Sent to ${opts.to}: ${opts.subject}`);
}
