
import React from 'react';
import { GameStats } from '../types';
import { PackageCheck, Timer, UserX } from 'lucide-react';

interface DashboardProps {
  stats: GameStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="glass-effect p-4 rounded-xl flex items-center gap-4">
        <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-500">
          <PackageCheck size={24} />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase">Delivered</p>
          <p className="text-2xl font-bold">{stats.deliveredCount}</p>
        </div>
      </div>

      <div className="glass-effect p-4 rounded-xl flex items-center gap-4">
        <div className="bg-rose-500/10 p-3 rounded-lg text-rose-500">
          <UserX size={24} />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase">Frustrated</p>
          <p className="text-2xl font-bold">{stats.lostCount}</p>
        </div>
      </div>

      <div className="glass-effect p-4 rounded-xl flex items-center gap-4">
        <div className="bg-indigo-500/10 p-3 rounded-lg text-indigo-500">
          <Timer size={24} />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase">Wait Time</p>
          <p className="text-2xl font-bold">{Math.round(stats.averageWaitTime / 10)}s</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
