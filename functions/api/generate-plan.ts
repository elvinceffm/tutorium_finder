import { AiPreferencePayload, AiPlanResponse } from '../../src/types/ai';

export interface Env {
  GROQ_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const payload: AiPreferencePayload = await context.request.json();
    const { semester, optimizationGoal, timePreference, freeformText, seminarPreference } = payload;
    
    // Check for API key
    if (!context.env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: "Groq API key not configured" }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const prompt = `Solve this academic scheduling puzzle for a political science student at TUM.
Your task is to generate 1 to 3 valid scheduling plans based on the user's constraints and the provided catalog of courses.

RULES YOU MUST FOLLOW STRICTLY:
1. Extract classes ONLY from the exact provided catalog.
2. YOU MUST ATTEND ALL COURSES. For EVERY distinct \`courseName\` in the catalog:
   - If that course has any "Vorlesung" (lecture), you MUST include exactly 1 in the plan.
   - If that course has any "Übung" (tutorial), you MUST include exactly 1 in the plan.
   - If that course has any "Seminar", you MUST include exactly 1 in the plan.
   (Do not skip any course. A single course might require you to pick both a Vorlesung AND an Übung!)
3. HARD CONSTRAINT: No selected classes can overlap in time on the same weekday. Assume all classes are 90 minutes long.
4. Soft constraint logic (try to apply these if possible without breaking rules 1-3):
   - Optimization goal: ${optimizationGoal === 'compact' ? 'Compact schedule to maximize entirely free days (no classes on those days). Stack them back-to-back if possible.' : 'Balanced schedule spread across the week to avoid too many classes on a single day.'}
   - Time preference: ${timePreference === 'morning' ? 'Prefer morning classes (before 13:00) when a choice exists.' : timePreference === 'afternoon' ? 'Prefer afternoon classes (after 13:00) when a choice exists.' : 'No strict time of day preference.'}
5. User specific requests and constraints: "${freeformText || 'None'}"
6. Seminar preference note if any: "${seminarPreference || 'None'}"

Here is the exact catalog of available classes for Semester ${semester}:
${JSON.stringify(payload.catalog)}

Solve the puzzle step by step. Write your reasoning inside <think> tags. Then, you MUST output your final answer as a raw JSON block at the very end outside the think tags. The JSON must exactly match this structure:
{
  "plans": [
    {
      "id": "plan-1",
      "reasoning": "A concise explanation of why this plan satisfies the rules.",
      "selectedIds": ["id1", "id2"]
    }
  ]
}`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.4, // Lowered slightly for strict JSON completion, but high enough to reason
      })
    });

    if (!groqResponse.ok) {
      const err = await groqResponse.text();
      throw new Error(`Groq API Error: ${err}`);
    }

    const data = await groqResponse.json();
    let content = data.choices[0].message.content;

    // Reasoning models like DeepSeek embed their thoughts in <think> tags.
    // We need to strip those out to extract the pure JSON block.
    content = content.replace(/<think>[\s\S]*?<\/think>/g, '');
    
    // Also strip out any markdown json wrappers the model might add 
    const jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      content = jsonMatch[1];
    } else {
      // rough fallback if it doesn't use codeblocks
      const rawMatch = content.match(/(\{[\s\S]*"plans"[\s\S]*\})/);
      if (rawMatch) {
         content = rawMatch[1];
      }
    }

    return new Response(content, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: unknown) {
    const err = error as Error;
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};