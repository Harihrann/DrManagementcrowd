import React, { useState } from 'react';
import {
  Users,
  Send,
  RotateCcw,
  Radio,
  Clock,
  MapPin,
  Truck,
  HeartPulse,
  Flame,
  Shield
} from 'lucide-react';
import { useCommand } from '../context/CommandContext';
import { TacticalCard } from '../components/common/TacticalCard';
import type { ResourceUnit, ResourceType, ResourceStatus, Sector } from '../types';

export const ResourceAllocation: React.FC = () => {
  const {
    resources,
    sectors,
    dispatchResource,
    recallResource,
    activeUnitsCount
  } = useCommand();

  const [selectedUnitId, setSelectedUnitId] = useState<string>(resources[0].id);
  const [targetSectorId, setTargetSectorId] = useState<string>(sectors[0].id);
  const [statusFilter, setStatusFilter] = useState<'ALL' | ResourceStatus>('ALL');

  const selectedUnit = resources.find((r: ResourceUnit) => r.id === selectedUnitId) || resources[0];

  const filteredResources = resources.filter((r: ResourceUnit) =>
    statusFilter === 'ALL' ? true : r.status === statusFilter
  );

  const getUnitIcon = (type: ResourceType) => {
    switch (type) {
      case 'POLICE_TACTICAL':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'PARAMEDIC_EMS':
        return <HeartPulse className="w-4 h-4 text-emerald-400" />;
      case 'FIRE_RESCUE':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'DRONE_AERIAL_SURVEILLANCE':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      case 'STEWARD_CROWD_CONTROL':
        return <Users className="w-4 h-4 text-amber-400" />;
      case 'RAPID_BARRIER_SQUAD':
        return <Truck className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusBadge = (status: ResourceStatus) => {
    switch (status) {
      case 'ON_SCENE':
        return (
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ON SCENE
          </span>
        );
      case 'EN_ROUTE':
        return (
          <span className="bg-amber-950 text-amber-400 border border-amber-800/80 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400 animate-spin" />
            EN ROUTE
          </span>
        );
      case 'AVAILABLE':
        return (
          <span className="bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
            AVAILABLE
          </span>
        );
      case 'STANDBY':
        return (
          <span className="bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded text-[10px] font-mono">
            STANDBY
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-3 bg-red-950/20 border border-red-900/40 rounded flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-hud uppercase tracking-wider text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" />
            TACTICAL RESOURCE ALLOCATION & RAPID DISPATCH CONSOLE
          </h2>
          <p className="text-xs text-neutral-400 font-mono">
            LAW ENFORCEMENT // PARAMEDIC EMS // FIRE RESCUE // SURVEILLANCE DRONES // STEWARD UNITS
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex border border-neutral-800 rounded bg-black/60 p-0.5 text-xs font-mono">
          {(['ALL', 'AVAILABLE', 'EN_ROUTE', 'ON_SCENE'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === st
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Dispatch Console & Unit Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Dispatch Controller (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <TacticalCard
            title="TACTICAL DISPATCH CONTROLLER"
            subtitle="COMMAND ONE-CLICK DEPLOYMENT TO TARGET HOTSPOT"
            badge={
              <span className="text-[10px] font-mono text-cyan-400">
                ACTIVE UNIT: {selectedUnit.id}
              </span>
            }
          >
            <div className="space-y-4 font-mono text-xs">
              {/* Unit Card details */}
              <div className="p-3 bg-black/70 rounded border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getUnitIcon(selectedUnit.type)}
                    <span className="font-bold text-white text-sm font-hud tracking-wide">
                      {selectedUnit.callsign}
                    </span>
                  </div>
                  {getStatusBadge(selectedUnit.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-neutral-900">
                  <div>
                    <span className="text-neutral-400">Personnel Strength:</span>{' '}
                    <strong className="text-white">{selectedUnit.personnelCount} Officers</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400">Battery / Fuel:</span>{' '}
                    <strong className="text-emerald-400">{selectedUnit.batteryOrFuel}%</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400">Current Assigned:</span>{' '}
                    <strong className="text-cyan-400">
                      {selectedUnit.assignedSectorName || 'Unassigned / Base'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-400">Response ETA:</span>{' '}
                    <strong className="text-amber-400">
                      {selectedUnit.status === 'ON_SCENE' ? '0s (Present)' : `${selectedUnit.etaSeconds}s`}
                    </strong>
                  </div>
                </div>

                {/* Equipped Tactical Kit */}
                <div className="pt-2 border-t border-neutral-900">
                  <div className="text-[10px] text-neutral-400 uppercase">Equipped Tactical Kit:</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedUnit.equippedGear.map((gear: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-neutral-900 text-neutral-300 border border-neutral-800 px-2 py-0.5 rounded text-[10px]"
                      >
                        {gear}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Destination Sector Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-neutral-400 font-bold uppercase flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  SELECT TARGET DESTINATION SECTOR:
                </label>
                <select
                  value={targetSectorId}
                  onChange={e => setTargetSectorId(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded p-2 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                >
                  {sectors.map((sec: Sector) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.code} - {sec.name} ({sec.riskLevel} - {sec.density} p/m²)
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => dispatchResource(selectedUnit.id, targetSectorId)}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(239,68,68,0.4)] active:scale-95 transition-all text-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>DISPATCH TO SECTOR</span>
                </button>

                {selectedUnit.status !== 'AVAILABLE' && (
                  <button
                    onClick={() => recallResource(selectedUnit.id)}
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 rounded font-bold uppercase flex items-center gap-1.5 text-xs transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>RECALL</span>
                  </button>
                )}
              </div>
            </div>
          </TacticalCard>

          {/* Sector Defense Balance & Readiness Matrix */}
          <TacticalCard
            title="SECTOR COVERAGE VS RISK DEFICIT"
            subtitle="IDENTIFIES DEFENSE DISCREPANCIES ACROSS THE FACILITY"
          >
            <div className="space-y-2 text-xs font-mono max-h-[300px] overflow-y-auto pr-1">
              {sectors.map((sec: Sector) => {
                const assignedCount = resources.filter((r: ResourceUnit) => r.assignedSectorId === sec.id).length;
                const isUnderDefended = (sec.riskLevel === 'CRITICAL' || sec.riskLevel === 'SEVERE') && assignedCount === 0;

                return (
                  <div
                    key={sec.id}
                    className={`p-2 rounded border flex items-center justify-between ${
                      isUnderDefended
                        ? 'bg-red-950/60 border-red-600 text-red-200'
                        : 'bg-black/60 border-neutral-850 text-neutral-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{sec.code}: {sec.name}</span>
                        {isUnderDefended && (
                          <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded font-extrabold animate-pulse">
                            DEFICIT
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Risk: {sec.riskLevel} | Density: {sec.density} p/m²
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-white">
                        {assignedCount} UNITS
                      </div>
                      <div className="text-[10px] text-cyan-400">
                        {assignedCount > 0 ? 'COVERED' : 'UNGUARDED'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TacticalCard>
        </div>

        {/* Right Column: Full Tactical Units Roster (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <TacticalCard
            title="TACTICAL UNITS ACTIVE FLEET ROSTER"
            subtitle={`${filteredResources.length} UNITS MATCHING ACTIVE FILTER`}
            badge={
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
                {activeUnitsCount} DEPLOYED TO FIELD
              </span>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[680px] overflow-y-auto pr-1">
              {filteredResources.map((unit: ResourceUnit) => {
                const isSelected = selectedUnitId === unit.id;

                return (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`p-3 rounded border text-xs font-mono cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-red-950/60 border-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                        : 'bg-black/60 border-neutral-850 text-neutral-300 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getUnitIcon(unit.type)}
                        <span className="font-bold text-white">{unit.callsign}</span>
                      </div>
                      {getStatusBadge(unit.status)}
                    </div>

                    <div className="mt-2 text-[11px] text-neutral-400 space-y-0.5">
                      <div className="flex justify-between">
                        <span>Unit ID:</span>
                        <strong className="text-white">{unit.id}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Personnel:</span>
                        <strong className="text-white">{unit.personnelCount} Pax</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Sector Station:</span>
                        <strong className="text-cyan-400">
                          {unit.assignedSectorName || 'Base Depot'}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Heartbeat Ping:</span>
                        <span className="text-neutral-500">{unit.lastPing}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-neutral-850 flex items-center justify-between text-[10px]">
                      <span className="text-neutral-400">
                        Battery: <strong className="text-emerald-400">{unit.batteryOrFuel}%</strong>
                      </span>
                      <span className="text-red-400 font-bold">CLICK TO SELECT</span>
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
