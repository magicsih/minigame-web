import React, { useState } from 'react';
import { MOCK_CAREGIVERS, MOCK_JOBS, ICONS } from '../constants';

const MatchingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'find_caregiver' | 'find_job'>('find_caregiver');
  const [filterDuration, setFilterDuration] = useState<number | null>(null);

  const filteredCaregivers = MOCK_CAREGIVERS; // In a real app, filter by availability
  const filteredJobs = filterDuration 
    ? MOCK_JOBS.filter(j => j.duration === filterDuration) 
    : MOCK_JOBS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">돌봄 매칭 마켓플레이스</h2>
        <p className="text-slate-600">원하는 시간만큼, 신뢰할 수 있는 이웃 간병인을 만나보세요.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('find_caregiver')}
            className={`${
              activeTab === 'find_caregiver'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            간병인 찾기 (보호자용)
          </button>
          <button
            onClick={() => setActiveTab('find_job')}
            className={`${
              activeTab === 'find_job'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            일자리 찾기 (간병인용)
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map(hours => (
          <button
            key={hours}
            onClick={() => setFilterDuration(filterDuration === hours ? null : hours)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filterDuration === hours
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {hours}시간
          </button>
        ))}
        {filterDuration && (
          <button 
            onClick={() => setFilterDuration(null)}
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'find_caregiver' ? (
          filteredCaregivers.map((caregiver) => (
            <div key={caregiver.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <img className="h-12 w-12 rounded-full object-cover" src={caregiver.imageUrl} alt={caregiver.name} />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">{caregiver.name}</h3>
                      <div className="flex items-center text-sm text-yellow-500">
                        <ICONS.Award className="w-4 h-4 mr-1 fill-current" />
                        Lv.{caregiver.level} <span className="text-slate-400 mx-1">|</span> ⭐ {caregiver.rating}
                      </div>
                    </div>
                  </div>
                  <div className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-xs font-semibold">
                    인증됨
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {caregiver.badges.map(badge => (
                      <span key={badge} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div className="flex items-center">
                      <ICONS.CreditCard className="w-4 h-4 mr-2 text-slate-400" />
                      {caregiver.hourlyRate.toLocaleString()}원 / 시간
                    </div>
                    <div className="flex items-center">
                      <ICONS.Clock className="w-4 h-4 mr-2 text-slate-400" />
                      가능 시간: {caregiver.availableHours.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-4">
                <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                  매칭 요청하기
                </button>
              </div>
            </div>
          ))
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow relative">
              <div className="absolute top-0 right-0 p-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  모집중
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-1">{job.elderlyName}</h3>
                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <ICONS.MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-500">돌봄 시간</span>
                    <span className="text-sm font-bold text-slate-900">{job.duration}시간</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.needs.map(need => (
                      <span key={need} className="px-2 py-1 border border-slate-200 text-slate-600 text-xs rounded-md">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-4">
                <button className="w-full bg-white border border-teal-600 text-teal-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors">
                  지원하기
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MatchingSection;