import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MatchingSection from './components/MatchingSection';
import EducationModule from './components/EducationModule';
import AIGuide from './components/AIGuide';
import PaymentDashboard from './components/PaymentDashboard';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <HeroSection onChangeView={setCurrentView} />;
      case ViewState.MATCHING:
        return <MatchingSection />;
      case ViewState.EDUCATION:
        return <EducationModule />;
      case ViewState.AI_GUIDE:
        return <AIGuide />;
      case ViewState.PAYMENT:
        return <PaymentDashboard />;
      default:
        return <HeroSection onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-16 md:pb-0">
      <Navbar currentView={currentView} onChangeView={setCurrentView} />
      <main className="animate-fade-in">
        {renderContent()}
      </main>
      
      {/* Footer */}
      {currentView === ViewState.HOME && (
        <footer className="bg-slate-50 border-t border-slate-200 mt-12 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; 2024 SilverCare Connect. All rights reserved.</p>
            <p className="mt-2">노인 돌봄 통합 마켓플레이스 | 케어 가이드 | 실시간 안심 정산</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;