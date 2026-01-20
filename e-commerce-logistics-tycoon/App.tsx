import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Package, 
  Truck, 
  Warehouse, 
  TrendingUp, 
  Users, 
  Zap, 
  DollarSign,
  ShoppingCart,
  Boxes,
  MapPin
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GameState, Order, OrderStatus, Upgrade } from './types';
import { INITIAL_GAME_STATE, ORDER_TYPES, STATUS_COLORS, STAGE_LABELS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [history, setHistory] = useState<{ time: string; money: number }[]>([]);
  const [activeTab, setActiveTab] = useState<'warehouse' | 'upgrades' | 'stats'>('warehouse');

  // Game Loop Logic
  const tick = useCallback(() => {
    setGameState(prev => {
      const next = { ...prev };
      
      // 1. Generate New Orders
      const maxOrders = next.upgrades.warehouseSize.effect;
      if (next.orders.length < maxOrders) {
        if (Math.random() < next.upgrades.marketing.effect) {
          const type = ORDER_TYPES[Math.floor(Math.random() * ORDER_TYPES.length)];
          const newOrder: Order = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            value: Math.floor(Math.random() * 50) + 20,
            status: OrderStatus.PICKING, // Start at picking
            progress: 0,
            createdAt: Date.now()
          };
          next.orders = [...next.orders, newOrder];
        }
      }

      // 2. Process Current Orders
      let deliveredThisTick = 0;
      let earnedThisTick = 0;

      const updatedOrders = next.orders.map(order => {
        let speed = 0;
        switch (order.status) {
          case OrderStatus.PICKING:
            speed = next.upgrades.pickingSpeed.effect * 5;
            break;
          case OrderStatus.PACKING:
            speed = next.upgrades.packingCapacity.effect * 4;
            break;
          case OrderStatus.OUTBOUND:
            speed = 10; // Automatic conveyor
            break;
          case OrderStatus.SHIPPING:
            speed = next.upgrades.deliveryFleet.effect * 3;
            break;
          default:
            speed = 0;
        }

        const newProgress = order.progress + speed;
        
        if (newProgress >= 100) {
          // Advance Status
          const statuses = Object.values(OrderStatus);
          const currentIndex = statuses.indexOf(order.status);
          const nextStatus = statuses[currentIndex + 1];

          if (nextStatus === OrderStatus.DELIVERED) {
            deliveredThisTick++;
            earnedThisTick += order.value;
            return { ...order, status: OrderStatus.DELIVERED, progress: 100 };
          }

          return { ...order, status: nextStatus, progress: 0 };
        }

        return { ...order, progress: newProgress };
      });

      // Cleanup Delivered Orders
      const remainingOrders = updatedOrders.filter(o => o.status !== OrderStatus.DELIVERED);
      
      next.money += earnedThisTick;
      next.stats.totalDelivered += deliveredThisTick;
      next.stats.totalEarned += earnedThisTick;
      next.orders = remainingOrders;

      return next;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    const historyInterval = setInterval(() => {
      setHistory(prev => [
        ...prev.slice(-19),
        { time: new Date().toLocaleTimeString(), money: gameState.money }
      ]);
    }, 5000);
    return () => clearInterval(historyInterval);
  }, [gameState.money]);

  // Upgrade Function
  const buyUpgrade = (key: keyof GameState['upgrades']) => {
    setGameState(prev => {
      const upgrade = prev.upgrades[key];
      if (prev.money < upgrade.cost) return prev;

      const nextLevel = upgrade.level + 1;
      const nextCost = Math.floor(upgrade.cost * 1.5);
      const nextEffect = upgrade.id === 'warehouseSize' 
        ? upgrade.effect + 5 
        : upgrade.effect * 1.25;

      return {
        ...prev,
        money: prev.money - upgrade.cost,
        upgrades: {
          ...prev.upgrades,
          [key]: {
            ...upgrade,
            level: nextLevel,
            cost: nextCost,
            effect: nextEffect
          }
        }
      };
    });
  };

  const currentMaxOrders = gameState.upgrades.warehouseSize.effect;

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto p-4 md:p-6 gap-6">
      {/* Header / Top Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
            <Warehouse className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">LogiTech Solutions</h1>
            <p className="text-xs text-slate-400">Warehouse Level {gameState.level}</p>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <DollarSign className="text-emerald-400 w-5 h-5" />
            <span className="text-2xl font-bold text-emerald-400 mono">
              ${gameState.money.toLocaleString()}
            </span>
          </div>
          <div className="h-10 w-px bg-slate-800 hidden sm:block"></div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-slate-400 uppercase tracking-widest">Efficiency</span>
            <div className="w-24 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
               <div 
                 className="h-full bg-blue-500 transition-all duration-1000" 
                 style={{ width: `${Math.min(100, (gameState.stats.totalDelivered / 10))}%` }}
               />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-6 flex-grow">
        
        {/* Navigation Sidebar */}
        <nav className="flex md:flex-col gap-2 w-full md:w-48 shrink-0">
          <button 
            onClick={() => setActiveTab('warehouse')}
            className={`flex-1 md:flex-none flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'warehouse' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            <Boxes size={20} />
            <span className="font-semibold text-sm">Logistics</span>
          </button>
          <button 
            onClick={() => setActiveTab('upgrades')}
            className={`flex-1 md:flex-none flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'upgrades' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            <TrendingUp size={20} />
            <span className="font-semibold text-sm">Upgrades</span>
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex-1 md:flex-none flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'stats' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            <Zap size={20} />
            <span className="font-semibold text-sm">Statistics</span>
          </button>
        </nav>

        {/* Dynamic Display Panel */}
        <main className="flex-grow bg-slate-900/50 rounded-2xl border border-slate-800 p-6 min-h-[500px] overflow-y-auto">
          {activeTab === 'warehouse' && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold">Live Operations</h2>
                  <p className="text-slate-400 text-sm">Real-time status of your fulfillment center</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Capacity</span>
                  <span className="font-bold text-slate-300">
                    {gameState.orders.length} / {Math.round(currentMaxOrders)}
                  </span>
                </div>
              </div>

              {/* Workflow Pipeline */}
              <div className="grid grid-cols-1 gap-4">
                {gameState.orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl">
                    <Package size={48} className="mb-4 opacity-20" />
                    <p>No active orders. Run marketing to attract customers!</p>
                  </div>
                ) : (
                  gameState.orders.map(order => (
                    <div key={order.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-blue-500/30 transition-all flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-full sm:w-32">
                        <span className="text-[10px] text-slate-500 font-mono block mb-1">#{order.id.toUpperCase()}</span>
                        <div className="font-semibold text-slate-200">{order.type}</div>
                        <div className="text-xs text-emerald-400 font-mono">+${order.value}</div>
                      </div>

                      <div className="flex-grow w-full">
                        <div className="flex justify-between text-xs mb-2">
                          <span className={`px-2 py-0.5 rounded-md ${STATUS_COLORS[order.status]} text-white font-semibold flex items-center gap-1`}>
                            {order.status === OrderStatus.SHIPPING && <Truck size={12} />}
                            {order.status === OrderStatus.PACKING && <Package size={12} />}
                            {STAGE_LABELS[order.status]}
                          </span>
                          <span className="text-slate-400">{Math.round(order.progress)}%</span>
                        </div>
                        <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                           <div 
                             className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear ${STATUS_COLORS[order.status]}`} 
                             style={{ width: `${order.progress}%` }}
                           />
                           {/* Decorative Conveyor Marks */}
                           <div className="absolute inset-0 conveyor-animation opacity-20 pointer-events-none" />
                        </div>
                      </div>

                      <div className="flex gap-4 shrink-0">
                        {/* Process Indicator Icons */}
                        <div className="flex gap-1">
                          <div className={`p-1.5 rounded ${order.status === OrderStatus.PICKING ? 'bg-blue-600 text-white' : 'text-slate-600'}`}><Boxes size={14} /></div>
                          <div className={`p-1.5 rounded ${order.status === OrderStatus.PACKING ? 'bg-yellow-600 text-white' : 'text-slate-600'}`}><Package size={14} /></div>
                          <div className={`p-1.5 rounded ${order.status === OrderStatus.SHIPPING ? 'bg-orange-600 text-white' : 'text-slate-600'}`}><Truck size={14} /></div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'upgrades' && (
            <div className="space-y-6">
               <h2 className="text-2xl font-bold">Invest in Growth</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Fix: Explicitly cast Object.entries to resolve 'unknown' type errors for upgrade properties in strict TypeScript environments */}
                 {(Object.entries(gameState.upgrades) as [keyof GameState['upgrades'], Upgrade][]).map(([key, upgrade]) => (
                   <div key={upgrade.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                     <div>
                       <div className="flex justify-between items-start mb-2">
                         <div className="font-bold text-lg">{upgrade.name}</div>
                         <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full font-bold">Lv. {upgrade.level}</span>
                       </div>
                       <p className="text-slate-400 text-sm mb-4">{upgrade.description}</p>
                     </div>
                     <button 
                       disabled={gameState.money < upgrade.cost}
                       onClick={() => buyUpgrade(key as keyof GameState['upgrades'])}
                       className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${gameState.money >= upgrade.cost ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                     >
                       <DollarSign size={16} />
                       {upgrade.cost.toLocaleString()}
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-8">
               <h2 className="text-2xl font-bold">Operational Data</h2>
               
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                    <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Revenue</div>
                    <div className="text-2xl font-bold text-emerald-400 font-mono">${gameState.stats.totalEarned}</div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                    <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Deliveries</div>
                    <div className="text-2xl font-bold font-mono">{gameState.stats.totalDelivered}</div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                    <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Staff Efficiency</div>
                    <div className="text-2xl font-bold text-blue-400 font-mono">{Math.round(gameState.upgrades.pickingSpeed.effect * 100)}%</div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                    <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Reputation</div>
                    <div className="text-2xl font-bold text-purple-400 font-mono">{Math.floor(gameState.stats.totalDelivered / 5)}★</div>
                  </div>
               </div>

               <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800 h-[300px]">
                 <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-widest">Revenue Growth</h3>
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={history}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                     <XAxis dataKey="time" hide />
                     <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `$${val}`} />
                     <Tooltip 
                       contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                       labelStyle={{ display: 'none' }}
                     />
                     <Line type="monotone" dataKey="money" stroke="#3b82f6" strokeWidth={3} dot={false} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer / Status Bar */}
      <footer className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><MapPin size={10} /> HQ: Neo-Seoul Logistics Hub</span>
          <span className="flex items-center gap-1"><Users size={10} /> {Math.round(gameState.upgrades.pickingSpeed.level)} Active Teams</span>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1 text-blue-400 animate-pulse">● System Operational</span>
        </div>
      </footer>
    </div>
  );
};

export default App;