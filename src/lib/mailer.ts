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
  const apiKey = process.env.GGE_RESEND_API_KEY;

  if (!apiKey) {
    console.warn(`[mailer] Resend API key not configured — skipping`);
    return;
  }

  // Build To array for Resend
  let toArr: string[];
  if (Array.isArray(opts.to)) {
    toArr = opts.to.map(r => `"${r.name}" <${r.email}>`);
  } else {
    toArr = [opts.toName ? `"${opts.toName}" <${opts.to}>` : opts.to];
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from:    `${FROM_NAME} <${FROM_EMAIL}>`,
      to:      toArr,
      subject: opts.subject,
      html:    opts.html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[mailer] Resend error ${res.status}: ${err}`);
  }

  console.log(`[mailer] ✅ Sent via Resend: ${opts.subject} → ${toArr.join(', ')}`);
}
