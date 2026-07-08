// supabase/functions/classify-applicant/index.ts
// AI Classification for The Naija Marxists – with majority voting

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ── ENVIRONMENT VARIABLES ──
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY is required');
if (!SUPABASE_URL) throw new Error('SUPABASE_URL is required');
if (!SUPABASE_ANON_KEY) throw new Error('SUPABASE_ANON_KEY is required');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── PROMPT BUILDER ──
function buildPrompt(record: any): string {
  return `
You are a Marxist educator. Classify this applicant based on their answers.

EVALUATION CRITERIA:
Q1 (Marxist familiarity): Look for core concepts (class struggle, historical materialism, exploitation).
Q2 (Class definition): Look for "means of production", "exploitation", "bourgeoisie/proletariat".
Q3 (Class conflict + Nigeria): Look for application of class struggle to Nigerian context.
Q4 (Class vs tribalism/religion): Look for argument that class struggle is primary.
Q5 (Capitalism vs Socialism): Look for "means of production" ownership distinction.
Q6 (Pan-Africanism vs Marxism): Look for differentiation between the two.
Q7 (Nigerian democracy): Look for "NO" + class-based critique.
Q8 (Revolution definition): Look for "transformation of mode of production".
Q9 (Socialist revolution today): Look for sophisticated argument.
Q10 (Why join): Personal motivation (less determining).

CLASSIFICATION LEVELS:
- BEGINNER: Limited understanding, vague definitions, no theoretical grounding.
- INTERMEDIATE: Demonstrates understanding of core concepts, can apply to Nigerian context.
- ADVANCED: Sophisticated understanding, uses precise terminology, shows dialectical thinking.

Applicant answers:
Q1: ${record.q1_marxist_familiarity || '[No answer]'}
Q2: ${record.q2_class_definition || '[No answer]'}
Q3: ${record.q3_class_conflict_revolution || '[No answer]'}
Q4: ${record.q4_primary_class_struggle || '[No answer]'}
Q5: ${record.q5_capitalism_vs_socialism || '[No answer]'}
Q6: ${record.q6_pan_africanism_vs_marxism || '[No answer]'}
Q7: ${record.q7_nigerian_democracy || '[No answer]'}
Q8: ${record.q8_revolution_definition || '[No answer]'}
Q9: ${record.q9_socialist_revolutions_today || '[No answer]'}
Q10: ${record.q10_why_join_contribution || '[No answer]'}

CRITICAL INSTRUCTION:
You MUST respond with ONLY a valid JSON object. No explanations, no markdown, no thinking process.
The JSON must have exactly two keys: "level" and "reasoning".
{
  "level": "beginner" or "intermediate" or "advanced",
  "reasoning": "Brief explanation (max 20 words)"
}
`;
}

// ── SCORE MAPPING ──
function getScore(level: string): number {
  const scores: Record<string, number> = { beginner: 5, intermediate: 12, advanced: 18 };
  return scores[level] || 0;
}

// ── PARSE GROQ RESPONSE ──
function parseGroqResponse(content: string): { level: string; reasoning: string | null } {
  // Strip any thinking content
  const strippedContent = content
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/<think>[\s\S]*$/g, '')
    .trim();

  // Find JSON
  const start = strippedContent.indexOf('{');
  const end = strippedContent.lastIndexOf('}');

  if (start !== -1 && end !== -1 && end > start) {
    const jsonString = strippedContent.substring(start, end + 1);
    console.log('📝 Extracted JSON:', jsonString);

    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.level && ['beginner', 'intermediate', 'advanced'].includes(parsed.level)) {
        const level = parsed.level;
        const reasoning = parsed.reasoning || null;
        return { level, reasoning };
      }
    } catch (_) {
      // JSON parsing failed – fallback to text extraction
    }
  }

  // Fallback: extract from plain text
  let level = 'beginner';
  let reasoning: string | null = null;

  const lower = strippedContent.toLowerCase();
  if (lower.includes('intermediate')) level = 'intermediate';
  else if (lower.includes('advanced')) level = 'advanced';
  else if (lower.includes('beginner')) level = 'beginner';

  if (strippedContent.length > 0) {
    reasoning = strippedContent.substring(0, 200) + (strippedContent.length > 200 ? '...' : '');
  }

  return { level, reasoning };
}

// ── MAJORITY VOTE ──
function majorityVote(levels: string[]): string {
  const counts: Record<string, number> = {};
  for (const level of levels) {
    counts[level] = (counts[level] || 0) + 1;
  }

  let maxCount = 0;
  let winner = 'beginner';
  for (const [level, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      winner = level;
    }
  }

  return winner;
}

// ── CLASSIFY APPLICANT (Single Evaluation) ──
async function classifyApplicant(prompt: string): Promise<{ level: string; reasoning: string | null }> {
  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen/qwen3.6-27b',
      messages: [
        { role: 'system', content: 'You are a strict JSON generator. Always respond with ONLY valid JSON. Never include any other text.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 150,
      reasoning_effort: 'none',
      reasoning_format: 'hidden'
    })
  });

  if (!groqResponse.ok) {
    const errorText = await groqResponse.text();
    throw new Error(`Groq API error (${groqResponse.status}): ${errorText}`);
  }

  const groqData = await groqResponse.json();
  const content = groqData.choices[0].message.content.trim();
  return parseGroqResponse(content);
}

// ── MAIN HANDLER ──
Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { record } = body;

    if (!record || !record.id) {
      return new Response(
        JSON.stringify({ error: 'No record provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📝 Processing applicant: ${record.id} (${record.first_name || 'Unknown'})`);

    const prompt = buildPrompt(record);
    console.log('🤖 Calling Groq API (3 evaluations for consistency)...');

    // ── Run 3 evaluations ──
    const evaluations = [];
    for (let i = 0; i < 3; i++) {
      try {
        const result = await classifyApplicant(prompt);
        evaluations.push(result);
        console.log(`📊 Evaluation ${i + 1}: ${result.level}${result.reasoning ? ` - ${result.reasoning}` : ''}`);
      } catch (error) {
        console.error(`⚠️ Evaluation ${i + 1} failed:`, error.message);
        // If one fails, use fallback
        evaluations.push({ level: 'beginner', reasoning: null });
      }
    }

    // ── Majority vote ──
    const levels = evaluations.map(e => e.level);
    const finalLevel = majorityVote(levels);

    // ── Get reasoning from the majority winner ──
    const winnerEval = evaluations.find(e => e.level === finalLevel);
    const reasoning = winnerEval?.reasoning || evaluations[0]?.reasoning || null;

    const score = getScore(finalLevel);

    console.log(`📊 Final classification: ${finalLevel} (score: ${score})`);
    console.log(`📊 Individual evaluations: ${levels.join(', ')}`);
    if (reasoning) console.log(`📝 Reasoning: ${reasoning}`);

    // ── Insert into members_classified ──
    const { error: insertError } = await supabase
      .from('members_classified')
      .insert({
        id: record.id,
        first_name: record.first_name,
        last_name: record.last_name,
        gender: record.gender,
        email: record.email,
        telegram_username: record.telegram_username,
        resident_in_nigeria: record.resident_in_nigeria,
        location: record.location,
        profession: record.profession,
        primary_skill: record.primary_skill,
        social_handles: record.social_handles,
        q1_marxist_familiarity: record.q1_marxist_familiarity,
        q2_class_definition: record.q2_class_definition,
        q3_class_conflict_revolution: record.q3_class_conflict_revolution,
        q4_primary_class_struggle: record.q4_primary_class_struggle,
        q5_capitalism_vs_socialism: record.q5_capitalism_vs_socialism,
        q6_pan_africanism_vs_marxism: record.q6_pan_africanism_vs_marxism,
        q7_nigerian_democracy: record.q7_nigerian_democracy,
        q8_revolution_definition: record.q8_revolution_definition,
        q9_socialist_revolutions_today: record.q9_socialist_revolutions_today,
        q10_why_join_contribution: record.q10_why_join_contribution,
        score: score,
        level: finalLevel,
        classification_reasoning: reasoning,
        original_created_at: record.created_at,
        processed: true
      });

    if (insertError) {
      throw new Error(`Insert failed: ${insertError.message}`);
    }

    console.log(`✅ Classified ${record.id} as ${finalLevel}`);

    return new Response(
      JSON.stringify({ success: true, level: finalLevel, score, reasoning, evaluations: levels }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});