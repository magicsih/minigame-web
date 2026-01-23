
import React from 'react';

const Payments: React.FC = () => {
  const transactions = [
    { id: 'TX123', date: '2023.10.25', name: '김영희 돌보미', amount: 30000, duration: 2, status: 'completed', insurance: true },
    { id: 'TX124', date: '2023.10.24', name: '이정수 돌보미', amount: 18000, duration: 1, status: 'completed', insurance: true },
    { id: 'TX125', date: '2023.10.22', name: '박미숙 돌보미', amount: 42000, duration: 3, status: 'completed', insurance: true },
  ];

  return (
    <div className="space-y-6 pb-24 px-4 py-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">결제 & 보험</h1>
        <p className="text-sm text-slate-500">투명한 실시간 정산과 간병 보험 연동 현황입니다.</p>
      </header>

      {/* Insurance Status Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">간병 보험 활성화</h2>
          <span className="bg-white/20 text-[10px] px-2 py-1 rounded-full font-bold">현대해상 제휴</span>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/20 pb-2">
            <span className="text-sm opacity-80">보장 범위</span>
            <span className="text-sm font-bold">사고/낙상/대물 100%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-80">누적 사고 발생</span>
            <span className="text-sm font-bold">0건</span>
          </div>
        </div>
        <button className="w-full mt-6 py-3 bg-white text-emerald-700 font-bold rounded-2xl text-sm shadow-md hover:bg-emerald-50 transition-colors">
          상세 보장 내역 확인
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800">최근 이용 내역</h3>
        {transactions.map(tx => (
          <div key={tx.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 p-3 rounded-full text-lg">💳</div>
              <div>
                <p className="font-bold text-slate-900">{tx.name}</p>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xs text-slate-400">{tx.date}</span>
                  <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1 rounded">보험 적용됨</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">{tx.amount.toLocaleString()}원</p>
              <p className="text-[10px] text-slate-400">{tx.duration}시간 이용</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
        <p className="text-xs text-slate-500 leading-relaxed">
          * 모든 결제는 서비스 종료 즉시 간병인에게 실시간 정산됩니다. 
          플랫폼 수수료는 보험료를 포함하여 10%입니다.
        </p>
      </div>
    </div>
  );
};

export default Payments;
