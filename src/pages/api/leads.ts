export const prerender = false;

import type { APIRoute } from 'astro';
import { sendMail } from '../../lib/mailer';

// ─── Config ────────────────────────────────────────────────
const SUPA_URL  = 'https://egplpluvbfsjrqzecnjf.supabase.co';
const SUPA_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncGxwbHV2YmZzanJxemVjbmpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM4NDY4NSwiZXhwIjoyMDg0OTYwNjg1fQ.058gQsnZmklTIlfFQoxZ1WDgM-2e_tNThcRrnXDfvhA';

const HUBSPOT_PORTAL_ID = '20743417';
const HUBSPOT_FORM_ID   = '8ac29a68-a31f-41d4-9c5b-6c4549dd5dcf';

const ADMIN_EMAILS = [
  { name: 'Sean Schaeffer',  email: 'sean@zoomaway.com' },
  { name: 'Mike Milligan',   email: 'mike@zoomaway.com' },
  { name: 'Mike Eskuchen',   email: 'MEskuchen@zoomaway.com' },
  { name: 'Dev',             email: 'ifyougetlockedout@protonmail.com' },
];

const FROM_EMAIL = 'info@golfgraeagle.com';
const FROM_NAME  = 'GolfGraeagle.com';
const SITE_URL   = 'https://golfgraeagle.com';

// ─── Email Templates ───────────────────────────────────────

function customerEmailHtml(b: any): string {
  const courses = Array.isArray(b.coursesInterested) && b.coursesInterested.length
    ? b.coursesInterested.join(', ')
    : 'Not specified';
  const nights = b.numNights ? `${b.numNights} nights` : 'Not specified';

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your Graeagle Golf Trip Request</title></head>
<body style="margin:0;padding:0;background:#f0f8f2;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f8f2;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(26,48,32,0.10);">

  <!-- Header -->
  <tr><td style="background:#122014;padding:32px 40px;text-align:center;">
    <img src="${SITE_URL}/logo.png" alt="Graeagle Golf" style="height:64px;width:auto;margin-bottom:12px;display:block;margin:0 auto 12px;">
    <p style="color:#78c488;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;margin:8px 0 0;font-weight:600;">Golf Trip Request Received</p>
  </td></tr>

  <!-- Greeting -->
  <tr><td style="padding:36px 40px 0;">
    <h1 style="color:#122014;font-size:24px;font-weight:700;margin:0 0 12px;">Hi ${b.firstName}, we've got your request!</h1>
    <p style="color:#3d5240;font-size:15px;line-height:1.6;margin:0 0 24px;">
      One of our Graeagle golf specialists will contact you within 24 hours to build your custom stay-and-play package.
      Here's a summary of what you submitted:
    </p>
  </td></tr>

  <!-- Trip Summary -->
  <tr><td style="padding:0 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f8f2;border-radius:12px;padding:24px;border:1px solid #d4edd9;">
      <tr><td style="padding-bottom:12px;border-bottom:1px solid #d4edd9;">
        <p style="color:#3a8a48;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 4px;">Trip Details</p>
      </td></tr>
      ${row('Dates', `${b.arrivalDate} → ${b.departureDate}`)}
      ${row('Nights', nights)}
      ${row('Group Size', `${b.partySize} golfers`)}
      ${row('Total Rounds', b.totalRounds)}
      ${row('Courses Interested', courses)}
      ${row('Lodging Type', b.lodgingType || 'Not specified')}
      ${row('Dates Flexible', b.datesFlexible === 'yes' ? 'Yes' : 'No')}
      ${b.specialRequests ? row('Special Requests', b.specialRequests) : ''}
    </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="padding:32px 40px;">
    <p style="color:#3d5240;font-size:15px;margin:0 0 20px;">
      Questions in the meantime? Reply to this email or call us at <strong>+1-888-586-1157</strong>.
    </p>
    <a href="${SITE_URL}" style="display:inline-block;background:#3a8a48;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:100px;text-decoration:none;">
      View Graeagle Golf Packages →
    </a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f0f8f2;padding:24px 40px;border-top:1px solid #d4edd9;">
    <p style="color:#78c488;font-size:12px;margin:0;text-align:center;">
      GolfGraeagle.com · Operated by Zoomaway Technologies Inc. · +1-888-586-1157<br>
      <a href="${SITE_URL}" style="color:#3a8a48;text-decoration:none;">${SITE_URL}</a>
    </p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:8px 0;">
    <span style="color:#5a7c5f;font-size:13px;font-weight:600;display:inline-block;width:160px;">${label}:</span>
    <span style="color:#122014;font-size:13px;">${value}</span>
  </td></tr>`;
}

function adminEmailHtml(b: any, leadId: string): string {
  const courses = Array.isArray(b.coursesInterested) && b.coursesInterested.length
    ? b.coursesInterested.join(', ')
    : 'Not specified';

  const fields = [
    ['Name',            `${b.firstName} ${b.lastName}`],
    ['Email',           b.email],
    ['Phone',           b.phone],
    ['Address',         [b.streetAddress, b.city, b.postalCode, b.country].filter(Boolean).join(', ') || '—'],
    ['Party Size',      `${b.partySize} golfers`],
    ['Arrival',         b.arrivalDate],
    ['Departure',       b.departureDate],
    ['Nights',          b.numNights || '—'],
    ['Dates Flexible',  b.datesFlexible],
    ['Total Rounds',    b.totalRounds],
    ['Courses',         courses],
    ['Lodging Type',    b.lodgingType || '—'],
    ['Lodging Property',b.lodgingProperty || '—'],
    ['Room Config',     b.roomConfig || '—'],
    ['Ideal Tee Times', b.idealTeeTimes || '—'],
    ['Play on Arrival', b.playOnArrival],
    ['Play on Depart',  b.playOnDeparture],
    ['Transportation',  b.transportationNeeded],
    ['Special Event',   b.specialFBEvent],
    ['Event Detail',    b.fbEventWhen || '—'],
    ['How Heard',       b.howHeard || '—'],
    ['Special Requests',b.specialRequests || '—'],
    ['Lead ID',         leadId],
    ['Submitted',       new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }) + ' PT'],
  ];

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>New GGE Lead</title></head>
<body style="margin:0;padding:0;background:#f0f8f2;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f8f2;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(26,48,32,0.10);">

  <!-- Header -->
  <tr><td style="background:#122014;padding:24px 40px;">
    <img src="${SITE_URL}/logo.png" alt="Graeagle Golf" style="height:48px;width:auto;display:block;margin-bottom:8px;">
    <h2 style="color:#78c488;font-size:18px;font-weight:700;margin:0;">🏌️ New Golf Trip Lead</h2>
    <p style="color:#a8dbb5;font-size:13px;margin:4px 0 0;">${b.firstName} ${b.lastName} — Party of ${b.partySize} — ${b.arrivalDate} to ${b.departureDate}</p>
  </td></tr>

  <!-- Fields -->
  <tr><td style="padding:28px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      ${fields.map(([k, v]) => `
      <tr>
        <td style="padding:7px 0;border-bottom:1px solid #f0f8f2;width:40%;color:#5a7c5f;font-size:13px;font-weight:600;">${k}</td>
        <td style="padding:7px 0;border-bottom:1px solid #f0f8f2;color:#122014;font-size:13px;">${v}</td>
      </tr>`).join('')}
    </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="padding:0 40px 28px;">
    <a href="mailto:${b.email}?subject=Re: Your Graeagle Golf Trip Request" 
       style="display:inline-block;background:#3a8a48;color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:100px;text-decoration:none;margin-right:12px;">
      Reply to ${b.firstName} →
    </a>
    <a href="tel:${b.phone.replace(/\D/g,'')}" 
       style="display:inline-block;background:#e8a850;color:#122014;font-size:14px;font-weight:600;padding:12px 28px;border-radius:100px;text-decoration:none;">
      Call ${b.phone}
    </a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f0f8f2;padding:20px 40px;border-top:1px solid #d4edd9;">
    <p style="color:#78c488;font-size:12px;margin:0;text-align:center;">
      GolfGraeagle.com · Zoomaway Technologies Inc. · Lead ID: ${leadId}
    </p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}

// ─── Send email ───────────────────────────────────────────
async function sendEmail(to: string, toName: string, subject: string, html: string): Promise<void> {
  await sendMail({ to, toName, subject, html });
}

// ─── HubSpot Form Submission ───────────────────────────────
async function submitToHubspot(b: any): Promise<void> {
  const fields: { name: string; value: string }[] = [
    { name: 'firstname',    value: b.firstName },
    { name: 'lastname',     value: b.lastName },
    { name: 'email',        value: b.email },
    { name: 'phone',        value: b.phone },
    { name: 'num_employees', value: String(b.partySize) }, // closest HubSpot standard field for group size
    { name: 'message',      value: buildHubspotMessage(b) },
  ];

  if (b.city)    fields.push({ name: 'city',    value: b.city });
  if (b.country) fields.push({ name: 'country', value: b.country });

  const payload = {
    fields,
    context: { pageUri: 'https://golfgraeagle.com/request-a-quote', pageName: 'Request a Quote — GolfGraeagle' },
  };

  const res = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error('[hubspot] Submission failed:', err);
    // Don't throw — HubSpot failure should not block lead save
  } else {
    console.log('[hubspot] Submission success');
  }
}

function buildHubspotMessage(b: any): string {
  const courses = Array.isArray(b.coursesInterested) && b.coursesInterested.length
    ? b.coursesInterested.join(', ')
    : 'Not specified';
  return [
    `Arrival: ${b.arrivalDate}`,
    `Departure: ${b.departureDate}`,
    `Nights: ${b.numNights || 'N/A'}`,
    `Party Size: ${b.partySize}`,
    `Total Rounds: ${b.totalRounds}`,
    `Courses: ${courses}`,
    `Lodging: ${b.lodgingType || 'N/A'} — ${b.lodgingProperty || 'N/A'}`,
    `Room Config: ${b.roomConfig || 'N/A'}`,
    `Dates Flexible: ${b.datesFlexible}`,
    `Play on Arrival: ${b.playOnArrival}`,
    `Play on Departure: ${b.playOnDeparture}`,
    `Transportation: ${b.transportationNeeded}`,
    `Special Event: ${b.specialFBEvent}${b.fbEventWhen ? ' — ' + b.fbEventWhen : ''}`,
    `How Heard: ${b.howHeard || 'N/A'}`,
    `Special Requests: ${b.specialRequests || 'None'}`,
    `Source: golfgraeagle.com`,
  ].join('\n');
}

// ─── Main Handler ──────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Required field validation
    const required = ['firstName','lastName','email','phone','partySize','arrivalDate','departureDate','totalRounds'];
    for (const field of required) {
      if (!body[field]) {
        return new Response(JSON.stringify({ error: `Missing required field: ${field}` }), {
          status: 400, headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 1. Save to Supabase
    const lead = {
      first_name:             body.firstName,
      last_name:              body.lastName,
      email:                  body.email,
      phone:                  body.phone,
      street_address:         body.streetAddress        || null,
      city:                   body.city                 || null,
      postal_code:            body.postalCode           || null,
      country:                body.country              || 'United States',
      how_heard:              body.howHeard             || null,
      desired_region:         body.desiredRegion        || 'graeagle',
      party_size:             parseInt(body.partySize)  || null,
      arrival_date:           body.arrivalDate,
      departure_date:         body.departureDate,
      num_nights:             body.numNights            ? parseInt(body.numNights) : null,
      dates_flexible:         body.datesFlexible        || 'no',
      lodging_type:           body.lodgingType          || null,
      lodging_property:       body.lodgingProperty      || null,
      room_config:            body.roomConfig           || null,
      total_rounds:           parseInt(body.totalRounds)|| null,
      ideal_tee_times:        body.idealTeeTimes        || null,
      play_on_arrival:        body.playOnArrival        || 'no',
      play_on_departure:      body.playOnDeparture      || 'no',
      courses_interested:     body.coursesInterested    || [],
      transportation_needed:  body.transportationNeeded || 'no',
      special_fb_event:       body.specialFBEvent       || 'no',
      fb_event_when:          body.fbEventWhen          || null,
      special_requests:       body.specialRequests      || null,
      source:                 body.source               || 'golfgraeagle.com',
      status:                 'new',
      submitted_at:           body.submittedAt          || new Date().toISOString(),
    };

    let leadId = 'unknown';
    const supaRes = await fetch(`${SUPA_URL}/rest/v1/gg_leads`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Prefer':        'return=representation',
      },
      body: JSON.stringify(lead),
    });

    if (supaRes.ok) {
      const data = await supaRes.json();
      leadId = data[0]?.id || 'unknown';
    } else {
      const err = await supaRes.text();
      console.error('[supabase] Error:', err);
      if (!err.includes('does not exist') && !err.includes('42P01')) {
        // Real error — still continue with HubSpot + email
        console.error('[supabase] Non-table error, continuing anyway');
      }
    }

    // 2. Submit to HubSpot (fire and forget — don't block response)
    submitToHubspot(body).catch(e => console.error('[hubspot] Error:', e));

    // 3. Send customer confirmation email
    const customerSubject = `Your Graeagle Golf Trip Request — We'll be in touch within 24 hours`;
    sendEmail(body.email, `${body.firstName} ${body.lastName}`, customerSubject, customerEmailHtml(body))
      .catch(e => console.error('[email] Customer email error:', e));

    // 4. Send admin notifications to all 4
    const adminSubject = `🏌️ New GGE Lead: ${body.firstName} ${body.lastName} — ${body.partySize} golfers, ${body.arrivalDate}`;
    const adminHtml = adminEmailHtml(body, leadId);
    for (const admin of ADMIN_EMAILS) {
      sendEmail(admin.email, admin.name, adminSubject, adminHtml)
        .catch(e => console.error(`[email] Admin email error (${admin.email}):`, e));
    }

    return new Response(JSON.stringify({ success: true, id: leadId }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('[leads] Handler error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};
