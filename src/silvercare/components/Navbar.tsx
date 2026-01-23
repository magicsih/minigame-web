import React from 'react';
import { ICONS } from '../constants';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: ViewState.HOME, label: '홈', icon: ICONS.Heart },
    { id: ViewState.MATCHING, label: '매칭', icon: ICONS.Users },
    { id: ViewState.EDUCATION, label: '교육/성장', icon: ICONS.TrendingUp },
    { id: ViewState.AI_GUIDE, label: '케어 가이드', icon: ICONS.Activity },
    { id: ViewState.PAYMENT, label: '정산', icon: ICONS.CreditCard },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onChangeView(ViewState.HOME)}>
            <div className="bg-teal-600 p-1.5 rounded-lg mr-2">
              <ICONS.Heart className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">SilverCare</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'border-teal-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <item.icon className="w-4 h-4 mr-1.5" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            {/* Mobile menu button simplified for demo */}
            <button className="text-slate-500 hover:text-slate-700">
               <span className="sr-only">Open menu</span>
               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
               </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-2 px-1 z-50 safe-area-bottom">
         {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex flex-col items-center justify-center w-full py-1 ${
                currentView === item.id ? 'text-teal-600' : 'text-slate-400'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px]">{item.label}</span>
            </button>
         ))}
      </div>
    </nav>
  );
};

export default Navbar;