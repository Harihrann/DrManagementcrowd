import React from 'react';
import {
  Activity,
  AlertOctagon,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Radio,
  Cpu,
  Flame
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { DefconBadge } from '../common/DefconBadge';

export const Header: React.FC = () => {
  const {
    systemTime,
    totalCrowdCount,
    soundEnabled,
    toggleAudio,
    isLiveSimulation,
    toggleLiveSimulation,
    simulationSpeed,
    setSimulationSpeed,
    simulateSurgeIncident,
    triggerEmergencyEvacuation,
    resetSimulation,
    highRiskCount
  } = useCommand();

  return (
    <header className="h-16 border-b border-red-900/40 bg-[#07080d]/95 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & Command Center Identifier */}
      <div className="flex items-center space-x-3.5">
        <div className="relative flex items-center justify-center w-10 h-10 rounded border border-red-500/50 bg-red-950/40 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]">
          <Activity className="w-5 h-5 animate-pulse text-red-500" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold font-hud tracking-widest text-white uppercase flex items-center gap-1.5">
              AETHERIS <span className="text-red-500 font-extrabold">//</span> CROWD-AI
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-mono tracking-tighter bg-red-950/80 text-red-400 border border-red-800/60 rounded">
              GOV-SEC TACTICAL
            </span>
          </div>
          <p className="text-[10px] text-neutral-400 font-mono tracking-wider flex items-center gap-1">
            <Radio className="w-3 h-3 text-red-400 inline" />
            <span>GRID ALPHA-7</span>
            <span className="text-red-600">■</span>
            <span>METRO PUBLIC SAFETY & STAMPEDE DEFENSE</span>
          </p>
        </div>
      </div>

      {/* Center Telemetry HUD */}
      <div className="hidden lg:flex items-center space-x-6 border-x border-red-900/30 px-6 py-1">
        {/* Total Active Crowd Count */}
        <div className="text-left">
          <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            Active Population
          </div>
          <div className="text-lg font-bold font-mono text-red-400 tracking-tight glow-text-red">
            {totalCrowdCount.toLocaleString()}{' '}
            <span className="text-xs text-neutral-400 font-normal">PAX</span>
          </div>
        </div>

        {/* High Risk Status */}
        <div className="text-left">
          <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider flex items-center gap-1">
            <AlertOctagon className="w-3 h-3 text-red-500" />
            Critical Hotspots
          </div>
          <div className="text-lg font-bold font-mono text-white flex items-center gap-1.5">
            <span className={highRiskCount > 0 ? 'text-red-500 font-extrabold' : 'text-emerald-400'}>
              {highRiskCount}
            </span>
            <span className="text-xs text-neutral-400 font-normal">SECTORS</span>
          </div>
        </div>

        {/* AI Latency & Inference */}
        <div className="text-left hidden xl:block">
          <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            AI Inference
          </div>
          <div className="text-sm font-mono text-cyan-400 flex items-center gap-1">
            <span>12.4 ms</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1 rounded border border-emerald-800/40">
              98.4% CONF
            </span>
          </div>
        </div>

        {/* Military / Tactical Clock */}
        <div className="text-left">
          <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
            ZULU / LOCAL TIME
          </div>
          <div className="text-base font-bold font-mono text-neutral-200">
            {systemTime}{' '}
            <span className="text-[10px] text-neutral-400 font-normal">UTC+5:30</span>
          </div>
        </div>

        {/* DEFCON status */}
        <DefconBadge />
      </div>

      {/* Tactical Quick Action Controls */}
      <div className="flex items-center space-x-2">
        {/* Simulate Surge Incident Button */}
        <button
          onClick={() => simulateSurgeIncident()}
          className="px-2.5 py-1.5 rounded border border-red-600/70 bg-gradient-to-r from-red-950/80 to-red-900/60 text-red-200 hover:text-white hover:bg-red-800/80 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(239,68,68,0.25)] hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] active:scale-95"
          title="Simulate random bottleneck or crowd surge incident"
        >
          <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="hidden sm:inline">SIMULATE SURGE</span>
        </button>

        {/* Trigger Evacuation Button */}
        <button
          onClick={() => triggerEmergencyEvacuation()}
          className="px-2.5 py-1.5 rounded border border-red-500 bg-red-600 text-white hover:bg-red-500 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(239,68,68,0.5)] active:scale-95 animate-pulse"
          title="Initiate Full Facility Evacuation Protocol"
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">EVACUATE</span>
        </button>

        {/* Live Simulation Play/Pause & Speed */}
        <div className="flex items-center border border-neutral-800 rounded bg-black/60 p-0.5">
          <button
            onClick={toggleLiveSimulation}
            className={`p-1 rounded transition-colors ${
              isLiveSimulation
                ? 'text-emerald-400 hover:bg-emerald-950/40'
                : 'text-amber-400 hover:bg-amber-950/40'
            }`}
            title={isLiveSimulation ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isLiveSimulation ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 2 : simulationSpeed === 2 ? 5 : 1)}
            className="px-1 text-[10px] font-mono text-neutral-400 hover:text-white"
            title="Simulation Speed Multiplier"
          >
            {simulationSpeed}x
          </button>
        </div>

        {/* Audio Mute / Unmute Toggle */}
        <button
          onClick={toggleAudio}
          className={`p-1.5 rounded border transition-colors ${
            soundEnabled
              ? 'border-red-900/60 bg-red-950/40 text-red-400 hover:text-white'
              : 'border-neutral-800 bg-neutral-900/50 text-neutral-500 hover:text-neutral-300'
          }`}
          title={soundEnabled ? 'Tactical Audio Active (Click to Mute)' : 'Tactical Audio Muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Reset State */}
        <button
          onClick={resetSimulation}
          className="p-1.5 rounded border border-neutral-800 bg-black/50 text-neutral-400 hover:text-white hover:border-red-900/50"
          title="Reset Grid & Incidents to Baseline"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
