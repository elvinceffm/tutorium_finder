import { AiPreferencePayload, AiPlanResponse } from '../../src/types/ai';

export interface Env {
  GROQ_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const payload: AiPreferencePayload = await context.request.json();
    const { semester, optimizationGoal, timePreference, freeformText, seminarPreference, catalog } = payload;
    
    // Check for API key
    if (!context.env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: "Groq API key not configured" }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Group catalog by courseName then type
    const groupedCatalog: Record<string, Record<string, any[]>> = {};

    for (const c of catalog) {
      if (!groupedCatalog[c.courseName]) {
        groupedCatalog[c.courseName] = {};
      }
      if (!groupedCatalog[c.courseName][c.type]) {
        groupedCatalog[c.courseName][c.type] = [];
      }
      groupedCatalog[c.courseName][c.type].push({
        id: c.id,
        weekday: c.weekday,
        time: c.time,
        instructor: c.instructor,
      });
    }

    const payloadJsonStr = JSON.stringify(groupedCatalog, null, 2);

    const prompt = `Solve this academic scheduling puzzle for a political science student at TUM by selecting the best schedule.

Here is the provided catalog, structured by Course, then by Type:
${payloadJsonStr}

HARD CONSTRAINTS (YOU MUST ENFORCE THESE):
1. For EVERY Course in the catalog, you MUST select EXACTLY ONE class ID from EACH AND EVERY available Type.
   Example: If a course has a "Vorlesung" group and an "Übung" group, you MUST select one ID from the "Vorlesung" array, AND one ID from the "Übung" array. Do not miss any type for any course.
2. The classes you select must ABSOLUTELY NOT overlap in time with each other. A schedule with overlapping classes is INVALID. Pay close attention to the days and time blocks.
3. If the "Freeform requests" contain exact times where the user is busy, you MUST treat those as HARD CONSTRAINTS. Do not schedule any classes during those blocked times.

User Soft Preferences:
- Optimization goal: ${optimizationGoal === 'compact' ? 'Compact schedule to maximize entirely free days (no classes on those days). Stack them back-to-back if possible.' : 'Balanced schedule spread across the week to avoid too many classes on a single day.'}
- Time preference: ${timePreference === 'morning' ? 'Prefer morning classes (before 13:00).' : timePreference === 'afternoon' ? 'Prefer afternoon classes (after 13:00).' : 'No strict time of day preference.'}
- Freeform requests: "${freeformText || 'None'}"
- Seminar preference: "${seminarPreference || 'None'}"

First, use your <think> tags to strictly deduce which combinations of IDs satisfy the hard constraints (no overlaps, exactly one of each required type).
Then, choose the valid combination that best fits the soft preferences.
Finally, you MUST output your answer as a raw JSON block at the very end outside the <think> tags. The JSON must exactly match this structure:
{
  "plans": [
    {
      "id": "plan-1",
      "reasoning": "A short explanation of how this fits preferences and strictly avoids overlaps.",
      "selectedIds": ["id1", "id2", "id3", "id4", ...] // Include exactly the IDs selected
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
        model: 'openai/gpt-oss-120b',
        max_tokens: 4000,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      })
    });

    if (!groqResponse.ok) {
      const err = await groqResponse.text();
      throw new Error(`Groq API Error: ${err}`);
    }

    const data = await groqResponse.json();
    let content = data.choices[0].message.content;

    content = content.replace(/<think>[\s\S]*?<\/think>/g, '');
    const jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      content = jsonMatch[1];
    } else {
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
