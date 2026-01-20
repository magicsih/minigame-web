
import React from 'react';
import { COST_NEW_ELEVATOR, MAX_ELEVATORS, COST_UPGRADE_SPEED, COST_UPGRADE_CAPACITY } from '../constants';
import { PlusCircle, ShoppingBag, Zap, Users } from 'lucide-react';

interface UpgradesProps {
  revenue: number;
  elevatorCount: number;
  fleetSpeed: number;
  fleetCapacity: number;
  onAddElevator: () => void;
  onUpgradeSpeed: () => void;
  onUpgradeCapacity: () => void;
}

const Upgrades: React.FC<UpgradesProps> = ({ 
  revenue, 
  elevatorCount, 
  fleetSpeed, 
  fleetCapacity, 
  onAddElevator,
  onUpgradeSpeed,
  onUpgradeCapacity
}) => {
  const canAffordNew = revenue >= COST_NEW_ELEVATOR;
  const canAffordSpeed = revenue >= COST_UPGRADE_SPEED;
  const canAffordCap = revenue >= COST_UPGRADE_CAPACITY;
  const isMaxElevators = elevatorCount >= MAX_ELEVATORS;

  return (
    <div className="glass-effect p-5 rounded-3xl shadow-xl border border-slate-800">
      <h3 className="text-lg font-black mb-5 flex items-center gap-2 text-slate-200">
        <ShoppingBag size={20} className="text-indigo-400" /> UPGRADE CENTER
      </h3>
      
      <div className="space-y-3">
        {/* New Elevator */}
        <div className={`p-4 rounded-2xl border-2 transition-all transform active:scale-[0.98] ${
          isMaxElevators ? 'border-slate-800 opacity-50' : 
          canAffordNew ? 'border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500/60 cursor-pointer' : 'border-slate-800 cursor-not-allowed'
        }`}
        onClick={() => !isMaxElevators && canAffordNew && onAddElevator()}>
          <div className="flex justify-between items-center mb-1">
            <span className="font-black text-sm text-slate-200">NEW ELEVATOR</span>
            <span className={`font-mono text-sm font-black ${canAffordNew ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${COST_NEW_ELEVATOR}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mb-3 leading-tight">Increase total building throughput with a new shaft.</p>
          <div className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
            isMaxElevators ? 'bg-slate-800 text-slate-600' :
            canAffordNew ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg' : 'bg-slate-800 text-slate-500'
          }`}>
            {isMaxElevators ? 'MAXED' : <><PlusCircle size={14} /> PURCHASE</>}
          </div>
        </div>

        {/* Speed Upgrade */}
        <div className={`p-4 rounded-2xl border-2 transition-all transform active:scale-[0.98] ${
          canAffordSpeed ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60 cursor-pointer' : 'border-slate-800 cursor-not-allowed'
        }`}
        onClick={() => canAffordSpeed && onUpgradeSpeed()}>
          <div className="flex justify-between items-center mb-1">
            <span className="font-black text-sm text-slate-200 flex items-center gap-2">
              <Zap size={14} className="text-amber-400" /> FLEET SPEED
            </span>
            <span className={`font-mono text-sm font-black ${canAffordSpeed ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${COST_UPGRADE_SPEED}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mb-3 leading-tight">Current: {fleetSpeed.toFixed(1)} floors/sec. Increase travel velocity.</p>
          <div className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
            canAffordSpeed ? 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-500'
          }`}>
            UPGRADE
          </div>
        </div>

        {/* Capacity Upgrade */}
        <div className={`p-4 rounded-2xl border-2 transition-all transform active:scale-[0.98] ${
          canAffordCap ? 'border-purple-500/30 bg-purple-500/5 hover:border-purple-500/60 cursor-pointer' : 'border-slate-800 cursor-not-allowed'
        }`}
        onClick={() => canAffordCap && onUpgradeCapacity()}>
          <div className="flex justify-between items-center mb-1">
            <span className="font-black text-sm text-slate-200 flex items-center gap-2">
              <Users size={14} className="text-purple-400" /> PASSENGER CAP.
            </span>
            <span className={`font-mono text-sm font-black ${canAffordCap ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${COST_UPGRADE_CAPACITY}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mb-3 leading-tight">Current: {fleetCapacity} pax. Carry more people at once.</p>
          <div className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
            canAffordCap ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg' : 'bg-slate-800 text-slate-500'
          }`}>
            UPGRADE
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-5 border-t border-slate-800">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter mb-2">
          <span className="text-slate-500">FLEET SIZE</span>
          <span className="text-indigo-400">{elevatorCount} / {MAX_ELEVATORS} UNITS</span>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-700"
            style={{ width: `${(elevatorCount / MAX_ELEVATORS) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Upgrades;
