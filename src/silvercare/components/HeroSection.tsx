import React from 'react';
import { ICONS } from '../constants';
import { ViewState } from '../types';

interface HeroSectionProps {
  onChangeView: (view: ViewState) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onChangeView }) => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">안심할 수 있는</span>{' '}
                <span className="block text-teal-600 xl:inline">시간제 돌봄 매칭</span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                1시간부터 4시간까지, 필요한 만큼만 이용하세요. 
                건강 체크 기반 케어 가이드와 투명한 실시간 정산으로 
                어르신과 보호자 모두에게 최상의 경험을 제공합니다.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={() => onChangeView(ViewState.MATCHING)}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    돌봄 요청하기
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    onClick={() => onChangeView(ViewState.EDUCATION)}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    간병인 등록/교육
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://picsum.photos/1200/800?random=10"
          alt="Happy elderly person with caregiver"
        />
        <div className="absolute inset-0 bg-teal-900 mix-blend-multiply opacity-20 lg:hidden"></div>
      </div>
      
      {/* Feature Highlights */}
      <div className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white mb-4">
                <ICONS.Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">유연한 시간제 매칭</h3>
              <p className="mt-2 text-base text-slate-500">
                1~4시간 단위의 짧은 돌봄도 OK. 급한 용무가 있을 때 바로 매칭해드립니다.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white mb-4">
                <ICONS.ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">신뢰 기반 결제</h3>
              <p className="mt-2 text-base text-slate-500">
                시간당 실시간 정산 시스템과 간병 보험 자동 연동으로 투명성을 보장합니다.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white mb-4">
                <ICONS.Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">케어 가이드</h3>
              <p className="mt-2 text-base text-slate-500">
                입력한 바이오 데이터에 맞춘 기본 행동 지침을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;