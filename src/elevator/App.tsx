
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Elevator, 
  ElevatorState, 
  Passenger, 
  TimePeriod, 
  GameStats 
} from './types';
import { 
  FLOOR_COUNT, 
  MAX_ELEVATORS, 
  INITIAL_CAPACITY, 
  INITIAL_SPEED, 
  TICK_RATE, 
  PASSENGER_ANGRY_THRESHOLD,
  COST_NEW_ELEVATOR,
  COST_UPGRADE_SPEED,
  COST_UPGRADE_CAPACITY,
  REVENUE_PER_PASSENGER,
  TIME_PERIOD_CONFIGS
} from './constants';
import Building from './components/Building';
import Dashboard from './components/Dashboard';
import Upgrades from './components/Upgrades';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Play, Pause, RefreshCw, AlertCircle, Info, TrendingUp, Users, DollarSign } from 'lucide-react';

const App: React.FC = () => {
  // Game State
  const [elevators, setElevators] = useState<Elevator[]>([
    { id: 0, currentFloor: 0, targetFloors: [], passengers: [], state: ElevatorState.IDLE, capacity: INITIAL_CAPACITY, speed: INITIAL_SPEED }
  ]);
  const [waitingPassengers, setWaitingPassengers] = useState<Passenger[]>([]);
  const [stats, setStats] = useState<GameStats>({ deliveredCount: 0, lostCount: 0, averageWaitTime: 0, totalRevenue: 100 });
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<TimePeriod>(TimePeriod.NORMAL);
  const [aiAdvice, setAiAdvice] = useState<string>("Welcome Manager! High efficiency is the key to profit.");
  const [announcement, setAnnouncement] = useState<string>("");

  // Fleet Global Stats (Upgradable)
  const [fleetSpeed, setFleetSpeed] = useState(INITIAL_SPEED);
  const [fleetCapacity, setFleetCapacity] = useState(INITIAL_CAPACITY);

  const timerRef = useRef<number | null>(null);

  // Period management
  useEffect(() => {
    const cycleTime = 1200; 
    const relativeTime = time % cycleTime;

    let newPeriod = TimePeriod.NORMAL;
    if (relativeTime < 200) newPeriod = TimePeriod.MORNING_RUSH;
    else if (relativeTime >= 400 && relativeTime < 600) newPeriod = TimePeriod.LUNCH_TIME;
    else if (relativeTime >= 800 && relativeTime < 1000) newPeriod = TimePeriod.EVENING_RUSH;

    if (newPeriod !== currentPeriod) {
      setCurrentPeriod(newPeriod);
      handleNewPeriod(newPeriod);
    }
  }, [time, currentPeriod]);

  const getAnnouncement = (period: TimePeriod) => {
    switch (period) {
      case TimePeriod.MORNING_RUSH:
        return 'Morning rush hour is live. Keep those cars moving!';
      case TimePeriod.LUNCH_TIME:
        return 'Lunch crowd incoming. Prioritize mid floors.';
      case TimePeriod.EVENING_RUSH:
        return 'Evening rush begins. Expect heavy outbound traffic.';
      default:
        return 'Normal operations. Optimize for steady flow.';
    }
  };

  const getManagerTip = (period: TimePeriod) => {
    switch (period) {
      case TimePeriod.MORNING_RUSH:
        return 'Batch pickups on lower floors to reduce queue spikes.';
      case TimePeriod.LUNCH_TIME:
        return 'Stagger stops to avoid crowding near the lobby.';
      case TimePeriod.EVENING_RUSH:
        return 'Keep one car dedicated to down traffic for faster clearouts.';
      default:
        return 'Maintain short routes and upgrade speed when possible.';
    }
  };

  const handleNewPeriod = (period: TimePeriod) => {
    const msg = getAnnouncement(period);
    setAnnouncement(msg);
    setTimeout(() => setAnnouncement(""), 5000);

    const advice = getManagerTip(period);
    setAiAdvice(advice);
  };

  const spawnPassenger = useCallback(() => {
    const config = TIME_PERIOD_CONFIGS[currentPeriod];
    if (Math.random() < config.spawnChance) {
      const getWeightedRandom = (weights: number[]) => {
        let r = Math.random();
        for (let i = 0; i < weights.length; i++) {
          if (r < weights[i]) return i;
          r -= weights[i];
        }
        return weights.length - 1;
      };

      const origin = getWeightedRandom(config.originWeights);
      let target = getWeightedRandom(config.targetWeights);
      while (target === origin) {
        target = Math.floor(Math.random() * FLOOR_COUNT);
      }

      const newPassenger: Passenger = {
        id: Math.random().toString(36).substr(2, 9),
        spawnTime: time,
        originFloor: origin,
        targetFloor: target,
        frustration: 0,
        isInElevator: false,
      };
      setWaitingPassengers(prev => [...prev, newPassenger]);
    }
  }, [time, currentPeriod]);

  const gameLoop = useCallback(() => {
    setTime(prev => prev + 1);
    spawnPassenger();

    setElevators(prevElevators => {
      // Find all floor requests (origins of waiting passengers)
      // This is used for dispatching idle elevators
      const requestedFloors = Array.from(new Set(waitingPassengers.map(p => p.originFloor)));

      return prevElevators.map(elev => {
        let { currentFloor, targetFloors, passengers, state } = elev;
        const currentSpeed = fleetSpeed;
        const currentCapacity = fleetCapacity;

        const floorIndex = Math.round(currentFloor);
        const atFloor = Math.abs(currentFloor - floorIndex) < 0.05;

        // 1. Loading/Unloading check
        if (atFloor) {
          const arriving = passengers.filter(p => p.targetFloor === floorIndex);
          const floorWaiting = waitingPassengers.filter(p => p.originFloor === floorIndex);
          const hasRoom = passengers.length < currentCapacity;

          if (arriving.length > 0 || (floorWaiting.length > 0 && hasRoom)) {
            // Unload
            if (arriving.length > 0) {
              setStats(s => ({
                ...s,
                deliveredCount: s.deliveredCount + arriving.length,
                totalRevenue: s.totalRevenue + arriving.length * REVENUE_PER_PASSENGER,
                averageWaitTime: (s.averageWaitTime * s.deliveredCount + arriving.reduce((acc, p) => acc + (time - p.spawnTime), 0)) / (s.deliveredCount + arriving.length)
              }));
              passengers = passengers.filter(p => p.targetFloor !== floorIndex);
            }

            // Load
            if (floorWaiting.length > 0 && hasRoom) {
              const space = currentCapacity - passengers.length;
              const toLoad = floorWaiting.slice(0, space);
              
              setWaitingPassengers(prev => prev.filter(p => !toLoad.includes(p)));
              passengers = [...passengers, ...toLoad.map(p => ({ ...p, isInElevator: true }))];
              
              // Add destinations to targets
              const destinations = toLoad.map(p => p.targetFloor);
              targetFloors = Array.from(new Set([...targetFloors, ...destinations]));
            }

            // After load/unload, clear current floor from targets
            targetFloors = targetFloors.filter(f => f !== floorIndex);
            state = ElevatorState.LOADING;
            return { ...elev, passengers, targetFloors, state, currentFloor: floorIndex };
          }
        }

        // 2. Dispatching & Movement Logic
        if (targetFloors.length === 0) {
          // Idle check: find a waiting passenger if we are idle
          const nextJobFloor = requestedFloors.find(f => !prevElevators.some(e => e.targetFloors.includes(f)));
          if (nextJobFloor !== undefined) {
             targetFloors = [nextJobFloor];
          } else {
             state = ElevatorState.IDLE;
             return { ...elev, state, targetFloors };
          }
        }

        // Sort targets based on current direction to be "efficient" (Scan Algorithm)
        const nextTarget = targetFloors[0];
        if (nextTarget > currentFloor) {
          state = ElevatorState.MOVING_UP;
          currentFloor += currentSpeed * (TICK_RATE / 1000);
          if (currentFloor >= nextTarget) {
            currentFloor = nextTarget;
          }
        } else if (nextTarget < currentFloor) {
          state = ElevatorState.MOVING_DOWN;
          currentFloor -= currentSpeed * (TICK_RATE / 1000);
          if (currentFloor <= nextTarget) {
            currentFloor = nextTarget;
          }
        } else {
           // We are exactly at the target
           targetFloors = targetFloors.slice(1);
           state = ElevatorState.IDLE;
        }

        return { ...elev, currentFloor, state, targetFloors, passengers };
      });
    });

    // Frustration update
    setWaitingPassengers(prev => {
      const updated = prev.map(p => ({ ...p, frustration: p.frustration + 0.6 }));
      const lost = updated.filter(p => p.frustration >= PASSENGER_ANGRY_THRESHOLD);
      if (lost.length > 0) {
        setStats(s => ({ ...s, lostCount: s.lostCount + lost.length }));
      }
      return updated.filter(p => p.frustration < PASSENGER_ANGRY_THRESHOLD);
    });

  }, [spawnPassenger, time, waitingPassengers, fleetSpeed, fleetCapacity]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(gameLoop, TICK_RATE);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, gameLoop]);

  const addElevator = () => {
    if (stats.totalRevenue >= COST_NEW_ELEVATOR && elevators.length < MAX_ELEVATORS) {
      setStats(s => ({ ...s, totalRevenue: s.totalRevenue - COST_NEW_ELEVATOR }));
      setElevators(prev => [
        ...prev,
        { id: prev.length, currentFloor: 0, targetFloors: [], passengers: [], state: ElevatorState.IDLE, capacity: fleetCapacity, speed: fleetSpeed }
      ]);
    }
  };

  const upgradeSpeed = () => {
    if (stats.totalRevenue >= COST_UPGRADE_SPEED) {
      setStats(s => ({ ...s, totalRevenue: s.totalRevenue - COST_UPGRADE_SPEED }));
      setFleetSpeed(prev => prev + 0.4);
    }
  };

  const upgradeCapacity = () => {
    if (stats.totalRevenue >= COST_UPGRADE_CAPACITY) {
      setStats(s => ({ ...s, totalRevenue: s.totalRevenue - COST_UPGRADE_CAPACITY }));
      setFleetCapacity(prev => prev + 2);
    }
  };

  const resetGame = () => {
    setElevators([{ id: 0, currentFloor: 0, targetFloors: [], passengers: [], state: ElevatorState.IDLE, capacity: INITIAL_CAPACITY, speed: INITIAL_SPEED }]);
    setWaitingPassengers([]);
    setStats({ deliveredCount: 0, lostCount: 0, averageWaitTime: 0, totalRevenue: 100 });
    setTime(0);
    setIsPlaying(false);
    setFleetSpeed(INITIAL_SPEED);
    setFleetCapacity(INITIAL_CAPACITY);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-2 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            ELEVATOR TYCOON
          </h1>
          <p className="text-slate-400 text-sm flex items-center justify-center md:justify-start gap-2">
            <TrendingUp size={14} /> <span className="text-indigo-300 font-semibold">{TIME_PERIOD_CONFIGS[currentPeriod].label}</span>
          </p>
        </div>
        
        <div className="flex gap-3 items-center">
          <div className="glass-effect px-4 py-2 rounded-full flex items-center gap-3 text-lg font-bold text-emerald-400 border-emerald-500/20">
            <DollarSign className="text-emerald-500" size={20} />
            {stats.totalRevenue.toLocaleString()}
          </div>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-3 md:p-4 rounded-full transition-all shadow-lg transform active:scale-95 ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
          >
            {isPlaying ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} />}
          </button>
          <button 
            onClick={resetGame}
            className="p-3 md:p-4 bg-slate-800 hover:bg-slate-700 rounded-full transition-all shadow-lg active:scale-95"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Stats Panel */}
        <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
          <Dashboard stats={stats} />
          
          <div className="glass-effect p-4 rounded-2xl relative border-l-4 border-indigo-500">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
              <Info size={14}/> Manager's Tip
            </h3>
            <p className="text-indigo-100 text-sm italic leading-relaxed">
              "{aiAdvice}"
            </p>
          </div>

          <Upgrades 
            revenue={stats.totalRevenue} 
            elevatorCount={elevators.length} 
            onAddElevator={addElevator}
            onUpgradeSpeed={upgradeSpeed}
            onUpgradeCapacity={upgradeCapacity}
            fleetSpeed={fleetSpeed}
            fleetCapacity={fleetCapacity}
          />
        </div>

        {/* Game View */}
        <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col gap-4">
          <div className="glass-effect rounded-3xl p-4 md:p-6 shadow-2xl min-h-[500px] md:min-h-[700px] flex flex-col relative overflow-hidden border border-slate-800">
            {announcement && (
              <div className="absolute top-4 left-0 right-0 z-50 px-4">
                <div className="bg-indigo-600/90 backdrop-blur text-white px-4 py-2 rounded-xl text-center font-bold animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl border border-white/20 flex items-center justify-center gap-2">
                  <AlertCircle size={18} /> {announcement}
                </div>
              </div>
            )}
            <Building 
              elevators={elevators} 
              waitingPassengers={waitingPassengers} 
              floorCount={FLOOR_COUNT} 
            />
          </div>
        </div>

        {/* Analytics Panel */}
        <div className="lg:col-span-3 order-3 space-y-6">
          <div className="glass-effect p-6 rounded-3xl border border-slate-800">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-200">
              <Users size={18} className="text-indigo-400"/> Building Flow
            </h3>
            <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                   { name: 'Delivered', value: stats.deliveredCount, color: '#10b981' },
                   { name: 'Lost', value: stats.lostCount, color: '#ef4444' }
                 ]}>
                   <XAxis dataKey="name" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                   <YAxis hide />
                   <Tooltip 
                     cursor={{ fill: 'transparent' }}
                     contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                     itemStyle={{ fontSize: '12px' }}
                   />
                   <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={40}>
                     { [0, 1].map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Success</p>
                <p className="text-xl font-black text-emerald-400">
                  {stats.deliveredCount + stats.lostCount === 0 ? '0%' : `${Math.round((stats.deliveredCount / (stats.deliveredCount + stats.lostCount)) * 100)}%`}
                </p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Avg Wait</p>
                <p className="text-xl font-black text-indigo-400">
                  {Math.round(stats.averageWaitTime / 10)}s
                </p>
              </div>
            </div>
          </div>

          <div className="glass-effect p-5 rounded-2xl text-xs text-slate-400 space-y-3 border border-slate-800">
            <p className="font-bold text-slate-300 flex items-center gap-2"><Info size={14}/> Operational Logic</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Elevators prioritize current direction (Scan logic).</li>
              <li>Idle units seek the closest passenger request.</li>
              <li>Upgrading <span className="text-indigo-400 font-bold">Speed</span> allows for faster floor transitions.</li>
              <li>Upgrading <span className="text-purple-400 font-bold">Capacity</span> handles crowds more effectively.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
