
export enum ElevatorState {
  IDLE = 'IDLE',
  MOVING_UP = 'MOVING_UP',
  MOVING_DOWN = 'MOVING_DOWN',
  LOADING = 'LOADING',
}

export interface Passenger {
  id: string;
  spawnTime: number;
  originFloor: number;
  targetFloor: number;
  frustration: number; // 0 to 100
  isInElevator: boolean;
}

export interface Elevator {
  id: number;
  currentFloor: number; // Can be float during transition
  targetFloors: number[]; // Queue of floors to visit
  passengers: Passenger[];
  state: ElevatorState;
  capacity: number;
  speed: number; // floors per second
}

export enum TimePeriod {
  MORNING_RUSH = 'MORNING_RUSH',
  LUNCH_TIME = 'LUNCH_TIME',
  EVENING_RUSH = 'EVENING_RUSH',
  NORMAL = 'NORMAL'
}

export interface GameStats {
  deliveredCount: number;
  lostCount: number;
  averageWaitTime: number;
  totalRevenue: number;
}
