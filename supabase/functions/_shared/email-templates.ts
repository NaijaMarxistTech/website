// supabase/functions/_shared/email-templates.ts
// HTML email templates — no logic, just strings.

export const AUTO_REPLY_TEMPLATE = (record: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Thank you for applying</title>
  <style>
    body { font-family: 'Georgia', serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f8ff; }
    .header { border-bottom: 3px solid #C62828; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { color: #C62828; font-family: 'Playfair Display', Georgia, serif; font-size: 1.8rem; margin: 0; }
    .content { background: #ffffff; padding: 24px; border-radius: 4px; border-left: 4px solid #2E7D32; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #EDE8DC; text-align: center; font-size: 0.8rem; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>✓ Application Received</h1>
  </div>
  <div class="content">
    <p>Dear <strong>${record.first_name} ${record.last_name}</strong>,</p>
    <p>Thank you for applying to join <strong>The Naija Marxists</strong>.</p>
    <p>Your application has been received and will be reviewed by our membership committee. A comrade will contact you within <strong>48 hours</strong> to discuss the next steps.</p>
    <p>In the meantime, we encourage you to:</p>
    <ul>
      <li>Follow us on social media for updates</li>
      <li>Read our analysis and statements on the website</li>
      <li>Share this movement with fellow workers</li>
    </ul>
    <p style="margin-top: 16px;">In solidarity,</p>
    <p><strong>The Naija Marxists</strong></p>
  </div>
  <div class="footer">
    <p>The Naija Marxists — Workers of all countries, unite! ✊🏿</p>
  </div>
</body>
</html>
`;

export const TEAM_NOTIFICATION_TEMPLATE = (record: any, classification: { level: string; reasoning: string | null }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Member Application</title>
  <style>
    body { font-family: 'Georgia', serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f8ff; }
    .header { border-bottom: 3px solid #C62828; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { color: #C62828; font-family: 'Playfair Display', Georgia, serif; font-size: 1.8rem; margin: 0; }
    .field { margin-bottom: 12px; padding: 8px 12px; background: #f5f0e8; border-radius: 4px; }
    .field-label { font-weight: bold; color: #C62828; font-size: 0.75rem; text-transform: uppercase; font-family: monospace; }
    .field-value { margin-top: 4px; }
    .classification-box { background: #1E1E2A; color: #fff; padding: 12px 16px; border-radius: 4px; margin: 12px 0; border-left: 4px solid #F5B041; }
    .classification-box .level { font-size: 1.2rem; font-weight: bold; color: #F5B041; text-transform: uppercase; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #EDE8DC; text-align: center; font-size: 0.8rem; color: #666; }
    .btn { display: inline-block; background: #C62828; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔴 New Member Application</h1>
  </div>
  
  <p><strong>${record.first_name} ${record.last_name}</strong> has applied to join The Naija Marxists.</p>
  
  <div class="classification-box">
    <div class="level">📊 Classification: ${classification.level.toUpperCase()}</div>
    ${classification.reasoning ? `<div style="margin-top: 6px; font-size: 0.9rem; opacity: 0.9;">${classification.reasoning}</div>` : ''}
  </div>
  
  <div class="field">
    <div class="field-label">Name</div>
    <div class="field-value">${record.first_name} ${record.last_name}</div>
  </div>
  <div class="field">
    <div class="field-label">Email</div>
    <div class="field-value"><a href="mailto:${record.email}">${record.email}</a></div>
  </div>
  <div class="field">
    <div class="field-label">Telegram</div>
    <div class="field-value">${record.telegram_username || 'Not provided'}</div>
  </div>
  <div class="field">
    <div class="field-label">Location</div>
    <div class="field-value">${record.location}</div>
  </div>
  <div class="field">
    <div class="field-label">Profession</div>
    <div class="field-value">${record.profession}</div>
  </div>
  <div class="field">
    <div class="field-label">Skills</div>
    <div class="field-value">${Array.isArray(record.primary_skill) ? record.primary_skill.join(', ') : record.primary_skill}</div>
  </div>
  
  <hr>
  
  <h3>Key Political Responses</h3>
  
  <div class="field">
    <div class="field-label">Q1: Understanding of Marxism</div>
    <div class="field-value">${(record.q1_marxist_familiarity || '').substring(0, 200)}${(record.q1_marxist_familiarity || '').length > 200 ? '...' : ''}</div>
  </div>
  <div class="field">
    <div class="field-label">Q2: Understanding of "Class"</div>
    <div class="field-value">${(record.q2_class_definition || '').substring(0, 200)}${(record.q2_class_definition || '').length > 200 ? '...' : ''}</div>
  </div>
  <div class="field">
    <div class="field-label">Q10: Why join?</div>
    <div class="field-value">${(record.q10_why_join_contribution || '').substring(0, 200)}${(record.q10_why_join_contribution || '').length > 200 ? '...' : ''}</div>
  </div>
  
  <hr>
  
  <p>
    <a href="https://supabase.com/dashboard/project/pcpntpuujhrvbffgpixs/editor/members" class="btn">📊 View All Applications</a>
  </p>
  <p>
    <a href="mailto:${record.email}" style="color: #C62828;">📧 Reply to ${record.first_name}</a>
  </p>
  
  <div class="footer">
    <p>The Naija Marxists — Workers of all countries, unite! ✊🏿</p>
  </div>
</body>
</html>
`;