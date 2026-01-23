import React, { useState } from 'react';
import { ICONS } from '../constants';

const EducationModule: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [xp, setXp] = useState(2450);
  
  const level = Math.floor(xp / 1000) + 1;
  const nextLevelXp = level * 1000;
  const progress = ((xp % 1000) / 1000) * 100;

  const lessons = [
    { id: 1, title: "치매 어르신과의 대화법", type: "video", duration: "15분", xp: 150, locked: false },
    { id: 2, title: "낙상 사고 예방 가이드", type: "quiz", duration: "10분", xp: 100, locked: false },
    { id: 3, title: "긴급 상황 심폐소생술", type: "interactive", duration: "20분", xp: 200, locked: true },
    { id: 4, title: "당뇨 환자 식단 관리", type: "reading", duration: "10분", xp: 100, locked: true },
  ];

  const handleStartLesson = (id: number, lessonXp: number) => {
    setActiveLesson(id);
    // Simulate completion
    setTimeout(() => {
        alert("학습 완료! +" + lessonXp + " XP");
        setXp(prev => prev + lessonXp);
        setActiveLesson(null);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">나의 성장 레벨</h2>
            <p className="text-indigo-100">전문 간병인으로 성장하는 즐거움</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">Lv. {level}</div>
            <div className="text-sm text-indigo-200">다음 레벨까지 {nextLevelXp - xp} XP</div>
          </div>
        </div>
        <div className="w-full bg-indigo-900/50 rounded-full h-4 backdrop-blur-sm">
          <div 
            className="bg-yellow-400 h-4 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
        <ICONS.TrendingUp className="w-6 h-6 mr-2 text-teal-600" />
        추천 교육 모듈
      </h3>

      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <div 
            key={lesson.id} 
            className={`flex items-center p-4 bg-white border rounded-xl transition-all ${
              lesson.locked 
                ? 'border-slate-200 opacity-60' 
                : 'border-slate-200 hover:border-teal-400 hover:shadow-md cursor-pointer'
            }`}
            onClick={() => !lesson.locked && handleStartLesson(lesson.id, lesson.xp)}
          >
            <div className={`p-3 rounded-lg mr-4 ${lesson.locked ? 'bg-slate-100' : 'bg-teal-50'}`}>
              {lesson.locked ? (
                <ICONS.ShieldCheck className="w-6 h-6 text-slate-400" />
              ) : (
                <ICONS.Award className="w-6 h-6 text-teal-600" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">{lesson.title}</h4>
              <div className="flex items-center text-xs text-slate-500 mt-1">
                <span className="mr-3">{lesson.type === 'video' ? '📺 영상 학습' : lesson.type === 'quiz' ? '📝 퀴즈' : '🎮 실습'}</span>
                <span className="mr-3 flex items-center"><ICONS.Clock className="w-3 h-3 mr-1"/> {lesson.duration}</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                lesson.locked ? 'bg-slate-100 text-slate-400' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {lesson.xp} XP
              </span>
              {activeLesson === lesson.id && (
                 <div className="mt-1 text-xs text-teal-600 animate-pulse">학습 중...</div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h4 className="font-medium text-slate-900 mb-2">🏅 획득한 배지</h4>
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl border-2 border-yellow-200">👑</div>
                <span className="text-xs mt-1 text-slate-600">친절왕</span>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl border-2 border-blue-200">🚑</div>
                <span className="text-xs mt-1 text-slate-600">응급처치</span>
            </div>
            <div className="flex flex-col items-center opacity-40 grayscale">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl border-2 border-purple-200">🧠</div>
                <span className="text-xs mt-1 text-slate-600">치매전문</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EducationModule;