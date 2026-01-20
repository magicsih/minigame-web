
import { OrderStatus, GameState } from './types';

export const INITIAL_GAME_STATE: GameState = {
  money: 500,
  reputation: 0,
  orders: [],
  level: 1,
  stats: {
    totalDelivered: 0,
    totalEarned: 0,
    avgDeliveryTime: 0,
  },
  upgrades: {
    marketing: {
      id: 'marketing',
      name: 'Ad Campaigns',
      description: 'Increases order frequency',
      cost: 100,
      level: 1,
      effect: 0.1, // New orders per tick chance
    },
    pickingSpeed: {
      id: 'pickingSpeed',
      name: 'Skilled Pickers',
      description: 'Faster item retrieval',
      cost: 150,
      level: 1,
      effect: 1, // Progress % per tick
    },
    packingCapacity: {
      id: 'packingCapacity',
      name: 'Packing Stations',
      description: 'More items packed at once',
      cost: 200,
      level: 1,
      effect: 1.2,
    },
    deliveryFleet: {
      id: 'deliveryFleet',
      name: 'Delivery Vans',
      description: 'Fast last-mile delivery',
      cost: 250,
      level: 1,
      effect: 0.8,
    },
    warehouseSize: {
      id: 'warehouseSize',
      name: 'Storage Expansion',
      description: 'Increases max concurrent orders',
      cost: 300,
      level: 1,
      effect: 10, // Max orders
    },
  },
};

export const ORDER_TYPES = ['Electronics', 'Grocery', 'Fashion', 'Health', 'Luxury', 'Books'];

export const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-slate-500',
  [OrderStatus.PICKING]: 'bg-blue-500',
  [OrderStatus.PACKING]: 'bg-yellow-500',
  [OrderStatus.OUTBOUND]: 'bg-purple-500',
  [OrderStatus.SHIPPING]: 'bg-orange-500',
  [OrderStatus.DELIVERED]: 'bg-green-500',
};

export const STAGE_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Order Received',
  [OrderStatus.PICKING]: 'Picking Items',
  [OrderStatus.PACKING]: 'Packing Goods',
  [OrderStatus.OUTBOUND]: 'Outbound Sorting',
  [OrderStatus.SHIPPING]: 'Last Mile Delivery',
  [OrderStatus.DELIVERED]: 'Delivered!',
};
