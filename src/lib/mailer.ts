import nodemailer from 'nodemailer';

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
const FROM_EMAIL = 'sean@golfthehighsierra.com';

function createTransport() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GGE_EMAIL_USER,
      pass: process.env.GGE_EMAIL_PASSWORD,
    },
  });
}

export async function sendMail(opts: MailOptions): Promise<void> {
  let to: string | { name: string; address: string }[];
  if (Array.isArray(opts.to)) {
    to = opts.to.map(r => ({ name: r.name, address: r.email }));
  } else {
    to = opts.toName ? `"${opts.toName}" <${opts.to}>` : opts.to;
  }

  const transporter = createTransport();
  const info = await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: opts.subject,
    html: opts.html,
  });

  console.log(`[mailer] ✅ Sent via SMTP: ${opts.subject} → ${info.messageId}`);
}
