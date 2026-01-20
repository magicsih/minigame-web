
export enum OrderStatus {
  PENDING = 'PENDING',
  PICKING = 'PICKING',
  PACKING = 'PACKING',
  OUTBOUND = 'OUTBOUND',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED'
}

export interface Order {
  id: string;
  type: string;
  value: number;
  status: OrderStatus;
  progress: number;
  createdAt: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  effect: number;
}

export interface GameState {
  money: number;
  reputation: number;
  orders: Order[];
  level: number;
  stats: {
    totalDelivered: number;
    totalEarned: number;
    avgDeliveryTime: number;
  };
  upgrades: {
    marketing: Upgrade;      // Frequency of orders
    pickingSpeed: Upgrade;   // Speed of picking
    packingCapacity: Upgrade; // Efficiency of packing
    deliveryFleet: Upgrade;   // Speed/Number of vans
    warehouseSize: Upgrade;   // Order limit
  };
}
