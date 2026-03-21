export interface Recipient {
  name: string;
  email: string;
}

export interface MailOptions {
  to: string | Recipient[];
  toName?: string;
  subject: string;
  html: string;
}

const FROM_NAME  = 'Graeagle Golf Packages';
const FROM_EMAIL = 'info@golfgraeagle.com';

export async function sendMail(opts: MailOptions): Promise<void> {
  const host = process.env.GGE_SMTP_HOST;
  const port = parseInt(process.env.GGE_SMTP_PORT || '465');
  const user = process.env.GGE_SMTP_USER;
  const pass = process.env.GGE_SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn(`[mailer] SMTP not configured — skipping`);
    return;
  }

  // Build To string
  let toStr: string;
  if (Array.isArray(opts.to)) {
    toStr = opts.to.map(r => `"${r.name}" <${r.email}>`).join(', ');
  } else {
    toStr = opts.toName ? `"${opts.toName}" <${opts.to}>` : opts.to;
  }

  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host, port, secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });

  await transporter.sendMail({
    from:    `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to:      toStr,
    subject: opts.subject,
    html:    opts.html,
  });

  console.log(`[mailer] ✅ Sent: ${opts.subject} → ${toStr}`);
}
