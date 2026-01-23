
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { HEALTH_METRICS } from '../constants';

const HealthCenter: React.FC = () => {
  const chartData = HEALTH_METRICS.heartRate.map((hr, i) => ({ time: `${i}:00`, hr }));

  return (
    <div className="space-y-6 pb-24 px-4 py-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">실시간 건강 분석</h1>
        <p className="text-sm text-slate-500">부모님의 바이오 데이터를 AI가 분석합니다.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 font-medium">오늘 걸음</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{HEALTH_METRICS.steps.toLocaleString()}</p>
          <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: '65%' }}></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 font-medium">수면 시간</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{HEALTH_METRICS.sleepHours}h</p>
          <p className="text-[10px] text-green-500 mt-1 font-medium">평소보다 +30분</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 h-64">
        <p className="text-sm font-bold text-slate-800 mb-4">심박수 변화 (24h)</p>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="time" hide />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
            <Tooltip />
            <Area type="monotone" dataKey="hr" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHr)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Care Guide Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="text-8xl">✨</span>
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold flex items-center">
            <span className="mr-2">🩺</span> 오늘의 돌봄 가이드
          </h2>
          <p className="text-blue-100 text-sm mt-1">현재 상태에 맞춘 기본 돌봄 체크리스트입니다.</p>

          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 text-sm leading-relaxed border border-white/20">
            <ul className="list-disc list-inside space-y-2">
              <li>수분 섭취를 유도하고, 30분 간격으로 가벼운 스트레칭을 도와주세요.</li>
              <li>심박수가 높아질 때는 휴식 시간을 10분 이상 확보해주세요.</li>
              <li>짧은 산책은 10~15분 내로 진행하고, 어지럼 증상 여부를 확인하세요.</li>
              <li>수면 부족 시 오후 카페인 섭취를 줄이고 조용한 환경을 마련하세요.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCenter;
