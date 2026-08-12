// supabase/functions/verify-admin-password/index.ts

const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD');

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Password required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isValid = password === ADMIN_PASSWORD;

    return new Response(
      JSON.stringify({ valid: isValid }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});