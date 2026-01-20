
export const FLOOR_COUNT = 10;
export const MAX_ELEVATORS = 6;
export const INITIAL_CAPACITY = 4;
export const INITIAL_SPEED = 1.2; // Increased from 0.5 to 1.2 floors/sec
export const TICK_RATE = 100; // ms per tick
export const PASSENGER_ANGRY_THRESHOLD = 100;
export const COST_NEW_ELEVATOR = 500;
export const COST_UPGRADE_SPEED = 300;
export const COST_UPGRADE_CAPACITY = 400;
export const REVENUE_PER_PASSENGER = 15;

export const TIME_PERIOD_CONFIGS = {
  MORNING_RUSH: {
    label: "Morning Rush (Upwards Focus)",
    spawnChance: 0.2,
    originWeights: [0.8, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02],
    targetWeights: [0.0, 0.11, 0.11, 0.11, 0.11, 0.11, 0.11, 0.11, 0.11, 0.11],
  },
  LUNCH_TIME: {
    label: "Lunch Break (Mixed)",
    spawnChance: 0.25,
    originWeights: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
    targetWeights: [0.3, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07],
  },
  EVENING_RUSH: {
    label: "Evening Rush (Downwards Focus)",
    spawnChance: 0.2,
    originWeights: [0.0, 0.11, 0.11, 0.11, 0.11, 0.11, 0.11, 0.11, 0.11, 0.11],
    targetWeights: [0.8, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02],
  },
  NORMAL: {
    label: "Normal Operation",
    spawnChance: 0.08,
    originWeights: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
    targetWeights: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  }
};
