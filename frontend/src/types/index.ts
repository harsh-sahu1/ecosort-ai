export interface DeviceAnalysis {
  device_type: string;
  category: string;
  brand?: string;
  model?: string;
  visible_condition: string;
  visible_damage: string[];
  confidence: number;
}

export type TurnsOnAnswer = 'yes' | 'no' | 'not_sure';
export type BatteryHazardAnswer = 'yes' | 'no' | 'not_sure' | 'not_applicable';
export type ApproximateAgeAnswer = 'less_than_1_year' | '1_to_3_years' | '3_to_5_years' | 'more_than_5_years' | 'not_sure';
export type MainProblemAnswer = 
  | 'no_problem' 
  | 'minor_issue' 
  | 'major_issue' 
  | 'completely_non_functional' 
  | 'physical_damage' 
  | 'battery_issue' 
  | 'not_sure';

export interface ConditionAnswers {
  turns_on: TurnsOnAnswer;
  battery_hazard: BatteryHazardAnswer;
  approximate_age: ApproximateAgeAnswer;
  main_problem: MainProblemAnswer;
}

export interface EnvironmentalImpact {
  title: string;
  headline_metric: string;
  materials_salvageable: string[];
  co2_avoided_kg?: number;
  landfill_hazard_prevented: string;
  qualitative_impact: string;
}

export type RecommendationType = 'REPAIR' | 'REUSE' | 'DONATE' | 'RECYCLE' | 'SAFETY_ALERT';

export interface RecommendationResponse {
  recommendation: RecommendationType;
  recommendation_label: string;
  confidence: 'High' | 'Medium' | 'Low';
  summary: string;
  why: string;
  reasons: string[];
  key_factors: string[];
  action_steps: string[];
  safety_warnings: string[];
  environmental_impact: EnvironmentalImpact;
  device_snapshot: DeviceAnalysis;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  device_type: string;
  brand?: string;
  visible_condition: string;
  recommendation: RecommendationType;
  confidence: string;
  image_preview?: string;
}
