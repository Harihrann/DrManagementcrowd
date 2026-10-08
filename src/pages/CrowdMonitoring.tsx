import React, { useState } from 'react';
import {
  Eye,
  Thermometer,
  Wind,
  Sliders,
} from 'lucide-react';
import { useCommand } from '../context/CommandContext';
import { TacticalCard } from '../components/common/TacticalCard';
import { TacticalMapCanvas } from '../components/common/TacticalMapCanvas';
import { CCTVPlayer } from '../components/common/CCTVPlayer';
import type { Sector, CCTVFeed } from '../types';

export const CrowdMonitoring: React.FC = () => {
  const {
    sectors,
    cctvFeeds,
    selectedSectorId,
    setSelectedSectorId,
    selectedSector,
    updateSectorDensity,
    simulateSurgeIncident
  } = useCommand();

  const [activeCamId, setActiveCamId] = useState<string>(cctvFeeds[0].id);
  const [viewMode, setViewMode] = useState<'single' | 'quad'>('single');

  const activeCam = cctvFeeds.find((c: CCTVFeed) => c.id === activeCamId) || cctvFeeds[0];
  const sector = selectedSector || sectors[0];

  return (
    <div className="space-y-4">
      {/* Top Banner / Tactical Overview */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-red-950/20 border border-red-900/40 rounded">
        <div>
          <h2 className="text-base font-bold font-hud uppercase tracking-wider text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-500" />
            REAL-TIME CROWD MONITORING & COMPUTER VISION GRID
          </h2>
          <p className="text-xs text-neutral-400 font-mono">
            8 SECTOR SENSORS // 6 UHD AI SURVEILLANCE STATIONS // EDGE OPTICAL FLOW ENGINE
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex border border-neutral-800 rounded bg-black/60 p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('single')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'single'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              SINGLE CAMERA INSPECT
            </button>
            <button
              onClick={() => setViewMode('quad')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'quad'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              2x2 QUAD CCTV WALL
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Tactical Map & CCTV Surveillance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Map & Sector Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <TacticalCard
            title="SPATIAL SECTOR TOPOLOGY MAP"
            subtitle="SELECT SECTOR TO INSPECT SENSORY TELEMETRY & CAMERA LINKS"
            badge={
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                ACTIVE: {sector.code}
              </span>
            }
          >
            <TacticalMapCanvas height={360} />
          </TacticalCard>

          {/* Detailed Sector Inspector HUD */}
          <TacticalCard
            title={`SECTOR TELEMETRY // ${sector.code} - ${sector.name.toUpperCase()}`}
            subtitle={sector.statusDescription}
            badge={
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  sector.riskLevel === 'CRITICAL'
                    ? 'bg-red-950 text-red-400 border-red-600 animate-pulse'
                    : sector.riskLevel === 'SEVERE'
                    ? 'bg-orange-950 text-orange-400 border-orange-600'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-600'
                }`}
              >
                {sector.riskLevel} RISK ({sector.riskScore}/100)
              </span>
            }
          >
            <div className="space-y-3 font-mono">
              {/* Density Bar */}
              <div>
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>CROWD DENSITY:</span>
                  <span className="font-bold text-white">
                    {sector.density} / {sector.maxSafeDensity} pax/m²
                  </span>
                </div>
                <div className="mt-1 w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      sector.density > 4.0
                        ? 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                        : sector.density > 3.0
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (sector.density / 5.5) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Grid of Micro-Sensors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-900 text-xs">
                <div className="bg-black/60 p-2 rounded border border-neutral-850">
                  <div className="text-[10px] text-neutral-400">HEADCOUNT</div>
                  <div className="text-base font-bold text-white">
                    {sector.currentCount.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-neutral-500">Cap: {sector.capacity}</div>
                </div>

                <div className="bg-black/60 p-2 rounded border border-neutral-850">
                  <div className="text-[10px] text-neutral-400">FLOW VELOCITY</div>
                  <div className="text-base font-bold text-cyan-400">
                    {sector.flowVelocity} m/s
                  </div>
                  <div className="text-[9px] text-neutral-500">
                    {sector.flowVelocity < 0.6 ? 'STAGNANT CHOKE' : 'LAMINAR'}
                  </div>
                </div>

                <div className="bg-black/60 p-2 rounded border border-neutral-850">
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-500" />
                    THERMAL
                  </div>
                  <div className="text-base font-bold text-amber-400">
                    {sector.tempCelsius}°C
                  </div>
                  <div className="text-[9px] text-neutral-500">Body Radiation</div>
                </div>

                <div className="bg-black/60 p-2 rounded border border-neutral-850">
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <Wind className="w-3 h-3 text-emerald-500" />
                    CO2 QUALITY
                  </div>
                  <div className="text-base font-bold text-emerald-400">
                    {sector.co2Ppm} ppm
                  </div>
                  <div className="text-[9px] text-neutral-500">Normal &lt;1000</div>
                </div>
              </div>

              {/* Inflow vs Outflow Rate */}
              <div className="p-2.5 bg-black/60 rounded border border-neutral-850 text-xs flex items-center justify-between">
                <div>
                  <span className="text-neutral-400">GATE INFLOW: </span>
                  <span className="text-cyan-400 font-bold">+{sector.inflowRate} pax/min</span>
                </div>
                <div>
                  <span className="text-neutral-400">GATE OUTFLOW: </span>
                  <span className="text-emerald-400 font-bold">-{sector.outflowRate} pax/min</span>
                </div>
                <div>
                  <span className="text-neutral-400">NET DELTA: </span>
                  <span
                    className={`font-bold ${
                      sector.inflowRate - sector.outflowRate > 100
                        ? 'text-red-400'
                        : 'text-neutral-300'
                    }`}
                  >
                    {sector.inflowRate - sector.outflowRate > 0 ? '+' : ''}
                    {sector.inflowRate - sector.outflowRate} /min
                  </span>
                </div>
              </div>

              {/* Stress-Test Density Override Slider */}
              <div className="pt-2 border-t border-neutral-900">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-red-500" />
                    SIMULATION INJECTION: MANUAL DENSITY STRESS TEST
                  </span>
                  <span className="text-white font-bold">{sector.density} pax/m²</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateSectorDensity(sector.id, -0.4)}
                    className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 rounded text-xs"
                  >
                    -0.4
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.1"
                    value={sector.density}
                    onChange={e =>
                      updateSectorDensity(sector.id, parseFloat(e.target.value) - sector.density)
                    }
                    className="flex-1 accent-red-600 bg-neutral-800 h-1.5 rounded cursor-pointer"
                  />
                  <button
                    onClick={() => updateSectorDensity(sector.id, 0.4)}
                    className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 rounded text-xs"
                  >
                    +0.4
                  </button>
                  <button
                    onClick={() => simulateSurgeIncident(sector.id)}
                    className="px-2.5 py-1 bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 rounded text-xs font-bold"
                  >
                    INJECT SURGE
                  </button>
                </div>
              </div>
            </div>
          </TacticalCard>
        </div>

        {/* Right Column: AI Video Surveillance (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {viewMode === 'single' ? (
            <>
              {/* Single Camera Inspector */}
              <TacticalCard
                title={activeCam.name}
                subtitle={`SECTOR: ${activeCam.sectorCode} // AI PEDESTRIAN RE-IDENTIFICATION`}
                badge={
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    ONLINE // {activeCam.fps} FPS
                  </span>
                }
              >
                <CCTVPlayer feed={activeCam} showControls={true} />
              </TacticalCard>

              {/* Camera Channel Selector Matrix */}
              <TacticalCard
                title="CCTV SURVEILLANCE CHANNELS"
                subtitle="CLICK CHANNEL TO STREAM REAL-TIME COMPUTER VISION INFERENCE"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {cctvFeeds.map((cam: CCTVFeed) => {
                    const isSelected = activeCamId === cam.id;
                    return (
                      <button
                        key={cam.id}
                        onClick={() => setActiveCamId(cam.id)}
                        className={`text-left p-2 rounded border text-xs font-mono transition-all ${
                          isSelected
                            ? 'bg-red-950/70 border-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                            : 'bg-black/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-white">{cam.id}</span>
                          {cam.anomalyDetected && (
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-300 truncate mt-0.5">
                          {cam.sectorCode} - {cam.name.split('[')[1]?.replace(']', '') || cam.name}
                        </div>
                        <div className="text-[9px] text-neutral-400 mt-1 flex justify-between">
                          <span>{cam.aiPedestrianCount} PAX</span>
                          <span className="text-cyan-400">{cam.crowdVelocity} m/s</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </TacticalCard>
            </>
          ) : (
            /* Quad View: 2x2 Camera Wall */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cctvFeeds.slice(0, 4).map((cam: CCTVFeed) => (
                <div key={cam.id} className="hud-panel p-2 rounded border border-red-900/40">
                  <CCTVPlayer feed={cam} showControls={false} />
                  <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-neutral-300">
                    <span className="font-bold text-white">{cam.name}</span>
                    <span className="text-cyan-400">{cam.aiPedestrianCount} PAX</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sector Data Grid Table */}
          <TacticalCard
            title="ALL SECTORS TELEMETRY OVERVIEW"
            subtitle="AGGREGATE SPATIAL OBSERVATIONS"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 text-[10px] text-neutral-400">
                    <th className="pb-2">CODE</th>
                    <th className="pb-2">SECTOR NAME</th>
                    <th className="pb-2">COUNT</th>
                    <th className="pb-2">DENSITY</th>
                    <th className="pb-2">VELOCITY</th>
                    <th className="pb-2">THREAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {sectors.map((sec: Sector) => (
                    <tr
                      key={sec.id}
                      onClick={() => setSelectedSectorId(sec.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedSectorId === sec.id
                          ? 'bg-red-950/40 text-white'
                          : 'hover:bg-neutral-900/60 text-neutral-300'
                      }`}
                    >
                      <td className="py-2 font-bold text-white">{sec.code}</td>
                      <td className="py-2 truncate max-w-[130px]">{sec.name}</td>
                      <td className="py-2">{sec.currentCount.toLocaleString()}</td>
                      <td className="py-2">
                        <span
                          className={
                            sec.density > 4.0
                              ? 'text-red-400 font-bold'
                              : sec.density > 3.0
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }
                        >
                          {sec.density} p/m²
                        </span>
                      </td>
                      <td className="py-2 text-cyan-400">{sec.flowVelocity} m/s</td>
                      <td className="py-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] ${
                            sec.riskLevel === 'CRITICAL'
                              ? 'bg-red-950 text-red-400 border border-red-800/80'
                              : sec.riskLevel === 'SEVERE'
                              ? 'bg-orange-950 text-orange-400'
                              : 'bg-emerald-950 text-emerald-400'
                          }`}
                        >
                          {sec.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
};
