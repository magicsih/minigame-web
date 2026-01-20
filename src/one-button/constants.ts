
import { FacilityType, UpgradeDef } from './types';

export const INITIAL_STATE = {
  work: 0,
  material: 0,
  maxWorkEver: 0,
  workers: 0,
  workbenches: 0,
  factories: 0,
  cities: 0,
  nations: 0,
  civPoints: 0,
  totalResets: 0,
  currentPhase: 0
};

export const UPGRADES: UpgradeDef[] = [
  {
    id: FacilityType.WORKER,
    name: '일꾼 고용',
    description: '단순 노동을 자동화합니다. 초당 0.5의 작업량을 생성합니다.',
    baseCost: 10,
    costMultiplier: 1.15,
    phaseRequired: 1
  },
  {
    id: FacilityType.WORKBENCH,
    name: '작업대',
    description: '모든 작업 생산 효율을 1.5배 증가시킵니다.',
    baseCost: 100,
    costMultiplier: 1.5,
    phaseRequired: 2
  },
  {
    id: FacilityType.FACTORY,
    name: '공장 건설',
    description: '작업량을 대량 생산합니다. 원자재가 필요하며, 초당 5의 작업량을 생성합니다.',
    baseCost: 10, // 원자재(Material) 비용
    costMultiplier: 1.2,
    phaseRequired: 3
  },
  {
    id: FacilityType.CITY,
    name: '도시 설립',
    description: '산업의 중심지입니다. 일꾼과 공장의 효율을 2배로 증가시킵니다.',
    baseCost: 10000,
    costMultiplier: 2.5,
    phaseRequired: 4
  },
  {
    id: FacilityType.NATION,
    name: '국가 선포',
    description: '문명의 정점입니다. 모든 시스템을 자동화하지만 수동 노동의 가치를 떨어뜨립니다.',
    baseCost: 100000,
    costMultiplier: 5.0,
    phaseRequired: 5
  }
];

export const PHASE_THRESHOLDS = {
  PHASE_1: 10,      // 일꾼 해금
  PHASE_2: 100,     // 작업대 해금
  PHASE_3: 1000,    // 원자재 및 공장 해금
  PHASE_4: 10000,   // 도시 해금
  PHASE_5: 5        // 국가 해금 (도시 수 기준)
};
