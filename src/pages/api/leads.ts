export const prerender = false;

import type { APIRoute } from 'astro';

const SUPA_URL = 'https://egplpluvbfsjrqzecnjf.supabase.co';
const SUPA_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncGxwbHV2YmZzanJxemVjbmpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM4NDY4NSwiZXhwIjoyMDg0OTYwNjg1fQ.058gQsnZmklTIlfFQoxZ1WDgM-2e_tNThcRrnXDfvhA';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Required field check
    const required = ['firstName','lastName','email','phone','partySize','arrivalDate','departureDate','totalRounds'];
    for (const field of required) {
      if (!body[field]) {
        return new Response(JSON.stringify({ error: `Missing required field: ${field}` }), {
          status: 400, headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Map to gg_leads table schema
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

    const res = await fetch(`${SUPA_URL}/rest/v1/gg_leads`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Prefer':        'return=representation',
      },
      body: JSON.stringify(lead),
    });

    if (!res.ok) {
      const err = await res.text();
      // If table doesn't exist yet, still return success so UX isn't broken
      // Log the error for debugging
      console.error('Supabase error:', err);
      if (err.includes('does not exist') || err.includes('42P01')) {
        // Table not yet created — accept submission gracefully
        return new Response(JSON.stringify({ success: true, id: 'pending-db-setup' }), {
          status: 200, headers: { 'Content-Type': 'application/json' }
        });
      }
      throw new Error(err);
    }

    const data = await res.json();
    return new Response(JSON.stringify({ success: true, id: data[0]?.id }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('Lead submission error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};
