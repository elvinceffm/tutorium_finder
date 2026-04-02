import { AiPreferencePayload, AiPlanResponse } from '../../src/types/ai';

export interface Env {
  GROQ_API_KEY: string;
}

interface ParsedClass {
  id: string;
  courseName: string;
  type: string;
  weekday: string;
  instructor: string;
  startMin: number;
  endMin: number;
}

function parseTime(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return -1;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
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

    // --- STEP 1: DETERMINISTIC PRE-FILTERING ---
    // Extract everything with time parsed
    const allClasses = catalog.map((c: any): ParsedClass => ({
      id: c.id,
      courseName: c.courseName,
      type: c.type,
      weekday: c.weekday,
      instructor: c.instructor || "",
      startMin: parseTime(c.time),
      endMin: parseTime(c.time) === -1 ? -1 : parseTime(c.time) + 90
    }))
    .filter(c => c.startMin !== -1); // Filter out things without valid times

    // Group catalog by courseName then type
    const requirements: { courseName: string, type: string, classes: ParsedClass[] }[] = [];
    const grouped = new Map<string, Map<string, ParsedClass[]>>();

    for (const c of allClasses) {
      if (!grouped.has(c.courseName)) {
        grouped.set(c.courseName, new Map());
      }
      const types = grouped.get(c.courseName)!;
      if (!types.has(c.type)) {
        types.set(c.type, []);
      }
      types.get(c.type)!.push(c);
    }

    for (const [courseName, types] of grouped.entries()) {
      for (const [type, classes] of types.entries()) {
        requirements.push({ courseName, type, classes });
      }
    }

    const validSchedules: ParsedClass[][] = [];
    const maxSchedulesToFind = 50;

    function hasOverlap(schedule: ParsedClass[], newClass: ParsedClass): boolean {
      for (const existing of schedule) {
        if (existing.weekday === newClass.weekday) {
          if (newClass.startMin < existing.endMin && newClass.endMin > existing.startMin) {
            return true;
          }
        }
      }
      return false;
    }

    function search(reqIndex: number, currentSchedule: ParsedClass[]) {
      if (validSchedules.length >= maxSchedulesToFind) return;
      if (reqIndex === requirements.length) {
        validSchedules.push([...currentSchedule]);
        return;
      }

      const req = requirements[reqIndex];
      // For this requirement (course + type), we must pick exactly one class
      for (const candidate of req.classes) {
        if (!hasOverlap(currentSchedule, candidate)) {
          currentSchedule.push(candidate);
          search(reqIndex + 1, currentSchedule);
          currentSchedule.pop();
        }
      }
    }

    search(0, []);

    if (validSchedules.length === 0) {
        // Fallback: No valid schedule found. Return a dummy warning response.
        return new Response(JSON.stringify({
            plans: [{
                id: "error",
                reasoning: "No valid schedule exists without overlaps for all required modules.",
                selectedIds: []
            }]
        }), { headers: { 'Content-Type': 'application/json'} });
    }

    // --- STEP 2: NEURO-SYMBOLIC SELECTION ---
    // Simplify validSchedules for the prompt context limit
    const scheduleDescriptions = validSchedules.map((schedule, idx) => {
      const summary = schedule.map(c => `[ID: ${c.id}] ${c.courseName} (${c.type}) on ${c.weekday} at ${c.startMin / 60 | 0}:${(c.startMin % 60).toString().padStart(2, '0')}`).join(" | ");
      return `Schedule option ${idx + 1}:\n${summary}`;
    }).join("\n\n");

    const prompt = `Solve this academic scheduling puzzle for a political science student at TUM by selecting the best schedule from a pre-calculated valid list.

I have computationally generated ${validSchedules.length} valid schedule options that ALREADY satisfy all hard constraints (no overlaps, exactly 1 Vorlesung/Übung/Seminar per course).
Your task is to pick the top 1 to 3 best options based ENTIRELY on the user's soft preferences.

User Soft Preferences:
- Optimization goal: ${optimizationGoal === 'compact' ? 'Compact schedule to maximize entirely free days (no classes on those days). Stack them back-to-back if possible.' : 'Balanced schedule spread across the week to avoid too many classes on a single day.'}
- Time preference: ${timePreference === 'morning' ? 'Prefer morning classes (before 13:00).' : timePreference === 'afternoon' ? 'Prefer afternoon classes (after 13:00).' : 'No strict time of day preference.'}
- Freeform text/requests: "${freeformText || 'None'}"
- Seminar preference: "${seminarPreference || 'None'}"

Here are the pre-calculated valid schedules:
${scheduleDescriptions}

Select the 1 to 3 best options from the list above. Write your reasoning inside <think> tags.
Then, you MUST output your final answer as a raw JSON block at the very end outside the think tags. The JSON must exactly match this structure:
{
  "plans": [
    {
      "id": "plan-1",
      "reasoning": "A concise, user-friendly explanation of why this plan satisfies their soft preferences.",
      "selectedIds": ["id1", "id2"] // The extracted IDs for the chosen option
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
        temperature: 0.2, // Lower temp for selection
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
