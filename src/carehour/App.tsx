
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Marketplace from './components/Marketplace';
import HealthCenter from './components/HealthCenter';
import Training from './components/Training';
import Payments from './components/Payments';

type Tab = 'marketplace' | 'health' | 'training' | 'payments';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('marketplace');

  const renderContent = () => {
    switch (activeTab) {
      case 'marketplace':
        return <Marketplace />;
      case 'health':
        return <HealthCenter />;
      case 'training':
        return <Training />;
      case 'payments':
        return <Payments />;
      default:
        return <Marketplace />;
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-slate-100">
      {/* Mobile-centric container */}
      <main className="w-full max-w-md bg-[#f8fafc] shadow-2xl min-h-screen relative overflow-x-hidden">
        {renderContent()}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  );
};

export default App;
