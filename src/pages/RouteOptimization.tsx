import React, { useState, useMemo } from 'react';
import {
  Route as RouteIcon,
  Zap,
  CheckCircle2,
  Lock,
  Unlock,
  Navigation,
  Timer
} from 'lucide-react';
import { useCommand } from '../context/CommandContext';
import { TacticalCard } from '../components/common/TacticalCard';
import { TacticalMapCanvas } from '../components/common/TacticalMapCanvas';
import type { RouteCorridor } from '../types';

export const RouteOptimization: React.FC = () => {
  const {
    corridors,
    toggleCorridorBlock,
    triggerEmergencyEvacuation,
    totalCrowdCount,
  } = useCommand();

  const [selectedCorridorId, setSelectedCorridorId] = useState<string>(corridors[0].id);

  const selectedCorridor = corridors.find((c: RouteCorridor) => c.id === selectedCorridorId) || corridors[0];

  // Compute Estimated Evacuation Clearance Time (EECT) in minutes
  const evacuationMetrics = useMemo(() => {
    const openCorridors = corridors.filter((c: RouteCorridor) => !c.isBlocked);
    const totalThroughput = openCorridors.reduce((acc: number, c: RouteCorridor) => acc + c.currentFlowPaxMin, 0);
    const maxCapacityThroughput = openCorridors.reduce((acc: number, c: RouteCorridor) => acc + c.maxThroughputPaxMin, 0);

    // EECT = Total Crowd / Total effective throughput per min
    const currentEECT = totalThroughput > 0 ? (totalCrowdCount / totalThroughput).toFixed(1) : '∞';
    const optimizedEECT = maxCapacityThroughput > 0 ? (totalCrowdCount / (maxCapacityThroughput * 0.9)).toFixed(1) : '∞';

    const blockedCount = corridors.filter((c: RouteCorridor) => c.isBlocked).length;
    const congestedCount = corridors.filter((c: RouteCorridor) => c.congestionPercent > 75 && !c.isBlocked).length;

    return {
      currentEECT,
      optimizedEECT,
      totalThroughput,
      maxCapacityThroughput,
      blockedCount,
      congestedCount
    };
  }, [corridors, totalCrowdCount]);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-3 bg-red-950/20 border border-red-900/40 rounded flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-hud uppercase tracking-wider text-white flex items-center gap-2">
            <RouteIcon className="w-5 h-5 text-red-500" />
            DYNAMIC EGRESS & EVACUATION ROUTE OPTIMIZATION
          </h2>
          <p className="text-xs text-neutral-400 font-mono">
            ALGORITHMIC MIN-COST MAX-FLOW (MCMF) // REAL-TIME DIGITAL SIGNAGE OVERRIDES
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerEmergencyEvacuation()}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.5)] active:scale-95 animate-pulse"
          >
            <Zap className="w-4 h-4" />
            <span>TRIGGER ALL-SECTOR EVACUATION</span>
          </button>
        </div>
      </div>

      {/* Top Clearance Time HUD Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="hud-panel p-3 rounded border border-red-900/40 bg-black/60 font-mono">
          <div className="text-[10px] text-neutral-400 flex items-center gap-1">
            <Timer className="w-3.5 h-3.5 text-red-400" />
            CURRENT EVACUATION TIME (EECT)
          </div>
          <div className="text-2xl font-bold text-red-400 mt-1">
            {evacuationMetrics.currentEECT} <span className="text-xs text-neutral-400">MINUTES</span>
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">
            Standard laminar egress model
          </div>
        </div>

        <div className="hud-panel p-3 rounded border border-red-900/40 bg-black/60 font-mono">
          <div className="text-[10px] text-neutral-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            AI-OPTIMIZED CLEARANCE
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {evacuationMetrics.optimizedEECT} <span className="text-xs text-neutral-400">MINUTES</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            Δ -{Math.max(0, parseFloat(evacuationMetrics.currentEECT) - parseFloat(evacuationMetrics.optimizedEECT)).toFixed(1)}m SAVED WITH DIVERTER
          </div>
        </div>

        <div className="hud-panel p-3 rounded border border-red-900/40 bg-black/60 font-mono">
          <div className="text-[10px] text-neutral-400">NETWORK FLOW THROUGHPUT</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            {evacuationMetrics.totalThroughput.toLocaleString()}{' '}
            <span className="text-xs text-neutral-400">PAX/MIN</span>
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">
            Max Cap: {evacuationMetrics.maxCapacityThroughput.toLocaleString()} /min
          </div>
        </div>

        <div className="hud-panel p-3 rounded border border-red-900/40 bg-black/60 font-mono">
          <div className="text-[10px] text-neutral-400">CHOKE CORRIDORS</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {evacuationMetrics.congestedCount}{' '}
            <span className="text-xs text-neutral-400">CONGESTED</span>
          </div>
          <div className="text-[10px] text-red-400 mt-1">
            {evacuationMetrics.blockedCount} PATHWAYS BLOCKED
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Network Map & Corridor Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Vector Topology Map (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <TacticalCard
            title="EGRESS CORRIDOR NETWORK TOPOLOGY"
            subtitle="GREEN = LAMINAR // AMBER = MODERATE // RED = CRITICAL // DASHED = BLOCKED"
            badge={
              <span className="text-[10px] font-mono text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                8 MONITORED ARTERIALS
              </span>
            }
          >
            <TacticalMapCanvas height={360} />
          </TacticalCard>

          {/* Detailed Corridor Inspector & Toggle Controls */}
          <TacticalCard
            title={`CORRIDOR INSPECTOR // ${selectedCorridor.name.toUpperCase()}`}
            subtitle={`CONNECTOR: ${selectedCorridor.fromSector.toUpperCase()} ➔ ${selectedCorridor.toSector.toUpperCase()}`}
            badge={
              selectedCorridor.isBlocked ? (
                <span className="text-[10px] font-mono bg-red-600 text-white font-bold px-2 py-0.5 rounded animate-pulse">
                  BLOCKED / HAZARD
                </span>
              ) : selectedCorridor.congestionPercent > 80 ? (
                <span className="text-[10px] font-mono bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded">
                  HEAVY CONGESTION ({selectedCorridor.congestionPercent}%)
                </span>
              ) : (
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                  CLEAR FLOW ({selectedCorridor.congestionPercent}%)
                </span>
              )
            }
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-black/60 p-2 rounded border border-neutral-850">
                  <div className="text-[10px] text-neutral-400">CORRIDOR WIDTH</div>
                  <div className="text-base font-bold text-white">{selectedCorridor.widthMeters} METERS</div>
                  <div className="text-[9px] text-neutral-500">Physical aperture</div>
                </div>

                <div className="bg-black/60 p-2 rounded border border-neutral-850">
                  <div className="text-[10px] text-neutral-400">CURRENT FLOW</div>
                  <div className="text-base font-bold text-cyan-400">
                    {selectedCorridor.currentFlowPaxMin} /min
                  </div>
                  <div className="text-[9px] text-neutral-500">Max: {selectedCorridor.maxThroughputPaxMin}</div>
                </div>

                <div className="bg-black/60 p-2 rounded border border-neutral-850">
                  <div className="text-[10px] text-neutral-400">CONGESTION LOAD</div>
                  <div className="text-base font-bold text-amber-400">
                    {selectedCorridor.congestionPercent}%
                  </div>
                  <div className="text-[9px] text-neutral-500">
                    {selectedCorridor.congestionPercent > 85 ? 'Turbulent Choke' : 'Optimal'}
                  </div>
                </div>

                <div className="bg-black/60 p-2 rounded border border-neutral-850">
                  <div className="text-[10px] text-neutral-400">TYPE</div>
                  <div className="text-base font-bold text-emerald-400">
                    {selectedCorridor.isEmergencyCorridor ? 'EMERGENCY' : 'STANDARD'}
                  </div>
                  <div className="text-[9px] text-neutral-500">Designated Artery</div>
                </div>
              </div>

              {/* Digital Signage Override Panel */}
              <div className="p-3 bg-black/80 rounded border border-red-900/50 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400 font-bold flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                    DYNAMIC OVERHEAD LED SIGNAGE DISPLAY:
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      selectedCorridor.signageStatus === 'CLOSED'
                        ? 'bg-red-600 text-white'
                        : selectedCorridor.signageStatus === 'DANGER_DIVERT'
                        ? 'bg-amber-600 text-black'
                        : 'bg-emerald-900 text-emerald-300'
                    }`}
                  >
                    STATUS: {selectedCorridor.signageStatus}
                  </span>
                </div>
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800 text-sm font-hud tracking-wider text-amber-400 text-center font-bold">
                  "{selectedCorridor.signageMessage}"
                </div>
              </div>

              {/* Interactive Hazard Block / Unblock Toggle */}
              <div className="pt-2 flex items-center justify-between border-t border-neutral-900">
                <span className="text-neutral-400 text-[11px]">
                  SIMULATE STRUCTURAL BLOCKAGE / GATES CLOSED:
                </span>
                <button
                  onClick={() => toggleCorridorBlock(selectedCorridor.id)}
                  className={`px-4 py-1.5 rounded text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 transition-colors ${
                    selectedCorridor.isBlocked
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  }`}
                >
                  {selectedCorridor.isBlocked ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>RE-OPEN CORRIDOR</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>BLOCK CORRIDOR (INJECT HAZARD)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </TacticalCard>
        </div>

        {/* Right Column: Corridor Roster & Diverter Table (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <TacticalCard
            title="ALL EGRESS CORRIDORS ROSTER"
            subtitle="SELECT TO TEST REROUTING FLOWS & SIGNAGE OVERRIDES"
          >
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {corridors.map((c: RouteCorridor) => {
                const isSelected = selectedCorridorId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCorridorId(c.id)}
                    className={`w-full text-left p-2.5 rounded border text-xs font-mono transition-all ${
                      isSelected
                        ? 'bg-red-950/70 border-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.25)]'
                        : 'bg-black/60 border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        {c.isBlocked ? (
                          <Lock className="w-3 h-3 text-red-500" />
                        ) : (
                          <RouteIcon className="w-3 h-3 text-cyan-400" />
                        )}
                        {c.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          c.isBlocked
                            ? 'bg-red-600 text-white'
                            : c.congestionPercent > 80
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400'
                        }`}
                      >
                        {c.isBlocked ? 'BLOCKED' : `${c.congestionPercent}% LOAD`}
                      </span>
                    </div>

                    <div className="text-[10px] text-neutral-400 mt-1 flex justify-between">
                      <span>
                        Flow: <strong className="text-white">{c.currentFlowPaxMin}</strong> / {c.maxThroughputPaxMin} pax/m
                      </span>
                      <span>Width: {c.widthMeters}m</span>
                    </div>

                    {/* Mini Flow progress */}
                    <div className="w-full bg-neutral-900 rounded-full h-1 mt-1.5 overflow-hidden">
                      <div
                        className={`h-full ${
                          c.isBlocked
                            ? 'bg-red-600'
                            : c.congestionPercent > 80
                            ? 'bg-amber-500'
                            : 'bg-cyan-500'
                        }`}
                        style={{ width: `${c.isBlocked ? 100 : c.congestionPercent}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
};
