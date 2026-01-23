
import React from 'react';

type Tab = 'marketplace' | 'health' | 'training' | 'payments';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'marketplace' as const, label: '매칭', icon: '🔍' },
    { id: 'health' as const, label: '건강', icon: '📊' },
    { id: 'training' as const, label: '교육', icon: '🎓' },
    { id: 'payments' as const, label: '결제', icon: '💳' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-4 py-2 flex justify-between items-center shadow-lg sm:max-w-md sm:mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center flex-1 transition-colors duration-200 ${
            activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <span className="text-2xl">{tab.icon}</span>
          <span className="text-xs mt-1 font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
