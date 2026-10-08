import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Users,
  ShieldAlert,
  ArrowUpRight,
  FileText,
  Flame,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { useCommand } from '../context/CommandContext';
import { TacticalCard } from '../components/common/TacticalCard';
import { TacticalMapCanvas } from '../components/common/TacticalMapCanvas';
import { CCTVPlayer } from '../components/common/CCTVPlayer';
import { MiniRadarWidget } from '../components/common/MiniRadarWidget';
import { TacticalLineChart, type DataPoint } from '../components/common/TacticalLineChart';
import type { Sector, IncidentAlert, ResourceUnit } from '../types';

export const Dashboard: React.FC = () => {
  const {
    sectors,
    alerts,
    resources,
    cctvFeeds,
    totalCrowdCount,
    averageDensity,
    highRiskCount,
    activeUnitsCount,
    selectedSectorId,
    setSelectedSectorId,
    setActiveTab,
    dispatchResource,
    simulateSurgeIncident
  } = useCommand();

  const [showSitRepModal, setShowSitRepModal] = useState(false);

  // Compute facility capacity
  const totalCapacity = sectors.reduce((acc: number, s: Sector) => acc + s.capacity, 0);
  const capacityPercent = Math.round((totalCrowdCount / totalCapacity) * 100);

  // Active critical or high alerts
  const urgentAlerts = alerts.filter((a: IncidentAlert) => a.status === 'ACTIVE' || a.status === 'ACKNOWLEDGED');

  // Synthetic 60-minute forecast curve
  const forecastData: DataPoint[] = [
    { label: '0m', actual: averageDensity, predicted: averageDensity, lower: averageDensity - 0.2, upper: averageDensity + 0.2 },
    { label: '10m', predicted: averageDensity + 0.3, lower: averageDensity + 0.1, upper: averageDensity + 0.5 },
    { label: '20m', predicted: averageDensity + 0.6, lower: averageDensity + 0.3, upper: averageDensity + 0.9 },
    { label: '30m', predicted: averageDensity + 0.9, lower: averageDensity + 0.5, upper: averageDensity + 1.3 },
    { label: '40m', predicted: averageDensity + 1.2, lower: averageDensity + 0.7, upper: averageDensity + 1.7 },
    { label: '50m', predicted: averageDensity + 1.0, lower: averageDensity + 0.5, upper: averageDensity + 1.5 },
    { label: '60m', predicted: averageDensity + 0.7, lower: averageDensity + 0.3, upper: averageDensity + 1.1 },
  ];

  return (
    <div className="space-y-4">
      {/* Top Metric Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="hud-panel p-3.5 rounded border border-red-900/40 bg-gradient-to-br from-red-950/20 to-black">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] font-mono">
            <span>TOTAL FACILITY CROWD</span>
            <Users className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tracking-tight glow-text-red">
              {totalCrowdCount.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-neutral-400">/ {totalCapacity.toLocaleString()}</span>
          </div>
          <div className="mt-2 w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-neutral-800">
            <div
              className={`h-full transition-all duration-500 ${
                capacityPercent > 80 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-cyan-500'
              }`}
              style={{ width: `${Math.min(100, capacityPercent)}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] font-mono text-neutral-400">
            <span>CAPACITY LOAD</span>
            <span className={capacityPercent > 80 ? 'text-red-400 font-bold' : 'text-cyan-400'}>
              {capacityPercent}%
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="hud-panel p-3.5 rounded border border-red-900/40 bg-gradient-to-br from-red-950/20 to-black">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] font-mono">
            <span>AVG CROWD DENSITY</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {averageDensity}{' '}
              <span className="text-xs text-neutral-400 font-normal">pax/m²</span>
            </span>
          </div>
          <div className="mt-2 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
            <span>SAFETY CEILING:</span>
            <span className="text-neutral-200">3.8 pax/m²</span>
          </div>
          <div className="mt-1 text-[10px] font-mono flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>GLOBAL FLOW STEADY</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="hud-panel p-3.5 rounded border border-red-900/40 bg-gradient-to-br from-red-950/20 to-black">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] font-mono">
            <span>CRITICAL SECTORS</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-red-500 font-extrabold animate-pulse">
              {highRiskCount}
            </span>
            <span className="text-xs font-mono text-neutral-400">OF 8 SECTORS</span>
          </div>
          <div className="mt-2 text-[10px] font-mono flex items-center justify-between text-neutral-400">
            <span>CHOKE-POINT SECTORS:</span>
            <span className="text-red-400 font-bold">SEC-B, SEC-F</span>
          </div>
          <div className="mt-1 text-[10px] font-mono text-red-400">
            TURNSTILE PRESSURE WAVE DETECTED
          </div>
        </div>

        {/* Metric 4 */}
        <div className="hud-panel p-3.5 rounded border border-red-900/40 bg-gradient-to-br from-red-950/20 to-black">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] font-mono">
            <span>RESPONDER UNITS</span>
            <Cpu className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {activeUnitsCount}{' '}
              <span className="text-xs text-neutral-400 font-normal">DEPLOYED</span>
            </span>
          </div>
          <div className="mt-2 text-[10px] font-mono flex items-center justify-between text-neutral-400">
            <span>TOTAL ASSET POOL:</span>
            <span className="text-neutral-200">{resources.length} UNITS</span>
          </div>
          <div className="mt-1 text-[10px] font-mono text-emerald-400">
            2 DRONES PATROLLING SKYWAY
          </div>
        </div>
      </div>

      {/* Main Grid: Tactical Vector Map & Live Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Vector Map HUD (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <TacticalCard
            title="METROPOLITAN C4ISR SPATIAL VECTOR MAP"
            subtitle="REAL-TIME SECTOR TOPOLOGY // FLOW VECTORS // SENSOR TELEMETRY"
            badge={
              <span className="text-[10px] font-mono bg-red-950 px-2 py-0.5 rounded text-red-300 border border-red-800/60">
                AI GNN ENGINE ONLINE
              </span>
            }
            action={
              <button
                onClick={() => setActiveTab('monitoring')}
                className="text-[10px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 border border-neutral-800 px-2 py-1 rounded hover:bg-neutral-900"
              >
                <span>EXPAND VIEW</span>
                <ArrowUpRight className="w-3 h-3 text-red-500" />
              </button>
            }
          >
            <TacticalMapCanvas height={390} />

            {/* Quick Sector Snapshot Ribbons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-neutral-900">
              {sectors.slice(0, 4).map((sec: Sector) => {
                const isSelected = selectedSectorId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSectorId(sec.id)}
                    className={`text-left p-2 rounded border transition-all text-xs font-mono ${
                      isSelected
                        ? 'bg-red-950/60 border-red-500 text-white'
                        : 'bg-black/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-white">{sec.code}</span>
                      <span
                        className={
                          sec.riskLevel === 'CRITICAL'
                            ? 'text-red-400 font-bold'
                            : sec.riskLevel === 'SEVERE'
                            ? 'text-orange-400'
                            : 'text-emerald-400'
                        }
                      >
                        {sec.density} p/m²
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                      {sec.name.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </TacticalCard>

          {/* Surge Predictive 60-Minute Curve */}
          <TacticalCard
            title="AI PREDICTIVE SURGE TIMELINE [T+0 TO T+60 MIN]"
            subtitle="GRAPH NEURAL NETWORK PROJECTED CROWD DENSITY EXPANSION"
            badge={
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                INFERENCE ACCURACY 98.4%
              </span>
            }
            action={
              <button
                onClick={() => setActiveTab('prediction')}
                className="text-[10px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 border border-neutral-800 px-2 py-1 rounded"
              >
                <span>OPEN PREDICTION ENGINE</span>
                <ArrowUpRight className="w-3 h-3 text-red-500" />
              </button>
            }
          >
            <TacticalLineChart data={forecastData} height={190} showConfidence={true} />
          </TacticalCard>
        </div>

        {/* Right Column: CCTV Mini Wall & Urgent Alerts (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Live Surveillance Feed */}
          <TacticalCard
            title="TACTICAL SURVEILLANCE FEED"
            subtitle="CCTV CAM-01A // GATE 4 NORTH TURNSTILES"
            badge={
              <span className="text-[9px] font-mono bg-red-600 text-white font-bold px-1.5 py-0.5 rounded animate-pulse">
                LIVE REC
              </span>
            }
          >
            <CCTVPlayer feed={cctvFeeds[0]} showControls={true} />
          </TacticalCard>

          {/* Radar Sweep & Tactical SitRep */}
          <div className="grid grid-cols-2 gap-3">
            <MiniRadarWidget size={140} />

            <div className="hud-panel p-2.5 rounded border border-red-900/40 bg-black/60 flex flex-col justify-between text-xs font-mono">
              <div>
                <div className="text-red-400 font-bold uppercase text-[11px] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  SITREP REPORT
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Automated intelligence briefing ready for dispatch commander.
                </p>
              </div>

              <button
                onClick={() => setShowSitRepModal(true)}
                className="w-full mt-2 py-1.5 bg-neutral-900 hover:bg-red-950 text-neutral-200 hover:text-white border border-neutral-700 hover:border-red-600 rounded text-[10px] font-bold tracking-wider uppercase transition-colors"
              >
                GENERATE SITREP
              </button>
            </div>
          </div>

          {/* Urgent Incident Feed */}
          <TacticalCard
            title="CRITICAL INCIDENT QUEUE"
            subtitle={`${urgentAlerts.length} UNRESOLVED PRIORITY ALERTS`}
            badge={
              <button
                onClick={() => simulateSurgeIncident()}
                className="text-[9px] font-mono text-red-300 bg-red-950 hover:bg-red-900 px-2 py-0.5 rounded border border-red-700 transition-colors"
              >
                + SIMULATE INCIDENT
              </button>
            }
          >
            <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
              {urgentAlerts.map((alert: IncidentAlert) => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded border text-xs font-mono transition-all ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-950/60 border-red-600 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                      : 'bg-neutral-900/70 border-neutral-800 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-white flex items-center gap-1">
                      {alert.severity === 'CRITICAL' ? (
                        <Flame className="w-3 h-3 text-red-500 animate-pulse" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                      )}
                      {alert.id} // {alert.sectorName}
                    </span>
                    <span className="text-neutral-400">{alert.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-white font-semibold mt-1 leading-snug">
                    {alert.headline}
                  </p>

                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-red-900/30">
                    <span className="text-[10px] text-cyan-400">
                      AI CONF: {alert.aiConfidence}%
                    </span>

                    <button
                      onClick={() => {
                        const availUnit = resources.find((r: ResourceUnit) => r.status === 'AVAILABLE');
                        if (availUnit) {
                          dispatchResource(availUnit.id, alert.sectorId);
                        } else {
                          setActiveTab('resources');
                        }
                      }}
                      className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold tracking-wider uppercase transition-colors"
                    >
                      DISPATCH RESCUE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TacticalCard>
        </div>
      </div>

      {/* SitRep Briefing Modal */}
      {showSitRepModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="hud-panel max-w-2xl w-full p-5 rounded border border-red-600 bg-[#090b10] text-slate-200 font-mono space-y-4">
            <div className="flex items-center justify-between border-b border-red-900/50 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-bold text-white font-hud tracking-widest uppercase">
                  EXECUTIVE SITREP // COMMAND SITUATION REPORT
                </h3>
              </div>
              <button
                onClick={() => setShowSitRepModal(false)}
                className="text-neutral-400 hover:text-white px-2 py-0.5 border border-neutral-800 rounded"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="bg-black/70 p-3.5 rounded border border-neutral-800 text-xs space-y-2 text-neutral-300">
              <p className="text-red-400 font-bold">
                [CLASSIFIED // GOV DEFENSE COMMAND ARCHIVE]
              </p>
              <p>
                <strong>FACILITY STATUS:</strong> METROPOLIS DOWNTOWN STADIUM & TRANSIT HUB COMPLEX
              </p>
              <p>
                <strong>TOTAL MONITORED POPULATION:</strong> {totalCrowdCount.toLocaleString()} PAX ({capacityPercent}% of maximum capacity threshold).
              </p>
              <p>
                <strong>MEAN DENSITY:</strong> {averageDensity} PAX/M² (CRITICAL CHOKE AT GATE 4 & EAST UNDERPASS).
              </p>
              <p>
                <strong>ACTIVE INCIDENTS:</strong> {urgentAlerts.length} Active. Turnstile back-pressure wave in Sector B currently being managed by Vanguard Rapid Barriers.
              </p>
              <p>
                <strong>AI REACTION DIRECTIVE:</strong> Recommend sustained diversion of passenger stream from Gate 4 to South Grand Boulevard (Sector D).
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `AETHERIS SITREP // CROWD COUNT: ${totalCrowdCount} // AVG DENSITY: ${averageDensity} p/m² // ACTIVE HAZARDS: ${urgentAlerts.length}`
                  );
                  alert('SitRep briefing copied to clipboard.');
                }}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs border border-neutral-700"
              >
                COPY BRIEFING TEXT
              </button>
              <button
                onClick={() => setShowSitRepModal(false)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold"
              >
                ACKNOWLEDGE & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
