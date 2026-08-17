// supabase/functions/_shared/email-sender.ts
// Email sending logic — imports templates from email-templates.ts

import { Resend } from 'npm:resend@2.0.0';
import { AUTO_REPLY_TEMPLATE, TEAM_NOTIFICATION_TEMPLATE } from './email-templates.ts';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const DOMAIN = 'thenaijamarxists.org';
const TEAM_EMAIL = Deno.env.get('TEAM_EMAIL') || 'contact@thenaijamarxists.org';

export async function sendAutoReply(record: any): Promise<void> {
  await resend.emails.send({
    from: `The Naija Marxists <membership@${DOMAIN}>`,
    to: [record.email],
    subject: 'Thank you for applying to join The Naija Marxists',
    html: AUTO_REPLY_TEMPLATE(record),
  });
  console.log(`✅ Auto-reply sent to: ${record.email}`);
}

export async function sendTeamNotification(record: any, classification: { level: string; reasoning: string | null }): Promise<void> {
  await resend.emails.send({
    from: `Membership <membership@${DOMAIN}>`,
    to: [TEAM_EMAIL],
    subject: `🔴 New Member: ${record.first_name} ${record.last_name} [${classification.level}]`,
    html: TEAM_NOTIFICATION_TEMPLATE(record, classification),
  });
  console.log(`✅ Team notification sent to: ${TEAM_EMAIL}`);
}