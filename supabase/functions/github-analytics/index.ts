// supabase/functions/github-analytics/index.ts

const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN');
const REPO = 'NaijaMarxistTech/website';

Deno.serve(async (req) => {
  // ── CORS Preflight ──
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // ── Only allow GET ──
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  // ── Check for GitHub token ──
  if (!GITHUB_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'GitHub token not configured' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  try {
    // ── Fetch traffic data ──
    const [viewsRes, clonesRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${REPO}/traffic/views`, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }),
      fetch(`https://api.github.com/repos/${REPO}/traffic/clones`, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }),
    ]);

    const views = viewsRes.ok ? await viewsRes.json() : { count: 0, uniques: 0 };
    const clones = clonesRes.ok ? await clonesRes.json() : { count: 0, uniques: 0 };

    return new Response(
      JSON.stringify({ views, clones }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});