import React from 'react';
import { CommandProvider, useCommand } from './context/CommandContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { CriticalIncidentBanner } from './components/common/CriticalIncidentBanner';
import { Dashboard } from './pages/Dashboard';
import { CrowdMonitoring } from './pages/CrowdMonitoring';
import { PredictionEngine } from './pages/PredictionEngine';
import { RiskAssessment } from './pages/RiskAssessment';
import { RouteOptimization } from './pages/RouteOptimization';
import { ResourceAllocation } from './pages/ResourceAllocation';
import { AlertCenter } from './pages/AlertCenter';
import { MultimodalFusion } from './pages/MultimodalFusion';
import { Shield, Radio, Activity, Cpu, Lock } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, totalCrowdCount, defcon, highRiskCount } = useCommand();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'monitoring':
        return <CrowdMonitoring />;
      case 'prediction':
        return <PredictionEngine />;
      case 'risk':
        return <RiskAssessment />;
      case 'routes':
        return <RouteOptimization />;
      case 'resources':
        return <ResourceAllocation />;
      case 'alerts':
        return <AlertCenter />;
      case 'fusion':
        return <MultimodalFusion />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#06070a] tactical-grid overflow-y-auto">
      {/* Floating critical hazard strobe banner */}
      <CriticalIncidentBanner />

      {/* Main Canvas Scroll Area */}
      <main className="flex-1 p-4 md:p-6 min-w-0">
        {renderActivePage()}
      </main>

      {/* Command Center Status Bar Footer */}
      <footer className="h-9 border-t border-red-900/30 bg-[#07080d]/95 px-4 flex items-center justify-between text-[10px] font-mono text-neutral-400 select-none shrink-0">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <strong className="text-red-400 font-hud tracking-wider">AETHERIS C4ISR</strong> // REV 9.42
          </span>
          <span className="hidden md:inline text-neutral-400">|</span>
          <span className="hidden md:flex items-center gap-1 text-neutral-300">
            <Lock className="w-3 h-3 text-red-500" />
            GOV MIL-STD 810 CLASSIFIED GRID
          </span>
          <span className="hidden lg:inline text-neutral-400">|</span>
          <span className="hidden lg:inline text-neutral-400">
            SPATIAL-TEMPORAL NEURAL CORE (ST-GCN + B-LSTM)
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-neutral-400 hidden sm:inline">
            POPULATION: <strong className="text-white">{totalCrowdCount.toLocaleString()}</strong>
          </span>
          <span className="text-neutral-400">|</span>
          <span className="text-cyan-400">FPS: 60.0 // LATENCY: 12ms</span>
          <span className="text-neutral-400">|</span>
          <span className="text-emerald-400 font-bold">ALL SENSORS SYNCED</span>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <CommandProvider>
      <div className="min-h-screen w-full flex flex-col bg-[#050608] text-slate-200 overflow-hidden font-tactical">
        <Header />
        <div className="flex-1 flex min-h-0 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </CommandProvider>
  );
}

export default App;
