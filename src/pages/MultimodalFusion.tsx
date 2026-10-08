import React, { useState, useMemo } from 'react';
import {
  Camera,
  Car,
  CloudRain,
  Wifi,
  Bluetooth,
  Calendar,
  Cpu,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  RotateCcw,
  Zap,
  Radio,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Flame,
  Info
} from 'lucide-react';
import { useCommand } from '../context/CommandContext';
import { TacticalCard } from '../components/common/TacticalCard';
import {
  AnimatedFusionDiagram,
  ModalitySource
} from '../components/fusion/AnimatedFusionDiagram';

export const MultimodalFusion: React.FC = () => {
  const { totalCrowdCount, averageDensity, highRiskCount } = useCommand();

  // 6 Multimodal Input Sources
  const [sources, setSources] = useState<ModalitySource[]>([
    {
      id: 'src-cctv',
      name: 'CCTV Vision',
      category: 'CCTV',
      weight: 32,
      status: 'ONLINE',
      latencyMs: 14,
      dataRate: '4.8 GB/s',
      confidence: 98.2,
      color: '#ef4444', // Red
      metricLabel: 'YOLO-v11 Headcount',
      metricValue: `${totalCrowdCount.toLocaleString()} PAX`
    },
    {
      id: 'src-wifi',
      name: 'WiFi Analytics',
      category: 'WIFI',
      weight: 22,
      status: 'ONLINE',
      latencyMs: 8,
      dataRate: '124 MB/s',
      confidence: 94.6,
      color: '#06b6d4', // Cyan
      metricLabel: 'AP Probe Requests',
      metricValue: `${Math.round(totalCrowdCount * 0.88).toLocaleString()} MACs`
    },
    {
      id: 'src-ble',
      name: 'Bluetooth BLE',
      category: 'BLUETOOTH',
      weight: 16,
      status: 'ONLINE',
      latencyMs: 12,
      dataRate: '48 MB/s',
      confidence: 92.1,
      color: '#3b82f6', // Blue
      metricLabel: 'BLE Beacon Pings',
      metricValue: `${Math.round(totalCrowdCount * 0.74).toLocaleString()} RSSI`
    },
    {
      id: 'src-traffic',
      name: 'Traffic API',
      category: 'TRAFFIC',
      weight: 14,
      status: 'ONLINE',
      latencyMs: 42,
      dataRate: '1.2 MB/s',
      confidence: 89.5,
      color: '#f59e0b', // Amber
      metricLabel: 'Transit Inflow Rate',
      metricValue: '1,840 vehicles/hr'
    },
    {
      id: 'src-event',
      name: 'Event Metadata',
      category: 'EVENT',
      weight: 10,
      status: 'ONLINE',
      latencyMs: 5,
      dataRate: '250 KB/s',
      confidence: 99.4,
      color: '#c084fc', // Purple
      metricLabel: 'Turnstile RFID Scans',
      metricValue: '54,200 Scanned'
    },
    {
      id: 'src-weather',
      name: 'Weather API',
      category: 'WEATHER',
      weight: 6,
      status: 'ONLINE',
      latencyMs: 85,
      dataRate: '80 KB/s',
      confidence: 96.0,
      color: '#10b981', // Emerald
      metricLabel: 'Doppler Radar / Temp',
      metricValue: '24.2°C / 0.0mm Rain'
    }
  ]);

  const [selectedSourceId, setSelectedSourceId] = useState<string>('src-cctv');

  // Compute overall fused confidence based on active online sources
  const overallConfidence = useMemo(() => {
    const active = sources.filter(s => s.status !== 'OFFLINE');
    if (!active.length) return 0;
    const totalWeight = active.reduce((acc, s) => acc + s.weight, 0);
    const weightedConf = active.reduce((acc, s) => acc + (s.confidence * s.weight), 0);
    return Number((weightedConf / totalWeight).toFixed(1));
  }, [sources]);

  // Compute unified crowd state
  const unifiedCrowdState = useMemo(() => {
    const active = sources.filter(s => s.status !== 'OFFLINE');
    const cctvActive = sources.find(s => s.id === 'src-cctv')?.status === 'ONLINE';
    const wifiActive = sources.find(s => s.id === 'src-wifi')?.status === 'ONLINE';

    // Fused estimate synthesizes computer vision with device probes
    let fusedHeadcount = totalCrowdCount;
    if (!cctvActive && wifiActive) {
      fusedHeadcount = Math.round(totalCrowdCount * 0.94);
    } else if (!wifiActive && cctvActive) {
      fusedHeadcount = Math.round(totalCrowdCount * 1.02);
    }

    // Cross-modal discrepancy check
    const discrepancy = cctvActive && wifiActive ? 0.038 : 0.092;

    return {
      fusedHeadcount,
      fusedDensity: averageDensity,
      fusedVelocity: '1.14 m/s (Direction: South-East)',
      crossModalDiscrepancy: discrepancy,
      discrepancyStatus: discrepancy < 0.05 ? 'OPTIMAL CONCORDANCE' : 'ELEVATED SENSOR VARIANCE',
      sensorCoverage: Math.round((active.length / sources.length) * 100)
    };
  }, [sources, totalCrowdCount, averageDensity]);

  const selectedSource = sources.find(s => s.id === selectedSourceId) || sources[0];

  // Toggle source status (Ablation testing)
  const toggleSourceStatus = (id: string) => {
    setSources(prev =>
      prev.map(s => {
        if (s.id === id) {
          const nextStatus = s.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  // Adjust source weight
  const adjustWeight = (id: string, newWeight: number) => {
    setSources(prev =>
      prev.map(s => (s.id === id ? { ...s, weight: Math.max(1, Math.min(50, newWeight)) } : s))
    );
  };

  const resetSources = () => {
    setSources(prev =>
      prev.map(s => ({ ...s, status: 'ONLINE' }))
    );
  };

  const getSourceIcon = (category: ModalitySource['category']) => {
    switch (category) {
      case 'CCTV':
        return <Camera className="w-4 h-4 text-red-500" />;
      case 'WIFI':
        return <Wifi className="w-4 h-4 text-cyan-400" />;
      case 'BLUETOOTH':
        return <Bluetooth className="w-4 h-4 text-blue-400" />;
      case 'TRAFFIC':
        return <Car className="w-4 h-4 text-amber-400" />;
      case 'EVENT':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'WEATHER':
        return <CloudRain className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-3 bg-red-950/20 border border-red-900/40 rounded flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-hud uppercase tracking-wider text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-red-500 animate-pulse" />
            MULTIMODAL AI FUSION ENGINE // CROSS-ATTENTION NEURAL CORE
          </h2>
          <p className="text-xs text-neutral-400 font-mono">
            6 CONVERGED SENSORY STREAMS // KALMAN-BAYESIAN UNCERTAINTY ESTIMATOR // CONTINUOUS DATA FLOW
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="bg-black/70 px-2.5 py-1 rounded border border-neutral-800 text-neutral-300 flex items-center gap-2">
            <span>FUSION CONFIDENCE:</span>
            <strong className="text-red-400 font-mono text-sm glow-text-red">
              {overallConfidence}%
            </strong>
          </div>

          <button
            onClick={resetSources}
            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 rounded flex items-center gap-1.5 transition-colors"
            title="Reset All Sensor Sources to Online"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET ALL INPUTS</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Animated Fusion Bus & Central Core (8 cols) + Unified State (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Animated Fusion Pipeline Diagram (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <TacticalCard
            title="CENTRAL MULTIMODAL AI FUSION ARCHITECTURE"
            subtitle="STREAMING DATA FLOW FROM ALL SENSORY BUSSES INTO CROSS-ATTENTION TRANSFORMER"
            badge={
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                FLOW RATE: 5.2 GB/S // REAL-TIME INGEST
              </span>
            }
          >
            <AnimatedFusionDiagram
              sources={sources}
              activeSourceId={selectedSourceId}
              onSelectSource={setSelectedSourceId}
              overallConfidence={overallConfidence}
            />

            {/* Quick Modality Contribution Percentages Bar */}
            <div className="mt-4 pt-3 border-t border-neutral-900 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400 font-bold uppercase flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-red-500" />
                  DYNAMIC MODALITY CONTRIBUTION PERCENTAGES:
                </span>
                <span className="text-neutral-300 text-[10px]">
                  TOTAL CONVERGENCE: {sources.filter(s => s.status !== 'OFFLINE').length}/6 MODALITIES ACTIVE
                </span>
              </div>

              {/* Stacked Contribution Percentage Bar */}
              <div className="w-full h-3 rounded bg-neutral-950 overflow-hidden flex border border-neutral-800">
                {sources.map(src => {
                  if (src.status === 'OFFLINE') return null;
                  return (
                    <div
                      key={src.id}
                      style={{
                        width: `${src.weight}%`,
                        backgroundColor: src.color
                      }}
                      className="h-full transition-all duration-300 relative group cursor-pointer"
                      onClick={() => setSelectedSourceId(src.id)}
                      title={`${src.name}: ${src.weight}% Weight`}
                    />
                  );
                })}
              </div>

              {/* Legend Badges */}
              <div className="flex flex-wrap gap-2 text-[10px] font-mono pt-1">
                {sources.map(src => {
                  const isSelected = selectedSourceId === src.id;
                  const isOffline = src.status === 'OFFLINE';

                  return (
                    <button
                      key={src.id}
                      onClick={() => setSelectedSourceId(src.id)}
                      className={`px-2 py-1 rounded border flex items-center gap-1.5 transition-all ${
                        isOffline
                          ? 'opacity-40 bg-neutral-900 border-neutral-800 text-neutral-500'
                          : isSelected
                          ? 'bg-neutral-900 border-white text-white font-bold shadow-[0_0_8px_rgba(255,255,255,0.2)]'
                          : 'bg-black/60 border-neutral-850 text-neutral-300 hover:text-white'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: src.color }}
                      />
                      <span>{src.name}</span>
                      <strong style={{ color: isOffline ? '#64748b' : src.color }}>
                        {isOffline ? 'OFFLINE' : `${src.weight}%`}
                      </strong>
                    </button>
                  );
                })}
              </div>
            </div>
          </TacticalCard>

          {/* Detailed Selected Modality Inspector */}
          <TacticalCard
            title={`MODALITY INSPECTOR // ${selectedSource.name.toUpperCase()}`}
            subtitle={`PROTOCOL: ${selectedSource.category} // CONTINUOUS TELEMETRY STREAM`}
            badge={
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  selectedSource.status === 'ONLINE'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-red-950 text-red-400 border-red-800'
                }`}
              >
                STATUS: {selectedSource.status}
              </span>
            }
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-black/60 p-2.5 rounded border border-neutral-850">
                  <div className="text-[10px] text-neutral-400">INPUT METRIC</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {selectedSource.metricValue}
                  </div>
                  <div className="text-[9px] text-neutral-500">{selectedSource.metricLabel}</div>
                </div>

                <div className="bg-black/60 p-2.5 rounded border border-neutral-850">
                  <div className="text-[10px] text-neutral-400">CONFIDENCE</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    {selectedSource.confidence}%
                  </div>
                  <div className="text-[9px] text-neutral-500">Signal-to-Noise: 34dB</div>
                </div>

                <div className="bg-black/60 p-2.5 rounded border border-neutral-850">
                  <div className="text-[10px] text-neutral-400">INGEST LATENCY</div>
                  <div className="text-base font-bold text-cyan-400 mt-0.5">
                    {selectedSource.latencyMs} ms
                  </div>
                  <div className="text-[9px] text-neutral-500">Low-latency buffer</div>
                </div>

                <div className="bg-black/60 p-2.5 rounded border border-neutral-850">
                  <div className="text-[10px] text-neutral-400">DATA BANDWIDTH</div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">
                    {selectedSource.dataRate}
                  </div>
                  <div className="text-[9px] text-neutral-500">PCIe / MIL-STD-1553</div>
                </div>
              </div>

              {/* Weight Adjustment Slider & Sensor Ablation Toggle */}
              <div className="pt-2 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-400 text-[11px]">FUSION WEIGHT:</span>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    disabled={selectedSource.status === 'OFFLINE'}
                    value={selectedSource.weight}
                    onChange={e => adjustWeight(selectedSource.id, parseInt(e.target.value))}
                    className="accent-red-600 bg-neutral-800 h-1.5 rounded cursor-pointer w-36"
                  />
                  <span className="font-bold text-white">{selectedSource.weight}%</span>
                </div>

                <button
                  onClick={() => toggleSourceStatus(selectedSource.id)}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                    selectedSource.status === 'ONLINE'
                      ? 'bg-neutral-900 hover:bg-red-950 border border-neutral-700 hover:border-red-600 text-neutral-300 hover:text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    {selectedSource.status === 'ONLINE'
                      ? 'SIMULATE SENSOR ABLATION (CUT FEED)'
                      : 'RESTORE SENSOR FEED'}
                  </span>
                </button>
              </div>
            </div>
          </TacticalCard>
        </div>

        {/* Right Column: Unified Crowd State & Fusion Confidence (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Unified Crowd State Card */}
          <TacticalCard
            title="UNIFIED CROWD STATE (SYNTHESIZED)"
            subtitle="CROSS-MODAL CONVERGENCE HOLISTIC TELEMETRY"
            badge={
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
                FUSED ESTIMATE
              </span>
            }
          >
            <div className="space-y-3 font-mono text-xs">
              {/* True Fused Headcount */}
              <div className="p-3 bg-red-950/20 rounded border border-red-900/60">
                <div className="text-[10px] text-neutral-400 uppercase">
                  UNIFIED HOLISTIC HEADCOUNT (FUSED)
                </div>
                <div className="text-2xl font-bold text-white tracking-tight glow-text-red mt-0.5">
                  {unifiedCrowdState.fusedHeadcount.toLocaleString()}{' '}
                  <span className="text-xs text-neutral-400 font-normal">PAX (±1.4%)</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Cross-verified by 5 active sensors</span>
                </div>
              </div>

              {/* Fused Density Index */}
              <div className="p-2.5 bg-black/60 rounded border border-neutral-850">
                <div className="flex justify-between text-neutral-400 text-[10px]">
                  <span>FUSED DENSITY INDEX:</span>
                  <span className="text-amber-400 font-bold">
                    {unifiedCrowdState.fusedDensity} pax/m²
                  </span>
                </div>
                <div className="w-full bg-neutral-900 rounded-full h-1.5 mt-1.5">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (unifiedCrowdState.fusedDensity / 5.5) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Velocity Vector */}
              <div className="p-2.5 bg-black/60 rounded border border-neutral-850 text-[11px]">
                <div className="text-neutral-400 text-[10px]">GLOBAL FLOW VELOCITY VECTOR:</div>
                <div className="text-cyan-400 font-bold mt-0.5">
                  {unifiedCrowdState.fusedVelocity}
                </div>
              </div>

              {/* Cross-Modal Discrepancy & Hallucination Check */}
              <div className="p-2.5 bg-black/60 rounded border border-neutral-850 text-[11px] space-y-1">
                <div className="flex justify-between text-neutral-400 text-[10px]">
                  <span>CROSS-MODAL DISCREPANCY:</span>
                  <span className="text-white font-bold">
                    {(unifiedCrowdState.crossModalDiscrepancy * 100).toFixed(1)}% VAR
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{unifiedCrowdState.discrepancyStatus}</span>
                </div>
              </div>

              {/* Sensor Coverage */}
              <div className="p-2.5 bg-black/60 rounded border border-neutral-850 text-[11px] flex justify-between items-center">
                <span className="text-neutral-400 text-[10px]">MODALITY COVERAGE:</span>
                <span className="text-white font-bold">
                  {unifiedCrowdState.sensorCoverage}% HEALTH
                </span>
              </div>
            </div>
          </TacticalCard>

          {/* Fusion Confidence Score Gauge */}
          <TacticalCard
            title="FUSION CONFIDENCE & KALMAN HEALTH"
            subtitle="BAYESIAN UNCERTAINTY & SIGNAL PURITY"
            badge={
              <span className="text-[10px] font-mono text-emerald-400">
                σ = ±1.8% VAR
              </span>
            }
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-3 bg-black/70 rounded border border-red-900/40">
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase">
                    GLOBAL FUSION CONFIDENCE
                  </div>
                  <div className="text-3xl font-bold text-red-500 font-mono tracking-tight glow-text-red mt-0.5">
                    {overallConfidence}%
                  </div>
                </div>

                <div className="text-right text-[10px] text-neutral-400 space-y-0.5">
                  <div>Kalman Gain: <strong className="text-white">0.892</strong></div>
                  <div>Loss: <strong className="text-emerald-400">0.0041</strong></div>
                  <div>Inference: <strong className="text-cyan-400">14.2ms</strong></div>
                </div>
              </div>

              {/* Modality Health List */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">
                  INDIVIDUAL STREAM TELEMETRY:
                </div>
                {sources.map(src => (
                  <div
                    key={src.id}
                    onClick={() => setSelectedSourceId(src.id)}
                    className="p-1.5 rounded bg-black/60 border border-neutral-850 flex items-center justify-between text-[11px] cursor-pointer hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      {getSourceIcon(src.category)}
                      <span className="font-bold text-white">{src.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 text-[10px]">{src.latencyMs}ms</span>
                      <span
                        className={`text-[10px] font-bold ${
                          src.status === 'ONLINE' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {src.status === 'ONLINE' ? `${src.confidence}%` : 'OFFLINE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
};
