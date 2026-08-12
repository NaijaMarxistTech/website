// supabase/functions/verify-admin-password/index.ts
// Use the official CORS headers from the Supabase SDK for compatibility[reference:5][reference:6]
import { corsHeaders } from 'npm:@supabase/supabase-js@^2/cors';

const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD');

// Helper to create a JSON response with CORS headers
function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  // 1. Handle the CORS preflight OPTIONS request[reference:7][reference:8]
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // 2. Handle POST requests
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { password } = body;

      if (!password) {
        return jsonResponse({ valid: false, error: 'Password required' }, 400);
      }

      const isValid = password === ADMIN_PASSWORD;
      return jsonResponse({ valid: isValid });
    } catch (error) {
      return jsonResponse({ valid: false, error: error.message }, 500);
    }
  }

  // 3. Handle any other request method
  return jsonResponse({ error: 'Method not allowed' }, 405);
});