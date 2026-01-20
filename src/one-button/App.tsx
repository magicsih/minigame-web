
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, FacilityType } from './types';
import { INITIAL_STATE, UPGRADES, PHASE_THRESHOLDS } from './constants';
import { formatNumber, formatInteger } from './components/Formatters';
import { Play, Settings2, Factory, Building2, Landmark, RefreshCw, Zap, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('one_button_save');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('one_button_save', JSON.stringify(state));
  }, [state]);

  // Derived Values
  const workMultiplier = useMemo(() => {
    const workbenchBonus = Math.pow(1.5, state.workbenches);
    const cityBonus = Math.pow(2, state.cities);
    const civBonus = 1 + (state.civPoints * 0.1);
    return workbenchBonus * cityBonus * civBonus;
  }, [state.workbenches, state.cities, state.civPoints]);

  const workPerSecond = useMemo(() => {
    const baseProduction = (state.workers * 0.5) + (state.factories * 5);
    return baseProduction * workMultiplier;
  }, [state.workers, state.factories, workMultiplier]);

  const workPerClick = useMemo(() => {
    const base = state.nations >= 1 ? 0.01 : 1;
    return base * (1 + state.civPoints * 0.05); 
  }, [state.nations, state.civPoints]);

  // Phase Logic
  useEffect(() => {
    let newPhase = state.currentPhase;
    if (state.currentPhase === 0 && state.maxWorkEver >= PHASE_THRESHOLDS.PHASE_1) {
      newPhase = 1;
      setNotification("노동을 위임할 수 있게 되었습니다. '일꾼' 해금.");
    } else if (state.currentPhase === 1 && state.maxWorkEver >= PHASE_THRESHOLDS.PHASE_2) {
      newPhase = 2;
      setNotification("효율이 핵심입니다. '작업대' 해금.");
    } else if (state.currentPhase === 2 && state.maxWorkEver >= PHASE_THRESHOLDS.PHASE_3) {
      newPhase = 3;
      setNotification("자원을 정제할 수 있습니다. '원자재' 및 '공장' 해금.");
    } else if (state.currentPhase === 3 && state.maxWorkEver >= PHASE_THRESHOLDS.PHASE_4) {
      newPhase = 4;
      setNotification("인프라 규모가 확장됩니다. '도시' 해금.");
    } else if (state.currentPhase === 4 && state.cities >= PHASE_THRESHOLDS.PHASE_5) {
      newPhase = 5;
      setNotification("고도 문명에 도달했습니다. '국가' 해금. 시스템이 당신을 대체합니다.");
    }

    if (newPhase !== state.currentPhase) {
      setState(prev => ({ ...prev, currentPhase: newPhase }));
    }
  }, [state.maxWorkEver, state.cities, state.currentPhase]);

  // Idle Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const addedWork = workPerSecond / 10;
        const newWork = prev.work + addedWork;
        return {
          ...prev,
          work: newWork,
          maxWorkEver: Math.max(prev.maxWorkEver, newWork)
        };
      });
    }, 100);
    return () => clearInterval(interval);
  }, [workPerSecond]);

  // Actions
  const handleClick = useCallback(() => {
    setState(prev => {
      const newWork = prev.work + workPerClick;
      return {
        ...prev,
        work: newWork,
        maxWorkEver: Math.max(prev.maxWorkEver, newWork)
      };
    });
  }, [workPerClick]);

  const handleRefine = useCallback(() => {
    setState(prev => {
      if (prev.work < 10) return prev;
      return {
        ...prev,
        work: prev.work - 10,
        material: prev.material + 1
      };
    });
  }, []);

  const buyUpgrade = useCallback((id: FacilityType) => {
    setState(prev => {
      const upgrade = UPGRADES.find(u => u.id === id);
      if (!upgrade || prev.currentPhase < upgrade.phaseRequired) return prev;

      let cost: number = 0;
      let costType: 'work' | 'material' = 'work';

      switch (id) {
        case FacilityType.WORKER:
          cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, prev.workers);
          break;
        case FacilityType.WORKBENCH:
          cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, prev.workbenches);
          break;
        case FacilityType.FACTORY:
          cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, prev.factories);
          costType = 'material';
          break;
        case FacilityType.CITY:
          cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, prev.cities);
          break;
        case FacilityType.NATION:
          cost = 100000 * Math.pow(upgrade.costMultiplier, prev.nations);
          break;
      }

      if (costType === 'work' && prev.work < cost) return prev;
      if (costType === 'material' && prev.material < cost) return prev;

      const newState = { ...prev };
      if (costType === 'work') newState.work -= cost;
      if (costType === 'material') newState.material -= cost;

      switch (id) {
        case FacilityType.WORKER: newState.workers++; break;
        case FacilityType.WORKBENCH: newState.workbenches++; break;
        case FacilityType.FACTORY: newState.factories++; break;
        case FacilityType.CITY: newState.cities++; break;
        case FacilityType.NATION: newState.nations++; break;
      }

      return newState;
    });
  }, []);

  const resetGame = useCallback(() => {
    if (state.nations < 1) return;
    const gainedPoints = Math.floor(Math.log10(state.maxWorkEver / 10000) * 5) + (state.nations * 10);
    const finalPoints = Math.max(1, gainedPoints);

    setState(prev => ({
      ...INITIAL_STATE,
      civPoints: prev.civPoints + finalPoints,
      totalResets: prev.totalResets + 1,
      maxWorkEver: 0 
    }));
    setNotification(`문명 리셋 완료. 숙련도 포인트를 ${finalPoints} 획득했습니다.`);
  }, [state.nations, state.maxWorkEver]);

  const getCost = (id: FacilityType) => {
    const upgrade = UPGRADES.find(u => u.id === id)!;
    switch (id) {
      case FacilityType.WORKER: return upgrade.baseCost * Math.pow(upgrade.costMultiplier, state.workers);
      case FacilityType.WORKBENCH: return upgrade.baseCost * Math.pow(upgrade.costMultiplier, state.workbenches);
      case FacilityType.FACTORY: return upgrade.baseCost * Math.pow(upgrade.costMultiplier, state.factories);
      case FacilityType.CITY: return upgrade.baseCost * Math.pow(upgrade.costMultiplier, state.cities);
      case FacilityType.NATION: return 100000 * Math.pow(upgrade.costMultiplier, state.nations);
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] animate-pulse-slow"></div>
      </div>

      {notification && (
        <div 
          className="fixed top-6 bg-white/10 border border-white/20 backdrop-blur-md px-6 py-3 rounded-full text-sm font-semibold shadow-2xl z-50 animate-bounce cursor-pointer text-center"
          onClick={() => setNotification(null)}
        >
          {notification}
        </div>
      )}

      <header className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 z-10">
        <div className="resource-card p-4 rounded-2xl flex flex-col items-center justify-center">
          <span className="text-xs uppercase tracking-widest text-zinc-500 mb-1">총 작업량</span>
          <span className="text-3xl font-mono font-bold text-blue-400">{formatInteger(state.work)}</span>
          <span className="text-[10px] text-zinc-600 mt-1">초당 +{formatNumber(workPerSecond)}</span>
        </div>
        
        {state.currentPhase >= 3 ? (
          <div className="resource-card p-4 rounded-2xl flex flex-col items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-zinc-500 mb-1">원자재</span>
            <span className="text-3xl font-mono font-bold text-emerald-400">{formatInteger(state.material)}</span>
            <button 
              onClick={handleRefine}
              disabled={state.work < 10}
              className="mt-2 text-[10px] px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-30 rounded-full transition-colors uppercase font-bold tracking-tighter"
            >
              정제 (작업량 10 소모)
            </button>
          </div>
        ) : (
          <div className="resource-card p-4 rounded-2xl flex flex-col items-center justify-center opacity-30 border-dashed">
            <span className="text-xs uppercase tracking-widest text-zinc-500">원자재</span>
            <span className="text-xl font-mono font-bold text-zinc-700">잠김</span>
          </div>
        )}

        {state.civPoints > 0 ? (
          <div className="resource-card p-4 rounded-2xl flex flex-col items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-zinc-500 mb-1">문명 숙련도</span>
            <span className="text-3xl font-mono font-bold text-amber-400">{state.civPoints}</span>
            <span className="text-[10px] text-zinc-600 mt-1">생산 효율 +{(state.civPoints * 10)}%</span>
          </div>
        ) : (
          <div className="resource-card p-4 rounded-2xl flex flex-col items-center justify-center opacity-30 border-dashed">
            <span className="text-xs uppercase tracking-widest text-zinc-500">유산</span>
            <span className="text-xl font-mono font-bold text-zinc-700">잠김</span>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full z-10 mb-12">
        <div className="relative group">
          <div className={`absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${state.nations >= 1 ? 'grayscale opacity-5' : ''}`}></div>
          <button 
            onClick={handleClick}
            className={`
              relative w-48 h-48 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center glow-button border-4
              ${state.nations >= 1 
                ? 'bg-zinc-900 border-zinc-800 cursor-not-allowed opacity-50' 
                : 'bg-zinc-800 border-zinc-700 active:bg-zinc-700'
              }
            `}
          >
            <Play className={`w-12 h-12 md:w-16 md:h-16 mb-2 ${state.nations >= 1 ? 'text-zinc-600' : 'text-blue-500 fill-blue-500'}`} />
            <span className={`text-xl font-extrabold uppercase tracking-widest ${state.nations >= 1 ? 'text-zinc-600' : 'text-zinc-200'}`}>
              일하기
            </span>
            <span className="text-xs font-mono text-zinc-500 mt-2">
              +{formatNumber(workPerClick)}
            </span>
          </button>
        </div>
        
        {state.nations >= 1 && (
          <p className="mt-8 text-zinc-500 text-sm italic animate-pulse text-center max-w-xs">
            시스템이 자급자족을 시작했습니다.<br/>당신의 노동은 더 이상 필요하지 않습니다.
          </p>
        )}
      </main>

      <section className="w-full max-w-5xl z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {UPGRADES.map((u) => {
            const isLocked = state.currentPhase < u.phaseRequired;
            const cost = getCost(u.id);
            const canAfford = u.id === FacilityType.FACTORY ? state.material >= cost : state.work >= cost;
            const count = (state as any)[u.id.toLowerCase() + 's'] || 0;
            
            const Icon = {
              [FacilityType.WORKER]: Zap,
              [FacilityType.WORKBENCH]: Settings2,
              [FacilityType.FACTORY]: Factory,
              [FacilityType.CITY]: Building2,
              [FacilityType.NATION]: Landmark
            }[u.id];

            return (
              <button 
                key={u.id}
                onClick={() => buyUpgrade(u.id)}
                disabled={isLocked || !canAfford}
                className={`
                  text-left p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden
                  ${isLocked 
                    ? 'bg-zinc-950/40 border-zinc-900 opacity-40 grayscale cursor-not-allowed border-dashed' 
                    : canAfford 
                      ? 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/80 hover:border-blue-500/50' 
                      : 'bg-zinc-900/30 border-zinc-800 opacity-60'
                  }
                `}
              >
                {isLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] z-20">
                    <Lock className="w-6 h-6 text-zinc-600 mb-1" />
                    <span className="text-[10px] uppercase font-black text-zinc-500 tracking-tighter">
                      {
                        u.id === FacilityType.NATION ? '도시 5개에서 해금' : 
                        u.id === FacilityType.CITY ? '작업량 10k에서 해금' :
                        u.id === FacilityType.FACTORY ? '작업량 1k에서 해금' :
                        u.id === FacilityType.WORKBENCH ? '작업량 100에서 해금' : '작업량 10에서 해금'
                      }
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-zinc-700/50 rounded-lg">
                    <Icon className={`w-5 h-5 ${isLocked ? 'text-zinc-600' : 'text-blue-400'}`} />
                  </div>
                  <span className="font-mono text-lg font-bold text-zinc-400">x{count}</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white mb-1">{u.name}</h3>
                  <p className="text-[10px] text-zinc-500 leading-tight mb-4">{u.description}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-zinc-700/50">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">비용</span>
                  <span className={`text-xs font-mono font-bold ${isLocked ? 'text-zinc-700' : canAfford ? 'text-blue-400' : 'text-red-400'}`}>
                    {formatInteger(cost)} {u.id === FacilityType.FACTORY ? '원자재' : '작업량'}
                  </span>
                </div>
              </button>
            );
          })}

          {state.nations >= 1 && (
            <button 
              onClick={resetGame}
              className="col-span-1 md:col-span-2 lg:col-span-3 mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 p-6 rounded-2xl flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl group-hover:rotate-180 transition-transform duration-700">
                  <RefreshCw className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-extrabold text-white">시스템 전이 (REBIRTH)</h3>
                  <p className="text-sm text-white/80">현재 상태를 초월하여 문명 숙련도를 획득합니다.</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xs uppercase font-bold text-white/60">예상 획득</span>
                <span className="text-3xl font-mono font-bold text-white">
                  +{Math.max(1, Math.floor(Math.log10(state.maxWorkEver / 10000) * 5) + (state.nations * 10))}
                </span>
              </div>
            </button>
          )}
        </div>
      </section>

      <footer className="mt-auto pt-12 pb-4 text-zinc-700 text-[10px] uppercase tracking-[0.2em] font-bold">
        원 버튼 &bull; 시뮬레이션 {state.currentPhase}단계 &bull; v1.2.0
      </footer>
    </div>
  );
};

export default App;
