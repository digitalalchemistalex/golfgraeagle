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
const FROM_EMAIL = 'info@golfthehighsierra.com';

async function getAccessToken(): Promise<string> {
  const clientId     = process.env.GGE_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GGE_GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GGE_GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('[mailer] Gmail OAuth credentials not configured');
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type:    'refresh_token',
    }),
  });

  if (!res.ok) throw new Error(`[mailer] Token refresh failed: ${await res.text()}`);
  const data = await res.json();
  return data.access_token as string;
}

export async function sendMail(opts: MailOptions): Promise<void> {
  // Build To header string
  let toHeader: string;
  if (Array.isArray(opts.to)) {
    toHeader = opts.to.map(r => `"${r.name}" <${r.email}>`).join(', ');
  } else {
    toHeader = opts.toName ? `"${opts.toName}" <${opts.to}>` : opts.to;
  }

  const accessToken = await getAccessToken();

  const emailLines = [
    `From: "${FROM_NAME}" <${FROM_EMAIL}>`,
    `To: ${toHeader}`,
    `Subject: ${opts.subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    opts.html,
  ];

  const raw = Buffer.from(emailLines.join('\r\n')).toString('base64url');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[mailer] Gmail API error ${res.status}: ${err}`);
  }

  console.log(`[mailer] ✅ Sent via Gmail: ${opts.subject} → ${toHeader}`);
}
