import React from 'react';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';

export const CriticalIncidentBanner: React.FC = () => {
  const { alerts, setActiveTab, setSelectedSectorId } = useCommand();

  const criticalAlert = alerts.find(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE');

  if (!criticalAlert) return null;

  return (
    <div className="bg-red-950/90 border-b border-red-600/90 px-4 py-2 flex items-center justify-between text-xs font-mono text-red-200 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none">
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="flex items-center gap-1.5 bg-red-600 text-black px-2 py-0.5 rounded font-bold text-[10px] tracking-wider uppercase shrink-0">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>ACTIVE CRITICAL HAZARD</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-white uppercase truncate">{criticalAlert.headline}</span>
          <span className="text-neutral-400 hidden md:inline">|</span>
          <span className="text-neutral-300 hidden md:inline truncate">{criticalAlert.description}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0 pl-3">
        <button
          onClick={() => {
            setSelectedSectorId(criticalAlert.sectorId);
            setActiveTab('alerts');
          }}
          className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-[11px] flex items-center gap-1 transition-colors uppercase"
        >
          <span>INTERCEPT & DISPATCH</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
