export interface AiPreferencePayload {
  semester: number;
  optimizationGoal: 'compact' | 'balanced';
  timePreference: 'morning' | 'afternoon' | 'any';
  seminarPreference: string;
  freeformText: string;
  catalog: any[]; // The tutorial catalog
}

export interface AiPlan {
  id: string; // unique ID for this generated permutation
  reasoning: string;
  selectedIds: string[];
}

export interface AiPlanResponse {
  plans: AiPlan[];
}
