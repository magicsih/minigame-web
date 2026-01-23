import React, { useState } from 'react';
import { ICONS } from '../constants';
import { BioData, CareAdvice } from '../types';

const AIGuide: React.FC = () => {
  const [advice, setAdvice] = useState<CareAdvice | null>(null);
  
  // Default mock input for demonstration
  const [bioData, setBioData] = useState<BioData>({
    heartRate: 88,
    bloodPressureSys: 135,
    bloodPressureDia: 85,
    bloodSugar: 110,
    bodyTemp: 36.5,
    mood: "다소 불안해하심",
    lastMealTime: "3시간 전 (점심)"
  });

  const handleAnalyze = () => {
    setAdvice({
      riskLevel: "Low",
      immediateAction: "기본 활력 징후를 확인하고 무리 없는 활동을 유지하세요.",
      activityRecommendation: "가벼운 스트레칭과 10분 산책을 권장합니다.",
      dietaryAdvice: "수분 섭취를 도와주고 과도한 카페인을 피하세요.",
      conversationStarter: "최근 관심사나 오늘 기분에 대해 가볍게 대화를 시작해보세요."
    });
  };

  const handleInputChange = (field: keyof BioData, value: string | number) => {
    setBioData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center mb-6">
          <div className="bg-teal-100 p-3 rounded-full mr-4">
            <ICONS.Activity className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">바이오 데이터 입력</h2>
            <p className="text-sm text-slate-500">어르신의 현재 상태를 입력하면 기본 돌봄 가이드를 제공합니다.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">심박수 (BPM)</label>
              <input 
                type="number" 
                value={bioData.heartRate}
                onChange={(e) => handleInputChange('heartRate', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">체온 (°C)</label>
              <input 
                type="number" 
                step="0.1"
                value={bioData.bodyTemp}
                onChange={(e) => handleInputChange('bodyTemp', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">혈압 (수축기)</label>
              <input 
                type="number" 
                value={bioData.bloodPressureSys}
                onChange={(e) => handleInputChange('bloodPressureSys', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">혈압 (이완기)</label>
              <input 
                type="number" 
                value={bioData.bloodPressureDia}
                onChange={(e) => handleInputChange('bloodPressureDia', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">혈당 (mg/dL)</label>
             <input 
                type="number" 
                value={bioData.bloodSugar}
                onChange={(e) => handleInputChange('bloodSugar', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">현재 기분/상태</label>
            <input 
              type="text" 
              value={bioData.mood}
              onChange={(e) => handleInputChange('mood', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
              placeholder="예: 편안함, 불안함, 졸림 등"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">마지막 식사</label>
            <input 
              type="text" 
              value={bioData.lastMealTime}
              onChange={(e) => handleInputChange('lastMealTime', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>

          <button 
            onClick={handleAnalyze}
            className="w-full py-3 rounded-lg font-bold text-white transition-all bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl"
          >
            기본 케어 가이드 보기
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="space-y-6">
        {advice ? (
          <div className="bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden animate-fade-in">
             <div className="bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-4">
                <h3 className="text-white font-bold text-lg flex items-center">
                  <ICONS.ShieldCheck className="w-5 h-5 mr-2" />
                  케어 리포트
                </h3>
             </div>
             <div className="p-6 space-y-6">
                
                {/* Risk Level */}
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                  <span className="text-slate-600 font-medium">현재 위험도</span>
                  <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                    advice.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                    advice.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {advice.riskLevel === 'High' ? '주의 필요' : advice.riskLevel === 'Moderate' ? '관찰 필요' : '안정적'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-teal-800 uppercase tracking-wide mb-2 flex items-center">
                      <ICONS.Activity className="w-4 h-4 mr-2" /> 즉각 조치 사항
                    </h4>
                    <p className="text-slate-700 bg-teal-50 p-3 rounded-lg text-sm leading-relaxed">
                      {advice.immediateAction}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-teal-800 uppercase tracking-wide mb-2 flex items-center">
                      <ICONS.Smile className="w-4 h-4 mr-2" /> 추천 활동
                    </h4>
                    <p className="text-slate-700 bg-teal-50 p-3 rounded-lg text-sm leading-relaxed">
                      {advice.activityRecommendation}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-teal-800 uppercase tracking-wide mb-2 flex items-center">
                      <ICONS.Heart className="w-4 h-4 mr-2" /> 식사 및 영양 가이드
                    </h4>
                    <p className="text-slate-700 bg-teal-50 p-3 rounded-lg text-sm leading-relaxed">
                      {advice.dietaryAdvice}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-teal-800 uppercase tracking-wide mb-2 flex items-center">
                      <ICONS.Users className="w-4 h-4 mr-2" /> 대화 주제 제안
                    </h4>
                    <p className="text-slate-700 bg-teal-50 p-3 rounded-lg text-sm leading-relaxed">
                      "{advice.conversationStarter}"
                    </p>
                  </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
            <ICONS.Activity className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">데이터를 입력하고 가이드 버튼을 눌러주세요.</p>
            <p className="text-sm mt-2">입력 정보에 기반한 <br/>기본 케어 가이드를 제공합니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGuide;