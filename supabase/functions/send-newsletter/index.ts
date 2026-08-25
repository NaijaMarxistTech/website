// supabase/functions/send-newsletter/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ── Environment Variables ──
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is required');
if (!SUPABASE_URL) throw new Error('SUPABASE_URL is required');
if (!SUPABASE_ANON_KEY) throw new Error('SUPABASE_ANON_KEY is required');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Send email via Resend API ──
async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'The Naija Marxists <notifications@thenaijamarxists.org>',
      to: [to],
      subject: subject,
      html: html
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return response.json();
}

// ── Clean text to handle special characters ──
function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/�/g, 'é')
    .replace(/�/g, 'è')
    .replace(/�/g, 'É')
    .replace(/�/g, 'È')
    .replace(/�/g, 'ç')
    .replace(/�/g, 'Ç')
    .replace(/�/g, 'à')
    .replace(/�/g, 'À')
    .replace(/�/g, 'ô')
    .replace(/�/g, 'Ô')
    .replace(/�/g, 'ê')
    .replace(/�/g, 'Ê')
    .replace(/�/g, 'ï')
    .replace(/�/g, 'Ï')
    .replace(/�/g, 'û')
    .replace(/�/g, 'Û')
    .replace(/�/g, 'î')
    .replace(/�/g, 'Î');
}

// ── Build the email HTML (inline template) ──
function buildEmailTemplate(article: any, subscriberEmail: string): string {
  // Clean the article data
  const title = cleanText(article.title || '');
  const category = cleanText(article.category || 'Analysis');
  const excerpt = cleanText(article.excerpt || (article.content ? article.content.substring(0, 250) + '...' : ''));
  const date = article.date ? new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const slug = article.slug || '';
  const pdfUrl = `https://thenaijamarxists.org/assets/pdfs/${slug}.pdf`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} – The Naija Marxists</title>
  <style>
    /* ── Reset & Base ── */
    body, table, td, p, a, div, span {
      margin: 0;
      padding: 0;
      border: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1a1a1a;
    }
    body { background-color: #f4f0ec; padding: 20px 0; }
    .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }

    /* ── Header ── */
    .email-header {
      background: #1E1E2A;
      padding: 24px 30px;
      text-align: center;
      border-bottom: 4px solid #C62828;
    }
    .email-header .header-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .email-header .logo {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .email-header h1 {
      color: #ffffff;
      font-size: 22px;
      font-weight: 700;
      margin: 0;
      font-family: 'Oswald', 'Inter', sans-serif;
      letter-spacing: 0.02em;
    }
    .email-header .tagline {
      color: #F5B041;
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-top: 4px;
      font-family: 'DM Mono', 'Courier New', monospace;
    }

    /* ── Body ── */
    .email-body { padding: 30px 30px 20px; }
    .email-body h2 {
      font-size: 24px;
      font-weight: 700;
      color: #1E1E2A;
      margin-bottom: 10px;
      line-height: 1.3;
      font-family: 'Oswald', 'Inter', sans-serif;
    }
    .email-body .meta {
      font-size: 13px;
      color: #C62828;
      font-family: 'DM Mono', 'Courier New', monospace;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 18px;
      border-bottom: 1px solid #f0e8e0;
      padding-bottom: 12px;
    }
    .email-body .summary {
      font-size: 16px;
      line-height: 1.7;
      color: #1a1a1a;
      margin-bottom: 20px;
      font-family: 'Inter', sans-serif;
    }
    .btn-container { text-align: center; margin: 24px 0 16px; }
    .btn {
      display: inline-block;
      background: #C62828;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.05em;
      transition: background 0.2s;
      font-family: 'Inter', sans-serif;
    }
    .btn:hover { background: #8B1A1A; }

    .link-row {
      text-align: center;
      margin: 16px 0 20px;
      padding: 12px 0;
      border-top: 1px solid #f0e8e0;
      border-bottom: 1px solid #f0e8e0;
    }
    .link-row a {
      display: inline-block;
      color: #C62828;
      text-decoration: none;
      font-size: 14px;
      padding: 4px 12px;
      border-radius: 4px;
      transition: background 0.2s;
      font-family: 'Inter', sans-serif;
    }
    .link-row a:hover { background: #f5e8e8; text-decoration: underline; }
    .link-row .separator { color: #ddd; font-size: 14px; font-weight: 300; }

    .social-links {
      text-align: center;
      padding: 16px 0 8px;
      border-top: 1px solid #f0e8e0;
      margin-top: 8px;
    }
    .social-links span {
      color: #888;
      font-size: 13px;
      font-family: 'Inter', sans-serif;
    }
    .social-links a {
      display: inline-block;
      margin: 0 8px;
      color: #1E1E2A;
      text-decoration: none;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      transition: color 0.2s;
    }
    .social-links a:hover { color: #C62828; }

    .email-footer {
      background: #f8f4f0;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #e8e0d8;
    }
    .email-footer p {
      font-size: 12px;
      color: #888;
      margin-bottom: 6px;
      font-family: 'Inter', sans-serif;
    }
    .email-footer a {
      color: #C62828;
      text-decoration: underline;
      font-size: 12px;
    }
    .email-footer a:hover { color: #8B1A1A; }
    .unsubscribe-link { font-size: 11px; color: #aaa; }
    .unsubscribe-link a { color: #aaa; text-decoration: underline; }
    .unsubscribe-link a:hover { color: #C62828; }

    @media only screen and (max-width: 480px) {
      .email-body { padding: 20px 18px; }
      .email-header { padding: 18px 20px; }
      .email-header h1 { font-size: 18px; }
      .email-body h2 { font-size: 20px; }
      .btn { display: block; padding: 14px 20px; font-size: 14px; }
      .link-row a { display: block; padding: 6px 0; }
      .link-row .separator { display: none; }
      .social-links a { margin: 0 6px; font-size: 13px; }
    }
  </style>
</head>
<body>
<table class="email-container" align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
  <tr><td>
    <div class="email-header">
      <div class="header-inner">
        <img src="https://thenaijamarxists.org/assets/logo_.jpg" alt="The Naija Marxists" class="logo">
        <div>
          <h1>The Naija Marxists</h1>
          <div class="tagline">Marxist Theory • Class Struggle • Nigerian Liberation</div>
        </div>
      </div>
    </div>
    <div class="email-body">
      <h2>${title}</h2>
      <div class="meta">${category} &middot; ${date}</div>
      <div class="summary">${excerpt}</div>
      <div class="btn-container">
        <a href="${article.url || '#'}" class="btn">Read the full article →</a>
      </div>
      <div class="link-row">
        <a href="${article.url || '#'}">📖 Read on our website</a>
        <span class="separator">|</span>
        <a href="${article.substack_url || '#'}">📬 Read on Substack</a>
        <span class="separator">|</span>
        <a href="${pdfUrl}">📄 Download as PDF</a>
      </div>
      <div class="social-links">
        <span>Follow us:</span>
        <a href="https://twitter.com/ngnmarxists">Twitter/X</a>
        <a href="https://instagram.com/ngnmarxists">Instagram</a>
        <a href="https://facebook.com/ngnmarxists">Facebook</a>
        <a href="https://ngnmarxists.substack.com/">Substack</a>
      </div>
    </div>
    <div class="email-footer">
      <p>You received this email because you subscribed to The Naija Marxists mailing list.</p>
      <p class="unsubscribe-link">
        <a href="https://thenaijamarxists.org/unsubscribe?email=${subscriberEmail}">Unsubscribe</a> &middot;
        <a href="https://thenaijamarxists.org/privacy">Privacy Policy</a>
      </p>
      <p style="font-size:11px; color:#bbb; margin-top:8px;">
        &copy; ${new Date().getFullYear()} The Naija Marxists &middot; Workers of all countries, unite.
      </p>
    </div>
  </td></tr>
</table>
</body>
</html>
  `;
}

// ── Main Handler ──
Deno.serve(async (req) => {
  try {
    const { article, testEmail } = await req.json();

    if (!article || !article.title) {
      throw new Error('Article data is required');
    }

    // ── Clean the title for the subject line ──
    const cleanedTitle = cleanText(article.title);
    const subject = `[New Article] ${cleanedTitle} – The Naija Marxists`;

    let query = supabase
      .from('mailing_list')
      .select('email, first_name')
      .eq('subscribed', true);

    if (testEmail) {
      query = query.eq('email', testEmail);
    }

    const { data: subscribers, error } = await query;

    if (error) throw error;

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: testEmail ? `No subscriber with email: ${testEmail}` : 'No active subscribers'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const promises = subscribers.map(sub => {
      const html = buildEmailTemplate(article, sub.email);
      return sendEmail(sub.email, subject, html);
    });

    const results = await Promise.allSettled(promises);

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return new Response(
      JSON.stringify({
        success: true,
        sent: successful,
        failed: failed,
        total: subscribers.length,
        testMode: testEmail ? true : false,
        testEmail: testEmail || null
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});