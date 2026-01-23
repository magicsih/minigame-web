export interface Caregiver {
  id: string;
  name: string;
  level: number;
  experiencePoints: number;
  rating: number;
  badges: string[];
  hourlyRate: number;
  availableHours: string[]; // e.g., "09:00-13:00"
  imageUrl: string;
}

export interface JobRequest {
  id: string;
  elderlyName: string;
  location: string;
  duration: number; // in hours, 1-4
  needs: string[];
  status: 'open' | 'matched' | 'active' | 'completed';
}

export interface BioData {
  heartRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  bloodSugar: number;
  bodyTemp: number;
  mood: string;
  lastMealTime: string;
}

export interface CareAdvice {
  riskLevel: 'Low' | 'Moderate' | 'High';
  immediateAction: string;
  activityRecommendation: string;
  dietaryAdvice: string;
  conversationStarter: string;
}

export enum ViewState {
  HOME = 'HOME',
  MATCHING = 'MATCHING',
  AI_GUIDE = 'AI_GUIDE',
  EDUCATION = 'EDUCATION',
  PAYMENT = 'PAYMENT'
}