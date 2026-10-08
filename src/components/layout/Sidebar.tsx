import React from 'react';
import {
  LayoutDashboard,
  Eye,
  TrendingUp,
  ShieldAlert,
  Route as RouteIcon,
  Users,
  BellRing,
  Radio,
  Sliders,
  ChevronRight,
  Database,
  Cpu
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, highRiskCount, activeUnitsCount } = useCommand();

  const unreadAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  const navItems = [
    {
      id: 'dashboard',
      label: '1. Dashboard',
      sublabel: 'Executive Command & SitRep',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'monitoring',
      label: '2. Crowd Monitoring',
      sublabel: 'Tactical Grid & CCTV Feeds',
      icon: Eye,
      badge: { text: '8 CAM', color: 'bg-neutral-800 text-neutral-300' }
    },
    {
      id: 'prediction',
      label: '3. Prediction Engine',
      sublabel: 'Surge Modeling & Neural Forecast',
      icon: TrendingUp,
      badge: { text: 'AI +120m', color: 'bg-cyan-950 text-cyan-400 border border-cyan-800/50' }
    },
    {
      id: 'risk',
      label: '4. Risk Assessment',
      sublabel: 'Crush Hazard & 5x5 Matrix',
      icon: ShieldAlert,
      badge: highRiskCount > 0 ? { text: `${highRiskCount} SEV`, color: 'bg-red-950 text-red-400 border border-red-800/70 animate-pulse' } : null
    },
    {
      id: 'routes',
      label: '5. Route Optimization',
      sublabel: 'Dynamic Egress & Clearance',
      icon: RouteIcon,
      badge: { text: '8 PATHS', color: 'bg-neutral-800 text-neutral-300' }
    },
    {
      id: 'resources',
      label: '6. Resource Allocation',
      sublabel: 'Tactical Units & EMS Dispatch',
      icon: Users,
      badge: { text: `${activeUnitsCount} DEPLOY`, color: 'bg-amber-950 text-amber-400 border border-amber-800/60' }
    },
    {
      id: 'alerts',
      label: '7. Alert Center',
      sublabel: 'Incident Log & Siren Protocols',
      icon: BellRing,
      badge: unreadAlertsCount > 0 ? { text: `${unreadAlertsCount} ACTIVE`, color: 'bg-red-600 text-white font-bold animate-pulse' } : null
    },
    {
      id: 'fusion',
      label: '8. Multimodal Fusion',
      sublabel: 'Central Neural Aggregator',
      icon: Cpu,
      badge: { text: '6 INPUTS', color: 'bg-red-950 text-red-300 border border-red-800/60' }
    }
  ];

  return (
    <aside className="w-64 bg-[#050609] border-r border-red-900/30 flex flex-col justify-between shrink-0 select-none">
      {/* Top Tactical Label */}
      <div>
        <div className="p-3 border-b border-red-900/25 bg-red-950/10">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 tracking-wider">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              OPERATIONAL NODES
            </span>
            <span className="text-red-500 font-bold">MIL-STD 810</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full group text-left px-3 py-2.5 rounded transition-all duration-150 flex items-center justify-between border ${
                  isActive
                    ? 'bg-gradient-to-r from-red-950/70 via-red-950/40 to-black border-red-500/60 text-white shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                    : 'bg-transparent border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60 hover:border-neutral-800/80'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`p-1.5 rounded transition-colors ${
                      isActive
                        ? 'bg-red-600 text-white shadow-[0_0_8px_#ef4444]'
                        : 'bg-neutral-900 text-neutral-400 group-hover:text-red-400 group-hover:bg-red-950/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div
                      className={`text-xs font-semibold tracking-wide font-hud ${
                        isActive ? 'text-red-400 font-bold' : 'text-neutral-300'
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate font-mono">
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-medium ${item.badge.color}`}
                    >
                      {item.badge.text}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-red-500" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Tactical System Health & Telemetry */}
      <div className="p-3 border-t border-red-900/30 bg-[#07080d]/80 text-[11px] font-mono text-neutral-400 space-y-2">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-red-400" />
            TELEMETRY LINK
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            SECURE
          </span>
        </div>

        <div className="bg-black/60 border border-neutral-800 rounded p-2 space-y-1 text-[10px]">
          <div className="flex justify-between">
            <span className="text-neutral-400">Spatial Engine:</span>
            <span className="text-neutral-200">GNN-Spatio-v4.2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Drone Patrol Mesh:</span>
            <span className="text-cyan-400">2 Active / 4K Feed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Telemetry Stream:</span>
            <span className="text-emerald-400">5.4 MB/s (Low Latency)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Command Encryption:</span>
            <span className="text-red-400 font-semibold">AES-256 GCM</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-1">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-red-500" />
            C4ISR SYS REV 9.4
          </span>
          <span>STAMPEDE DEFENSE</span>
        </div>
      </div>
    </aside>
  );
};
