
import { Caregiver, TrainingCourse } from './types';

export const MOCK_CAREGIVERS: Caregiver[] = [
  {
    id: '1',
    name: '김영희',
    rating: 4.9,
    specialties: ['치매 예방', '동행 서비스'],
    hourlyRate: 15000,
    experienceYears: 5,
    avatar: 'https://picsum.photos/seed/care1/100/100',
    level: 12,
    badges: ['친절왕', '응급구조수료']
  },
  {
    id: '2',
    name: '이정수',
    rating: 4.7,
    specialties: ['식사 보조', '재활 운동'],
    hourlyRate: 18000,
    experienceYears: 8,
    avatar: 'https://picsum.photos/seed/care2/100/100',
    level: 25,
    badges: ['베테랑', '건강식단전문']
  },
  {
    id: '3',
    name: '박미숙',
    rating: 4.8,
    specialties: ['대화 상대', '가벼운 산책'],
    hourlyRate: 14000,
    experienceYears: 3,
    avatar: 'https://picsum.photos/seed/care3/100/100',
    level: 8,
    badges: ['공감왕']
  }
];

export const MOCK_TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 't1',
    title: '노인 심리 이해와 대화법',
    points: 150,
    progress: 80,
    category: 'communication',
    thumbnail: 'https://picsum.photos/seed/t1/400/200'
  },
  {
    id: 't2',
    title: '낙상 예방 및 안전 관리',
    points: 200,
    progress: 30,
    category: 'safety',
    thumbnail: 'https://picsum.photos/seed/t2/400/200'
  },
  {
    id: 't3',
    title: '영양 균형 식단 구성하기',
    points: 100,
    progress: 0,
    category: 'nutrition',
    thumbnail: 'https://picsum.photos/seed/t3/400/200'
  }
];

export const HEALTH_METRICS = {
  heartRate: [72, 75, 71, 78, 82, 79, 74, 73, 75, 77, 80, 85, 78],
  steps: 4520,
  sleepHours: 6.5,
  bloodPressure: "128/85"
};
