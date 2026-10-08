import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';

export const DefconBadge: React.FC = () => {
  const { defcon, setDefcon } = useCommand();

  const getDefconColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-red-600 text-white border-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]';
      case 2:
        return 'bg-red-950/80 text-red-300 border-red-700/80 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
      case 3:
        return 'bg-amber-950/80 text-amber-300 border-amber-600/80';
      case 4:
        return 'bg-blue-950/80 text-blue-300 border-blue-600/80';
      case 5:
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-600/80';
    }
  };

  const getDefconLabel = (level: number) => {
    switch (level) {
      case 1:
        return 'CRITICAL EVACUATION';
      case 2:
        return 'ELEVATED SURGE ALERT';
      case 3:
        return 'ACTIVE MONITORING';
      case 4:
        return 'INCREASED READINESS';
      case 5:
      default:
        return 'PEACETIME NORMAL';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`px-3 py-1 rounded border text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all ${getDefconColor(
          defcon
        )}`}
      >
        {defcon <= 2 ? (
          <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-spin" style={{ animationDuration: '6s' }} />
        ) : (
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        )}
        <span>DEFCON {defcon}</span>
        <span className="hidden xl:inline text-[10px] opacity-80 border-l border-red-500/30 pl-1.5 font-sans">
          {getDefconLabel(defcon)}
        </span>
      </div>

      {/* Mini quick selector */}
      <div className="hidden lg:flex items-center border border-red-900/40 rounded overflow-hidden bg-black/60 p-0.5">
        {[1, 2, 3, 4, 5].map(lvl => (
          <button
            key={lvl}
            onClick={() => setDefcon(lvl)}
            title={`Set DEFCON ${lvl}`}
            className={`px-1.5 py-0.5 text-[10px] font-mono transition-colors ${
              defcon === lvl
                ? 'bg-red-600 text-white font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-red-950/50'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>
    </div>
  );
};
