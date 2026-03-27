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

    // Dynamic prompt formulation
    const systemPrompt = `You are a highly capable academic scheduling assistant for a political science student at TUM (Technical University of Munich).
Your task is to generate 1 to 3 valid scheduling plans based on the user's constraints and the provided catalog of courses.

RULES:
1. Extract classes only from the exact provided catalog.
2. For each distinct \`courseName\`:
   - You MUST select exactly 1 Vorlesung (lecture) if one exists.
   - You MUST select exactly 1 Übung (tutorial) if one exists.
   - You MUST select exactly 1 Seminar if one exists. (If there are multiple seminars for the same course, pick the one preferred by the user, or pick the best fit).
3. Hard constraint: Ensure no selected classes overlap in their active time. Assume classes are 90 minutes.
4. Soft constraint logic:
   - Optimization goal: ${optimizationGoal === 'compact' ? 'Compact schedule to maximize entirely free days (no classes on those days). Stack them back-to-back if possible.' : 'Balanced schedule spread across the week to avoid too many classes on a single day.'}
   - Time preference: ${timePreference === 'morning' ? 'Prefer morning classes (before 13:00) when a choice exists.' : timePreference === 'afternoon' ? 'Prefer afternoon classes (after 13:00) when a choice exists.' : 'No strict time of day preference.'}
5. User specific requests and constraints: "${freeformText || 'None'}"
6. Seminar preference note if any: "${seminarPreference || 'None'}"

You must respond STRICLY in the following JSON format. NO extra conversational text, just valid JSON:
{
  "plans": [
    {
      "id": "plan-1",
      "reasoning": "A short, concise human-readable explanation of why you chose these specific groups to fulfill the user's constraints.",
      "selectedIds": ["id1", "id2", ...]
    }
  ]
}
If the constraints are very tight, return 1 plan. If there are multiple viable ways to arrange it, return up to 3 plans.
`;

    const url = new URL(context.request.url);
    const origin = url.origin;
    
    // We cannot reliably import from src/data due to how Pages Functions are built separately in some setups,
    // but typically we can. Let's instead expect the client to send the catalog, OR since catalog is tiny, we can import it if the bundler supports it.
    // However, sending it from the client is safer to avoid any bundler import path issues in CF Pages. Let's update `AiPreferencePayload` to include `catalog`.
    
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Semester: ${semester}\nCatalog:\n${JSON.stringify(payload.catalog)}` }
        ],
        temperature: 0.2, // Low temperature for more logical/strict parsing
        response_format: { type: 'json_object' }
      })
    });

    if (!groqResponse.ok) {
      const err = await groqResponse.text();
      throw new Error(`Groq API Error: ${err}`);
    }

    const data = await groqResponse.json();
    const content = data.choices[0].message.content;

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