
import React from 'react';
import { Elevator, Passenger } from '../types';
import { User, Users, ChevronUp, ChevronDown } from 'lucide-react';

interface BuildingProps {
  elevators: Elevator[];
  waitingPassengers: Passenger[];
  floorCount: number;
}

const Building: React.FC<BuildingProps> = ({ elevators, waitingPassengers, floorCount }) => {
  const floors = Array.from({ length: floorCount }, (_, i) => floorCount - 1 - i);

  return (
    <div className="flex-1 flex gap-2 md:gap-4 overflow-hidden relative select-none">
      {/* Floor Labels */}
      <div className="flex flex-col justify-between w-8 md:w-12 py-2 border-r border-slate-800/50 bg-slate-950/20">
        {floors.map(floor => (
          <div key={floor} className="h-full flex items-center justify-center font-black text-slate-600 text-[10px] md:text-sm">
            {floor === 0 ? 'G' : floor}
          </div>
        ))}
      </div>

      {/* Waiting Area */}
      <div className="flex-1 flex flex-col justify-between relative min-w-0">
        {floors.map(floor => (
          <div key={floor} className="h-full border-b border-slate-800/40 flex items-center gap-1 px-1 md:px-2 overflow-x-auto overflow-y-hidden no-scrollbar">
            {waitingPassengers
              .filter(p => p.originFloor === floor)
              .map(p => (
                <div 
                  key={p.id} 
                  className="w-4 h-6 md:w-5 md:h-8 flex-shrink-0 relative group flex items-center justify-center"
                >
                  <User 
                    size={16} 
                    className={`transition-colors duration-500 ${
                      p.frustration > 75 ? 'text-red-500 animate-pulse' : 
                      p.frustration > 40 ? 'text-amber-400' : 'text-indigo-400'
                    }`} 
                  />
                  <div className="absolute -top-1 left-0 w-full h-[2px] bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-current transition-all duration-300" 
                      style={{ width: `${p.frustration}%`, color: p.frustration > 70 ? '#ef4444' : '#fbbf24' }} 
                    />
                  </div>
                  {/* Tooltip for Target */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap border border-slate-700">
                    To: {p.targetFloor}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Elevator Shafts */}
      <div className="flex gap-1 md:gap-3 px-1">
        {elevators.map((elev, idx) => (
          <div key={elev.id} className="w-10 md:w-16 h-full relative elevator-shaft rounded-xl bg-slate-900/50 border border-slate-800/50 overflow-hidden">
             {/* The moving elevator car */}
             <div 
               className={`absolute w-full h-[calc(100%/${floorCount})] bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg border-2 border-indigo-300/30 flex flex-col items-center justify-center transition-all duration-100 ease-linear shadow-[0_0_20px_rgba(79,70,229,0.4)] z-10`}
               style={{ 
                 bottom: `${(elev.currentFloor / (floorCount)) * 100}%`,
               }}
             >
               <div className="flex flex-col items-center gap-0.5">
                 <div className="text-[8px] md:text-[10px] font-black text-indigo-200">E{idx+1}</div>
                 <div className="flex items-center gap-0.5">
                    {elev.state === 'MOVING_UP' && <ChevronUp size={12} className="text-white animate-bounce" />}
                    {elev.state === 'MOVING_DOWN' && <ChevronDown size={12} className="text-white animate-bounce" />}
                    <span className="text-[10px] md:text-xs font-black text-white">{elev.passengers.length}</span>
                 </div>
               </div>
               
               {/* Capacity bar */}
               <div className="mt-1 w-3/4 h-1 bg-black/40 rounded-full overflow-hidden">
                 <div 
                   className={`h-full transition-all duration-300 ${
                     elev.passengers.length >= elev.capacity ? 'bg-red-400' : 'bg-emerald-400'
                   }`}
                   style={{ width: `${(elev.passengers.length / elev.capacity) * 100}%` }}
                 />
               </div>
             </div>

             {/* Dynamic Light Strip for Shaft */}
             <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="h-full w-0.5 bg-indigo-500 absolute left-1/2 -translate-x-1/2" />
             </div>

             {/* Floor Markers behind elevator */}
             {floors.map(floor => (
               <div 
                 key={floor} 
                 className="absolute w-full h-[calc(100%/${floorCount})] border-b border-slate-700/20 pointer-events-none"
                 style={{ bottom: `${(floor / floorCount) * 100}%` }}
               />
             ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Building;
