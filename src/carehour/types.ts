
export interface Caregiver {
  id: string;
  name: string;
  rating: number;
  specialties: string[];
  hourlyRate: number;
  experienceYears: number;
  avatar: string;
  level: number;
  badges: string[];
}

export interface ElderHealthData {
  heartRate: number[];
  steps: number;
  sleepHours: number;
  systolicBP: number;
  diastolicBP: number;
  lastUpdated: string;
}

export interface Booking {
  id: string;
  caregiverId: string;
  elderName: string;
  startTime: string;
  duration: number; // in hours
  status: 'pending' | 'active' | 'completed';
  insuranceLinked: boolean;
  totalAmount: number;
}

export interface TrainingCourse {
  id: string;
  title: string;
  points: number;
  progress: number;
  category: 'safety' | 'nutrition' | 'communication' | 'emergency';
  thumbnail: string;
}
