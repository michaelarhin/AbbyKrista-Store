import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { phone, message } = await req.json();

    console.log('send-sms called with phone:', phone);

    if (!phone || !message) {
      return new Response(
        JSON.stringify({ error: 'phone and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('ARKESEL_API_KEY');
    const senderId = Deno.env.get('ARKESEL_SENDER_ID') || 'AbbyKrista';

    console.log('API key present:', !!apiKey, 'Sender ID:', senderId);

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'ARKESEL_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalise phone number to E.164 (Ghana: 0XXXXXXXXX → 233XXXXXXXXX)
    const normalised = phone.replace(/\s+/g, '').replace(/^\+/, '');
    const e164 = normalised.startsWith('0') ? `233${normalised.slice(1)}` : normalised;

    console.log('Sending SMS to:', e164);

    // Arkesel v2 API
    const arkeselRes = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: senderId,
        message,
        recipients: [e164],
      }),
    });

    const result = await arkeselRes.json();
    console.log('Arkesel response:', JSON.stringify(result));

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
