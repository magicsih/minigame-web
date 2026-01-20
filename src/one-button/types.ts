
export interface GameState {
  work: number;
  material: number;
  maxWorkEver: number;
  
  // Facilities
  workers: number;
  workbenches: number;
  factories: number;
  cities: number;
  nations: number;
  
  // Prestige
  civPoints: number;
  totalResets: number;
  
  // Phase tracking
  currentPhase: number;
}

export enum FacilityType {
  WORKER = 'WORKER',
  WORKBENCH = 'WORKBENCH',
  FACTORY = 'FACTORY',
  CITY = 'CITY',
  NATION = 'NATION'
}

export interface UpgradeDef {
  id: FacilityType;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  phaseRequired: number;
}
