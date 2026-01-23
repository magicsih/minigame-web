import { Caregiver, JobRequest } from "./types";
import { 
  Heart, 
  Activity, 
  ShieldCheck, 
  Users, 
  Clock, 
  Award, 
  TrendingUp, 
  CreditCard,
  User,
  MapPin,
  Calendar,
  Smile
} from "lucide-react";

export const MOCK_CAREGIVERS: Caregiver[] = [
  {
    id: "c1",
    name: "김영희",
    level: 5,
    experiencePoints: 4500,
    rating: 4.9,
    badges: ["치매 돌봄 전문가", "응급 처치", "친절왕"],
    hourlyRate: 25000,
    availableHours: ["09:00", "13:00", "15:00"],
    imageUrl: "https://picsum.photos/100/100?random=1"
  },
  {
    id: "c2",
    name: "박철수",
    level: 3,
    experiencePoints: 2100,
    rating: 4.7,
    badges: ["재활 운동 보조", "차량 소지"],
    hourlyRate: 22000,
    availableHours: ["10:00", "14:00"],
    imageUrl: "https://picsum.photos/100/100?random=2"
  },
  {
    id: "c3",
    name: "이민지",
    level: 2,
    experiencePoints: 800,
    rating: 4.5,
    badges: ["말벗 서비스", "가사 지원"],
    hourlyRate: 20000,
    availableHours: ["13:00", "17:00"],
    imageUrl: "https://picsum.photos/100/100?random=3"
  }
];

export const MOCK_JOBS: JobRequest[] = [
  {
    id: "j1",
    elderlyName: "최옥자 어르신",
    location: "서울시 강남구 삼성동",
    duration: 3,
    needs: ["병원 동행", "식사 보조"],
    status: "open"
  },
  {
    id: "j2",
    elderlyName: "김덕수 어르신",
    location: "서울시 송파구 잠실동",
    duration: 2,
    needs: ["산책", "말벗"],
    status: "open"
  },
  {
    id: "j3",
    elderlyName: "박정자 어르신",
    location: "서울시 서초구 방배동",
    duration: 4,
    needs: ["목욕 보조", "청소"],
    status: "open"
  }
];

export const ICONS = {
  Heart,
  Activity,
  ShieldCheck,
  Users,
  Clock,
  Award,
  TrendingUp,
  CreditCard,
  User,
  MapPin,
  Calendar,
  Smile
};