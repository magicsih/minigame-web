import React, { useEffect, useState } from 'react';
import { ICONS } from '../constants';

const PaymentDashboard: React.FC = () => {
  const hourlyRate = 25000;
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  
  const earned = Math.floor((hourlyRate / 3600) * elapsedSeconds);
  const insuranceDeduction = Math.floor(earned * 0.034); // Approx 3.4%
  const platformFee = Math.floor(earned * 0.05); // 5%
  const netIncome = earned - insuranceDeduction - platformFee;

  useEffect(() => {
    // Fixed: Use 'any' type to avoid NodeJS namespace error in browser environment
    let interval: any;
    if (isWorking) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <ICONS.ShieldCheck className="w-6 h-6 mr-2 text-teal-400" />
              실시간 안심 정산
            </h2>
            <p className="text-slate-400 text-sm mt-1">간병 보험 연동 및 실시간 적립 중</p>
          </div>
          <div className="text-right">
             <div className="text-xs text-slate-400 uppercase tracking-widest">Status</div>
             <div className={`font-bold ${isWorking ? 'text-green-400 animate-pulse' : 'text-slate-500'}`}>
               {isWorking ? '● 근무 중' : '○ 대기 중'}
             </div>
          </div>
        </div>

        <div className="p-8 text-center">
          <div className="text-slate-500 mb-2 font-medium">현재 근무 시간</div>
          <div className="text-5xl font-mono font-bold text-slate-800 mb-8 tracking-wider">
            {formatTime(elapsedSeconds)}
          </div>

          <div className="relative pt-4">
             {/* Progress bar background */}
             <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-teal-500 transition-all duration-1000 ${isWorking ? 'w-full animate-pulse' : 'w-0'}`} style={{ width: isWorking ? '100%' : '0%' }}></div>
             </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="text-slate-500 text-xs mb-1">총 발생 금액</div>
              <div className="text-xl font-bold text-slate-900">{earned.toLocaleString()}원</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] px-2 py-1 rounded-bl-lg font-bold">보험 연동</div>
              <div className="text-slate-500 text-xs mb-1">공제 (보험/수수료)</div>
              <div className="text-xl font-bold text-red-400">-{ (insuranceDeduction + platformFee).toLocaleString() }원</div>
            </div>
            <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
              <div className="text-teal-600 text-xs mb-1 font-bold">실시간 정산 가능액</div>
              <div className="text-2xl font-bold text-teal-700">{Math.max(0, netIncome).toLocaleString()}원</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 flex justify-between items-center">
          <button 
            onClick={() => setIsWorking(!isWorking)}
            className={`px-6 py-3 rounded-lg font-bold text-white transition-colors ${
              isWorking 
              ? 'bg-red-500 hover:bg-red-600 shadow-md' 
              : 'bg-teal-600 hover:bg-teal-700 shadow-md'
            }`}
          >
            {isWorking ? '근무 종료' : '근무 시작'}
          </button>
          
          <button 
            disabled={!isWorking || netIncome < 1000}
            className="text-teal-600 font-medium text-sm hover:underline disabled:text-slate-300 disabled:no-underline"
            onClick={() => alert(`정산 요청 완료: ${netIncome}원이 계좌로 송금됩니다.`)}
          >
            지금 즉시 정산하기 &rarr;
          </button>
        </div>
      </div>
      
      <p className="mt-4 text-center text-xs text-slate-400">
        * 메리츠화재 간병인 배상책임보험이 자동으로 적용되는 구간입니다.
      </p>
    </div>
  );
};

export default PaymentDashboard;