import { AiPreferencePayload, AiPlanResponse } from '../../src/types/ai';

export interface Env {
  GROQ_API_KEY: string;
}

interface ParsedTutorial {
  id: string;
  courseName: string;
  type: string;
  weekday: string;
  time: string; // "HH:MM"
  startMin: number;
  endMin: number;
  instructor: string;
}

function parseTime(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return -1;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
...
