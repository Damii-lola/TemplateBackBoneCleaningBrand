/**
 * Supabase Edge Function: send-booking-emails
 *
 * Sends:
 *  1) Alert email to the brand
 *  2) Confirmation email to the client
 *
 * Uses Gmail SMTP via app password.
 *
 * ⚠️ SECRETS (set in Supabase Dashboard → Edge Functions → Secrets):
 *    GMAIL_USER=your@gmail.com
 *    GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
 *
 * ⚠️ WHEN INTEGRATING A REAL BRAND:
 *    - brandEmail comes from the request (from js/supabase-config.js)
 *    - GMAIL_USER is YOUR sending account (can be same Gmail for all brands
 *      if you want, or a dedicated one)
 *    - Never put Gmail app password in frontend / GitHub files
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingPayload {
  brandName: string;
  brandEmail: string;
  brandType?: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  propertyType?: string;
  bedrooms?: string;
  bathrooms?: string;
  extras?: string;
  preferredDate?: string;
  preferredTime?: string;
  frequency?: string;
  address?: string;
  instructions?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const gmailUser = Deno.env.get('GMAIL_USER');
    const gmailPass = Deno.env.get('GMAIL_APP_PASSWORD');

    if (!gmailUser || !gmailPass) {
      return new Response(
        JSON.stringify({ error: 'Gmail secrets not configured (GMAIL_USER / GMAIL_APP_PASSWORD)' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: BookingPayload = await req.json();

    if (!body.email || !body.fullName || !body.brandEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const brandName = body.brandName || 'Cleaning Brand';

    const detailsBlock = `
Service: ${body.service || '—'}
Property: ${body.propertyType || '—'}
Bedrooms: ${body.bedrooms || '—'}  Bathrooms: ${body.bathrooms || '—'}
Extras: ${body.extras || 'None'}
Date: ${body.preferredDate || '—'}  Time: ${body.preferredTime || '—'}
Frequency: ${body.frequency || '—'}
Address: ${body.address || '—'}
Instructions: ${body.instructions || 'None'}

Customer: ${body.fullName}
Email: ${body.email}
Phone: ${body.phone}
`.trim();

    const client = new SMTPClient({
      connection: {
        hostname: 'smtp.gmail.com',
        port: 465,
        tls: true,
        auth: {
          username: gmailUser,
          password: gmailPass,
        },
      },
    });

    // 1) Email to brand
    await client.send({
      from: gmailUser,
      to: body.brandEmail,
      subject: `New booking request — ${body.fullName} (${brandName})`,
      content: `New booking request for ${brandName}\n\n${detailsBlock}\n\n— Sent automatically from your booking form`,
    });

    // 2) Confirmation to client
    await client.send({
      from: gmailUser,
      to: body.email,
      subject: `We received your booking request — ${brandName}`,
      content: `Hi ${body.fullName},\n\nThank you for booking with ${brandName}.\nWe've received your request and will contact you shortly to confirm.\n\nSummary:\n${detailsBlock}\n\nIf you need to change anything, reply to this email or call us.\n\n— ${brandName}`,
    });

    await client.close();

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
