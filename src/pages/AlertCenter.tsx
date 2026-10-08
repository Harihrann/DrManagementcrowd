import React, { useState } from 'react';
import {
  BellRing,
  Flame,
  Volume2,
  Download,
  Send,
} from 'lucide-react';
import { useCommand } from '../context/CommandContext';
import { TacticalCard } from '../components/common/TacticalCard';
import type { IncidentAlert, IncidentSeverity, IncidentStatus, ResourceUnit } from '../types';
import { soundFx } from '../utils/audio';

export const AlertCenter: React.FC = () => {
  const {
    alerts,
    clearIncident,
    acknowledgeAlert,
    dispatchResource,
    resources,
    setDefcon,
    simulateSurgeIncident,
    totalCrowdCount
  } = useCommand();

  const [severityFilter, setSeverityFilter] = useState<'ALL' | IncidentSeverity>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>('ALL');
  const [selectedAlertId, setSelectedAlertId] = useState<string>(alerts[0]?.id || '');
  const [broadcastChannel, setBroadcastChannel] = useState<'ALL' | 'PA_SYSTEM' | 'SMS_CELL' | 'SIGNAGE'>('ALL');
  const [broadcastMessage, setBroadcastMessage] = useState<string>(
    'ATTENTION ALL VISITORS: SECTOR B TURNSTILES SATURATED. PLEASE PROCEED TO SOUTH BOULEVARD VIA ARTERIAL CORRIDOR 4.'
  );
  const [broadcastSentNotification, setBroadcastSentNotification] = useState<boolean>(false);

  const selectedAlert = alerts.find((a: IncidentAlert) => a.id === selectedAlertId) || alerts[0];

  const filteredAlerts = alerts.filter((a: IncidentAlert) => {
    const matchSev = severityFilter === 'ALL' ? true : a.severity === severityFilter;
    const matchStat = statusFilter === 'ALL' ? true : a.status === statusFilter;
    return matchSev && matchStat;
  });

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[10px] font-mono animate-pulse shadow-[0_0_8px_#ef4444]">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="bg-orange-600 text-white font-bold px-2 py-0.5 rounded text-[10px] font-mono">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="bg-amber-600 text-black font-bold px-2 py-0.5 rounded text-[10px] font-mono">
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[10px] font-mono">
            LOW
          </span>
        );
    }
  };

  const handleSendBroadcast = () => {
    soundFx.playAlert();
    setBroadcastSentNotification(true);
    setTimeout(() => setBroadcastSentNotification(false), 4000);
  };

  const handleExportAuditLog = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(alerts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AETHERIS_INCIDENT_AUDIT_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-3 bg-red-950/20 border border-red-900/40 rounded flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-hud uppercase tracking-wider text-white flex items-center gap-2">
            <BellRing className="w-5 h-5 text-red-500 animate-pulse" />
            C4ISR ALERT CENTER & INCIDENT PROTOCOL DISPATCH
          </h2>
          <p className="text-xs text-neutral-400 font-mono">
            MULTI-SEVERITY ALARM DISPATCH // EMERGENCY BROADCAST PUSH // COMPREHENSIVE AUDIT LOG
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Test Siren Button */}
          <button
            onClick={() => soundFx.playAlert()}
            className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 rounded text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Acoustic Alarm Siren Sound"
          >
            <Volume2 className="w-3.5 h-3.5 text-red-400" />
            <span>TEST ALARM AUDIO</span>
          </button>

          {/* Trigger New Incident */}
          <button
            onClick={() => simulateSurgeIncident()}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.4)] active:scale-95"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>INJECT CRITICAL ALARM</span>
          </button>

          {/* Export Log */}
          <button
            onClick={handleExportAuditLog}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white rounded text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT AUDIT JSON</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Alert Stream & Incident Resolution Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Filterable Incident Feed (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <TacticalCard
            title="REAL-TIME INCIDENT LOG"
            subtitle={`${filteredAlerts.length} INCIDENTS MATCHING CRITERIA`}
            action={
              <div className="flex items-center gap-2">
                {/* Severity Filter */}
                <select
                  value={severityFilter}
                  onChange={e => setSeverityFilter(e.target.value as any)}
                  className="bg-black border border-neutral-800 text-[10px] font-mono text-neutral-300 rounded px-1.5 py-0.5"
                >
                  <option value="ALL">ALL SEVERITIES</option>
                  <option value="CRITICAL">CRITICAL ONLY</option>
                  <option value="HIGH">HIGH ONLY</option>
                  <option value="MEDIUM">MEDIUM ONLY</option>
                  <option value="LOW">LOW ONLY</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="bg-black border border-neutral-800 text-[10px] font-mono text-neutral-300 rounded px-1.5 py-0.5"
                >
                  <option value="ALL">ALL STATUSES</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>
            }
          >
            <div className="space-y-2.5 max-h-[660px] overflow-y-auto pr-1">
              {filteredAlerts.map((alert: IncidentAlert) => {
                const isSelected = selectedAlert?.id === alert.id;

                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlertId(alert.id)}
                    className={`p-3 rounded border text-xs font-mono cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-red-950/70 border-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                        : alert.severity === 'CRITICAL' && alert.status === 'ACTIVE'
                        ? 'bg-red-950/40 border-red-700/80 text-red-200'
                        : 'bg-black/60 border-neutral-850 text-neutral-300 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(alert.severity)}
                        <span className="font-bold text-white">{alert.id}</span>
                        <span className="text-neutral-400">| {alert.sectorName}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">{alert.timestamp}</span>
                    </div>

                    <p className="text-white font-bold mt-1.5 text-[11px] leading-snug">
                      {alert.headline}
                    </p>

                    <p className="text-neutral-400 text-[10px] mt-1 line-clamp-2 leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-neutral-850 flex items-center justify-between text-[10px]">
                      <span className="text-cyan-400">
                        AI CONFIDENCE: <strong>{alert.aiConfidence}%</strong>
                      </span>
                      <span
                        className={`font-bold uppercase ${
                          alert.status === 'RESOLVED'
                            ? 'text-emerald-400'
                            : alert.status === 'ACTIVE'
                            ? 'text-red-400 animate-pulse'
                            : 'text-amber-400'
                        }`}
                      >
                        ● {alert.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </TacticalCard>
        </div>

        {/* Right Column: Incident Resolution Drawer & Mass Broadcast (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Selected Incident Action Console */}
          {selectedAlert && (
            <TacticalCard
              title={`INCIDENT CONSOLE // ${selectedAlert.id}`}
              subtitle={`TARGET SECTOR: ${selectedAlert.sectorName.toUpperCase()}`}
              badge={getSeverityBadge(selectedAlert.severity)}
            >
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-black/70 rounded border border-neutral-800 space-y-2">
                  <div className="text-sm font-bold text-white leading-snug">
                    {selectedAlert.headline}
                  </div>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    {selectedAlert.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-900 text-[11px]">
                    <div>
                      <span className="text-neutral-400">Time Reported:</span>{' '}
                      <strong className="text-white">{selectedAlert.timestamp}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400">Clearance ETA:</span>{' '}
                      <strong className="text-amber-400">
                        ~{selectedAlert.estimatedClearanceMinutes} Minutes
                      </strong>
                    </div>
                    <div>
                      <span className="text-neutral-400">Assigned Units:</span>{' '}
                      <strong className="text-cyan-400">
                        {selectedAlert.assignedUnits.length > 0
                          ? selectedAlert.assignedUnits.join(', ')
                          : 'None Dispatched'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-neutral-400">AI Confidence:</span>{' '}
                      <strong className="text-emerald-400">{selectedAlert.aiConfidence}%</strong>
                    </div>
                  </div>
                </div>

                {/* Tactical Actions Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {/* Acknowledge */}
                  <button
                    onClick={() => acknowledgeAlert(selectedAlert.id)}
                    disabled={selectedAlert.status !== 'ACTIVE'}
                    className="py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 border border-neutral-700 text-white rounded font-bold text-[10px] uppercase transition-colors"
                  >
                    ACKNOWLEDGE
                  </button>

                  {/* Escalate to DEFCON 1 */}
                  <button
                    onClick={() => setDefcon(1)}
                    className="py-2 bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 rounded font-bold text-[10px] uppercase transition-colors"
                  >
                    DEFCON 1 ESCALATE
                  </button>

                  {/* Dispatch Rapid Unit */}
                  <button
                    onClick={() => {
                      const avail = resources.find((r: ResourceUnit) => r.status === 'AVAILABLE');
                      if (avail) {
                        dispatchResource(avail.id, selectedAlert.sectorId);
                      }
                    }}
                    className="py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold text-[10px] uppercase transition-colors shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                  >
                    DISPATCH UNIT
                  </button>

                  {/* Resolve */}
                  <button
                    onClick={() => clearIncident(selectedAlert.id)}
                    disabled={selectedAlert.status === 'RESOLVED'}
                    className="py-2 bg-emerald-950 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-700 text-emerald-200 rounded font-bold text-[10px] uppercase transition-colors"
                  >
                    MARK RESOLVED
                  </button>
                </div>
              </div>
            </TacticalCard>
          )}

          {/* Mass Emergency Broadcast Console */}
          <TacticalCard
            title="FACILITY MASS BROADCAST CONSOLE"
            subtitle="PUBLIC ADDRESS (PA) // SMS CELL BROADCAST // OVERHEAD SIGNAGE"
            badge={
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
                ALL CHANNELS LINKED
              </span>
            }
          >
            <div className="space-y-3 font-mono text-xs">
              {/* Broadcast Target Channel Selector */}
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-[10px] uppercase">CHANNEL:</span>
                <div className="flex border border-neutral-800 rounded bg-black/60 p-0.5 text-[10px]">
                  {(['ALL', 'PA_SYSTEM', 'SMS_CELL', 'SIGNAGE'] as const).map(ch => (
                    <button
                      key={ch}
                      onClick={() => setBroadcastChannel(ch)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        broadcastChannel === ch
                          ? 'bg-red-600 text-white font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Composer */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 uppercase">
                  BROADCAST TEXT TRANSMISSION:
                </label>
                <textarea
                  rows={3}
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded p-2 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Quick Template Buttons */}
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <button
                  onClick={() =>
                    setBroadcastMessage(
                      'URGENT: ALL VISITORS PROCEED TOWARDS MAIN SOUTH EGRESS BOULEVARD IMMEDIATELY. MAINTAIN CALM FLOW.'
                    )
                  }
                  className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-neutral-300"
                >
                  Template: Full Evacuation
                </button>
                <button
                  onClick={() =>
                    setBroadcastMessage(
                      'GATE 4 TURNSTILES EXPERIENCING DELAYS. PLEASE UTILIZE WEST PAVILION PORTAL FOR ENTRY.'
                    )
                  }
                  className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-neutral-300"
                >
                  Template: Gate 4 Reroute
                </button>
                <button
                  onClick={() =>
                    setBroadcastMessage(
                      'METRO LINE 3 TRAIN BOARDING DELAYED. WAIT IN UPPER CENTRAL PLAZA UNTIL CALL.'
                    )
                  }
                  className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-neutral-300"
                >
                  Template: Subway Hold
                </button>
              </div>

              {/* Push Button */}
              <div className="pt-2 flex items-center justify-between border-t border-neutral-900">
                {broadcastSentNotification && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px] animate-pulse">
                    BROADCAST TRANSMITTED ACROSS ALL {totalCrowdCount.toLocaleString()} MONITORED CITIZENS
                  </span>
                )}
                {!broadcastSentNotification && <span />}

                <button
                  onClick={handleSendBroadcast}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_12px_rgba(239,68,68,0.5)] active:scale-95 transition-all text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT MASS BROADCAST</span>
                </button>
              </div>
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
};
