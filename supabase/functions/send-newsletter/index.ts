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

// ── Load and build the email template ──
async function buildEmailTemplate(article: any, subscriberEmail: string): Promise<string> {
  // Load the template from the file system
  const templatePath = new URL('../_includes/email-template.html', import.meta.url);
  let template = await Deno.readTextFile(templatePath);

  // Replace placeholders
  template = template
    .replace(/\{\{ article.title \}\}/g, article.title || '')
    .replace(/\{\{ article.category \}\}/g, article.category || 'Analysis')
    .replace(/\{\{ article.date \}\}/g, article.date ? new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '')
    .replace(/\{\{ article.excerpt \}\}/g, article.excerpt || article.content?.substring(0, 250) + '...' || '')
    .replace(/\{\{ article.url \}\}/g, article.url || '')
    .replace(/\{\{ article.substack_url \}\}/g, article.substack_url || '#')
    .replace(/\{\{ email \}\}/g, subscriberEmail);

  return template;
}

// ── Main Handler ──
Deno.serve(async (req) => {
  try {
    // 1. Get the article data and optional test email
    const { article, testEmail } = await req.json();

    if (!article || !article.title) {
      throw new Error('Article data is required');
    }

    // 2. Fetch subscribers (filter by testEmail if provided)
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

    // 3. Build the email content
    const subject = `[New Article] ${article.title} – The Naija Marxists`;

    // 4. Send emails in parallel
    const promises = subscribers.map(sub => {
      return buildEmailTemplate(article, sub.email)
        .then(html => sendEmail(sub.email, subject, html));
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