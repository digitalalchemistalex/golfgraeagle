export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const host = process.env.GGE_SMTP_HOST;
  const port = process.env.GGE_SMTP_PORT;
  const user = process.env.GGE_SMTP_USER;
  const pass = process.env.GGE_SMTP_PASS;
  const testMode = process.env.GGE_TEST_MODE;

  // Log env var presence (not values)
  console.log('[test-email] ENV CHECK:', {
    host: host ? `SET (${host})` : 'MISSING',
    port: port ? `SET (${port})` : 'MISSING',
    user: user ? `SET (${user})` : 'MISSING',
    pass: pass ? 'SET' : 'MISSING',
    testMode,
  });

  if (!host || !user || !pass) {
    return new Response(JSON.stringify({ error: 'SMTP env vars missing', host: !!host, user: !!user, pass: !!pass }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port || '465'),
      secure: parseInt(port || '465') === 465,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    // Verify connection first
    await transporter.verify();
    console.log('[test-email] SMTP connection verified');

    // Send test email
    const info = await transporter.sendMail({
      from: `"GolfGraeagle Test" <${user}>`,
      to: 'ifyougetlockedout@protonmail.com',
      subject: '[TEST] GGE SMTP Connection Test',
      html: '<p>SMTP is working. GolfGraeagle email system is live.</p>',
    });

    console.log('[test-email] Sent:', info.messageId);
    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('[test-email] ERROR:', err.message, err.code);
    return new Response(JSON.stringify({ error: err.message, code: err.code, stack: err.stack?.split('\n').slice(0,3) }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};
