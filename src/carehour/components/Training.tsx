
import React from 'react';
import { MOCK_TRAINING_COURSES } from '../constants';

const Training: React.FC = () => {
  return (
    <div className="space-y-6 pb-24 px-4 py-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">성장 센터</h1>
        <p className="text-sm text-slate-500">교육을 이수하고 숙련도와 등급을 높이세요.</p>
      </header>

      {/* Progress Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">현재 레벨</p>
            <h2 className="text-3xl font-black text-blue-600">LV. 12</h2>
          </div>
          <div className="bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-xs text-blue-600 font-bold">상위 15% 돌보미</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>EXP 4,500 / 5,000</span>
            <span>90%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full w-[90%]" />
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-500">다음 레벨까지 500포인트가 더 필요합니다.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <h3 className="font-bold text-lg text-slate-800">추천 교육 모듈</h3>
        {MOCK_TRAINING_COURSES.map(course => (
          <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md mb-2 uppercase ${
                  course.category === 'safety' ? 'bg-red-50 text-red-500' :
                  course.category === 'nutrition' ? 'bg-orange-50 text-orange-500' : 'bg-purple-50 text-purple-500'
                }`}>
                  {course.category}
                </span>
                <span className="text-xs font-bold text-blue-600">+{course.points}P</span>
              </div>
              <h4 className="font-bold text-slate-900 mb-3">{course.title}</h4>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex-1 mr-4">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
                <button className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  course.progress > 0 
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  {course.progress > 0 ? '계속하기' : '시작하기'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Training;
