import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useCommand } from '../context/CommandContext';
import { TacticalCard } from '../components/common/TacticalCard';
import { RiskMatrixChart } from '../components/common/RiskMatrixChart';
import type { Sector, ResourceUnit } from '../types';

interface Countermeasure {
  id: string;
  sectorId: string;
  sectorCode: string;
  title: string;
  description: string;
  riskReduction: number;
  deployed: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export const RiskAssessment: React.FC = () => {
  const { sectors, updateSectorDensity, dispatchResource, resources } = useCommand();

  const [countermeasures, setCountermeasures] = useState<Countermeasure[]>([
    {
      id: 'CM-01',
      sectorId: 'sec-b',
      sectorCode: 'SEC-B',
      title: 'DEPLOY RAPID BYPASS GATES AT TURNSTILES 4-7',
      description: 'Open emergency swing gates to relieve 620 pax/min turnstile pressure wave and normalize ingress velocity.',
      riskReduction: 26,
      deployed: false,
      priority: 'CRITICAL'
    },
    {
      id: 'CM-02',
      sectorId: 'sec-f',
      sectorCode: 'SEC-F',
      title: 'ACTIVATE SOUTH-EAST RELIEF TUNNEL (CORRIDOR 6)',
      description: 'Engage dynamic LED directional pavement signage to divert 45% of East Underpass pedestrian volume into open Relief Corridor.',
      riskReduction: 22,
      deployed: false,
      priority: 'CRITICAL'
    },
    {
      id: 'CM-03',
      sectorId: 'sec-c',
      sectorCode: 'SEC-C',
      title: 'THROTTLE ESCALATOR ASCENT CADENCE // SUBWAY PLATFORM 2',
      description: 'Synchronize escalator speeds with mezzanine departure flow to prevent bottleneck compression at upper landing.',
      riskReduction: 15,
      deployed: false,
      priority: 'HIGH'
    },
    {
      id: 'CM-04',
      sectorId: 'sec-a',
      sectorCode: 'SEC-A',
      title: 'DISPATCH MOBILE TRIAGE STATIONS TO CENTRAL PLAZA',
      description: 'Pre-position Medic team MEDIC-TWO at Plaza West to prevent medical casualty bottlenecks during peak concert egress.',
      riskReduction: 12,
      deployed: false,
      priority: 'MEDIUM'
    }
  ]);

  const handleDeployCountermeasure = (cm: Countermeasure) => {
    // 1. Mark countermeasure as deployed
    setCountermeasures(prev =>
      prev.map(c => (c.id === cm.id ? { ...c, deployed: true } : c))
    );

    // 2. Reduce risk and density on that sector
    updateSectorDensity(cm.sectorId, -0.6);

    // 3. Dispatch an available squad if relevant
    const availableUnit = resources.find((r: ResourceUnit) => r.status === 'AVAILABLE');
    if (availableUnit) {
      dispatchResource(availableUnit.id, cm.sectorId);
    }
  };

  // Detailed risk breakdown scores for each sector
  const getSubMetrics = (sec: Sector) => {
    const crushHazard = Math.min(100, Math.round((sec.density / sec.maxSafeDensity) * 75));
    const chokeSaturation = sec.chokePointStatus === 'CRITICAL' ? 94 : sec.chokePointStatus === 'MODERATE' ? 62 : 18;
    const impedance = Math.min(100, Math.round((2.0 - sec.flowVelocity) * 50));
    const panicRisk = Math.min(100, Math.round((sec.density * 12) + (sec.tempCelsius > 26 ? 20 : 5)));
    return { crushHazard, chokeSaturation, impedance, panicRisk };
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-3 bg-red-950/20 border border-red-900/40 rounded flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-hud uppercase tracking-wider text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            QUANTITATIVE RISK ASSESSMENT & STAMPEDE DEFENSE
          </h2>
          <p className="text-xs text-neutral-400 font-mono">
            MULTI-FACTOR RISK DECOMPOSITION // DEFENSE STANDARD C4ISR THREAT EVALUATION
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="bg-red-950 text-red-400 border border-red-800/80 px-2 py-1 rounded font-bold">
            CRUSH PROTOCOL ACTIVE
          </span>
          <span className="bg-neutral-900 text-neutral-300 border border-neutral-800 px-2 py-1 rounded">
            ISO 31000 AUDITED
          </span>
        </div>
      </div>

      {/* 5x5 Threat Matrix & AI Countermeasures */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: 5x5 Threat Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <RiskMatrixChart />

          {/* AI Recommended Tactical Countermeasures */}
          <TacticalCard
            title="AI AUTOMATED SAFETY COUNTERMEASURES ENGINE"
            subtitle="ONE-CLICK INTERVENTION DISPATCH FOR IDENTIFIED CRUSH HOTSPOTS"
            badge={
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
                <Sparkles className="w-3 h-3 inline mr-1 text-cyan-400" />
                NEURAL DISPATCH ADVICE
              </span>
            }
          >
            <div className="space-y-2.5">
              {countermeasures.map(cm => (
                <div
                  key={cm.id}
                  className={`p-3 rounded border text-xs font-mono transition-all ${
                    cm.deployed
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-neutral-300'
                      : cm.priority === 'CRITICAL'
                      ? 'bg-red-950/40 border-red-600/70 text-red-200'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-black/80 border border-neutral-800 text-neutral-300">
                        {cm.id}
                      </span>
                      <span>TARGET: {cm.sectorCode}</span>
                    </span>

                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        cm.deployed
                          ? 'bg-emerald-900 text-emerald-300'
                          : cm.priority === 'CRITICAL'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-600 text-black'
                      }`}
                    >
                      {cm.deployed ? 'DEPLOYED / ACTIVE' : `${cm.priority} PRIORITY`}
                    </span>
                  </div>

                  <p className="text-white font-bold mt-1 text-[11px] leading-tight">
                    {cm.title}
                  </p>
                  <p className="text-neutral-400 text-[10px] mt-1 leading-normal">
                    {cm.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-neutral-850 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-bold">
                      ESTIMATED RISK MITIGATION: -{cm.riskReduction} PTS
                    </span>

                    {cm.deployed ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        INTERVENTION IN EFFECT
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDeployCountermeasure(cm)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold tracking-wider uppercase transition-colors shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                      >
                        EXECUTE COUNTERMEASURE
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TacticalCard>
        </div>

        {/* Right Column: Multi-Dimensional Sector Risk Decomposition Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <TacticalCard
            title="SECTOR-BY-SECTOR THREAT DECOMPOSITION"
            subtitle="CRUSH HAZARD // CHOKE CONGESTION // EVACUATION IMPEDANCE"
          >
            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
              {sectors.map((sec: Sector) => {
                const metrics = getSubMetrics(sec);
                return (
                  <div
                    key={sec.id}
                    className={`p-3 rounded border text-xs font-mono transition-all ${
                      sec.riskLevel === 'CRITICAL'
                        ? 'bg-red-950/50 border-red-600 text-red-200'
                        : sec.riskLevel === 'SEVERE'
                        ? 'bg-orange-950/40 border-orange-600/80 text-orange-200'
                        : 'bg-black/60 border-neutral-850 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white">
                        {sec.code} - {sec.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sec.riskLevel === 'CRITICAL'
                            ? 'bg-red-600 text-white animate-pulse'
                            : sec.riskLevel === 'SEVERE'
                            ? 'bg-orange-600 text-white'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {sec.riskScore}/100 {sec.riskLevel}
                      </span>
                    </div>

                    {/* Sub-Metrics Breakdown Bars */}
                    <div className="mt-2.5 space-y-1.5 text-[10px]">
                      <div>
                        <div className="flex justify-between text-neutral-400">
                          <span>1. Physical Crush Hazard:</span>
                          <span className="font-bold text-white">{metrics.crushHazard}%</span>
                        </div>
                        <div className="w-full bg-neutral-900 rounded-full h-1 mt-0.5">
                          <div
                            className={`h-full rounded-full ${
                              metrics.crushHazard > 75 ? 'bg-red-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${metrics.crushHazard}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-neutral-400">
                          <span>2. Choke Point Saturation:</span>
                          <span className="font-bold text-white">{metrics.chokeSaturation}%</span>
                        </div>
                        <div className="w-full bg-neutral-900 rounded-full h-1 mt-0.5">
                          <div
                            className={`h-full rounded-full ${
                              metrics.chokeSaturation > 75 ? 'bg-red-500' : 'bg-cyan-500'
                            }`}
                            style={{ width: `${metrics.chokeSaturation}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-neutral-400">
                          <span>3. Evacuation Flow Impedance:</span>
                          <span className="font-bold text-white">{metrics.impedance}%</span>
                        </div>
                        <div className="w-full bg-neutral-900 rounded-full h-1 mt-0.5">
                          <div
                            className={`h-full rounded-full ${
                              metrics.impedance > 60 ? 'bg-red-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${metrics.impedance}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-neutral-400">
                          <span>4. Panic Propagation Probability:</span>
                          <span className="font-bold text-white">{metrics.panicRisk}%</span>
                        </div>
                        <div className="w-full bg-neutral-900 rounded-full h-1 mt-0.5">
                          <div
                            className={`h-full rounded-full ${
                              metrics.panicRisk > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${metrics.panicRisk}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
};
