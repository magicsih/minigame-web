
import React, { useState } from 'react';
import { MOCK_CAREGIVERS } from '../constants';
import { Caregiver } from '../types';

const Marketplace: React.FC = () => {
  const [hours, setHours] = useState(1);

  return (
    <div className="space-y-6 pb-20">
      <header className="px-4 py-6 bg-white border-b border-slate-200 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-900">돌봄 매칭</h1>
        <p className="text-sm text-slate-500">1~4시간 단위의 유연한 돌봄 서비스를 찾아보세요.</p>
        
        <div className="mt-4 flex items-center space-x-2">
          {[1, 2, 3, 4].map(h => (
            <button
              key={h}
              onClick={() => setHours(h)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                hours === h 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {h}시간
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 grid grid-cols-1 gap-4">
        {MOCK_CAREGIVERS.map((caregiver) => (
          <div key={caregiver.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <img src={caregiver.avatar} alt={caregiver.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{caregiver.name}</h3>
                    <p className="text-xs text-blue-600 font-semibold">LV.{caregiver.level} 마스터 돌보미</p>
                  </div>
                  <div className="flex items-center text-amber-500">
                    <span className="text-sm font-bold">★ {caregiver.rating}</span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {caregiver.specialties.map(s => (
                    <span key={s} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] rounded-md font-medium">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">예상 비용 ({hours}시간)</p>
                <p className="text-lg font-bold text-slate-900">{(caregiver.hourlyRate * hours).toLocaleString()}원</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                예약하기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
