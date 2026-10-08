import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Sector,
  ResourceUnit,
  RouteCorridor,
  IncidentAlert,
  CCTVFeed,
  SimulationModifiers,
  RiskLevel
} from '../types';
import {
  INITIAL_SECTORS,
  INITIAL_RESOURCES,
  INITIAL_CORRIDORS,
  INITIAL_ALERTS,
  INITIAL_CCTV_FEEDS
} from '../data/syntheticData';
import { soundFx } from '../utils/audio';

interface CommandContextType {
  sectors: Sector[];
  resources: ResourceUnit[];
  corridors: RouteCorridor[];
  alerts: IncidentAlert[];
  cctvFeeds: CCTVFeed[];
  defcon: number;
  activeTab: string;
  selectedSectorId: string | null;
  isLiveSimulation: boolean;
  simulationSpeed: number;
  modifiers: SimulationModifiers;
  soundEnabled: boolean;
  systemTime: string;
  totalCrowdCount: number;
  averageDensity: number;
  highRiskCount: number;
  activeUnitsCount: number;
  systemUptimeSeconds: number;
  selectedSector: Sector | null;
  // Actions
  setDefcon: (level: number) => void;
  setActiveTab: (tab: string) => void;
  setSelectedSectorId: (id: string | null) => void;
  toggleAudio: () => void;
  toggleLiveSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  simulateSurgeIncident: (targetSectorId?: string) => void;
  clearIncident: (alertId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  dispatchResource: (unitId: string, sectorId: string) => void;
  recallResource: (unitId: string) => void;
  toggleCorridorBlock: (corridorId: string) => void;
  updateModifiers: (partial: Partial<SimulationModifiers>) => void;
  triggerEmergencyEvacuation: (sectorId?: string) => void;
  resetSimulation: () => void;
  updateSectorDensity: (sectorId: string, deltaDensity: number) => void;
}

const CommandContext = createContext<CommandContextType | null>(null);

export const CommandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sectors, setSectors] = useState<Sector[]>(INITIAL_SECTORS);
  const [resources, setResources] = useState<ResourceUnit[]>(INITIAL_RESOURCES);
  const [corridors, setCorridors] = useState<RouteCorridor[]>(INITIAL_CORRIDORS);
  const [alerts, setAlerts] = useState<IncidentAlert[]>(INITIAL_ALERTS);
  const [cctvFeeds, setCctvFeeds] = useState<CCTVFeed[]>(INITIAL_CCTV_FEEDS);
  const [defcon, setDefconState] = useState<number>(2);
  const [activeTab, setActiveTabState] = useState<string>('dashboard');
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>('sec-b');
  const [isLiveSimulation, setIsLiveSimulation] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [systemUptimeSeconds, setSystemUptimeSeconds] = useState<number>(4320);
  const [systemTime, setSystemTime] = useState<string>(
    new Date().toLocaleTimeString('en-GB', { hour12: false })
  );

  const [modifiers, setModifiers] = useState<SimulationModifiers>({
    weather: 'CLEAR',
    transitDelayMinutes: 12,
    eventSurgeMultiplier: 1.4,
    gateChokeThrottle: 85
  });

  const setDefcon = (level: number) => {
    setDefconState(level);
    if (level === 1) {
      soundFx.playAlert();
    } else {
      soundFx.playBeep();
    }
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    soundFx.playBeep();
  };

  const toggleAudio = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
    if (next) soundFx.playBeep();
  };

  const toggleLiveSimulation = () => {
    setIsLiveSimulation(!isLiveSimulation);
    soundFx.playBeep();
  };

  const updateModifiers = (partial: Partial<SimulationModifiers>) => {
    setModifiers(prev => ({ ...prev, ...partial }));
    soundFx.playBeep();
  };

  // Clock ticker & Uptime
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-GB', { hour12: false }));
      setSystemUptimeSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live simulation tick engine (every 2.5s)
  useEffect(() => {
    if (!isLiveSimulation) return;

    const interval = setInterval(() => {
      // 1. Subtle jitter on sectors
      setSectors(prevSectors =>
        prevSectors.map(sec => {
          // Weather and event multipliers
          const weatherMultiplier =
            modifiers.weather === 'HEAVY_RAIN' ? 1.2 : modifiers.weather === 'EXTREME_HEAT' ? 1.1 : 1.0;
          const surgeFactor = modifiers.eventSurgeMultiplier;
          const jitter = (Math.random() - 0.48) * 0.08 * surgeFactor * weatherMultiplier;
          
          let newDensity = Math.max(0.6, Math.min(6.2, sec.density + jitter));
          // If sector B has choke, elevate slightly
          if (sec.id === 'sec-b' && modifiers.gateChokeThrottle < 70) {
            newDensity = Math.min(5.8, newDensity + 0.04);
          }

          const newCount = Math.round((newDensity / sec.maxSafeDensity) * (sec.capacity * 0.8));
          
          let newRiskLevel: RiskLevel = 'LOW';
          let newRiskScore = Math.round((newDensity / 5.5) * 100);
          if (newDensity > 4.5) {
            newRiskLevel = 'CRITICAL';
            newRiskScore = Math.max(90, newRiskScore);
          } else if (newDensity > 3.8) {
            newRiskLevel = 'SEVERE';
            newRiskScore = Math.max(75, newRiskScore);
          } else if (newDensity > 3.0) {
            newRiskLevel = 'ELEVATED';
            newRiskScore = Math.max(55, newRiskScore);
          } else if (newDensity > 2.0) {
            newRiskLevel = 'MODERATE';
            newRiskScore = Math.max(35, newRiskScore);
          } else {
            newRiskLevel = 'LOW';
            newRiskScore = Math.min(30, newRiskScore);
          }

          const velocity = Math.max(0.2, Number((2.2 - (newDensity * 0.35) + (Math.random() * 0.1 - 0.05)).toFixed(2)));

          return {
            ...sec,
            density: Number(newDensity.toFixed(2)),
            currentCount: Math.min(sec.capacity * 1.05, newCount),
            riskLevel: newRiskLevel,
            riskScore: Math.min(100, Math.max(10, newRiskScore)),
            flowVelocity: velocity,
            inflowRate: Math.max(50, Math.round(sec.inflowRate + (Math.random() * 20 - 10))),
            outflowRate: Math.max(40, Math.round(sec.outflowRate + (Math.random() * 16 - 8)))
          };
        })
      );

      // 2. Corridors flow jitter
      setCorridors(prevCorridors =>
        prevCorridors.map(c => {
          if (c.isBlocked) return c;
          const delta = Math.round((Math.random() - 0.49) * 15);
          const currentFlow = Math.max(40, Math.min(c.maxThroughputPaxMin, c.currentFlowPaxMin + delta));
          const congestion = Math.round((currentFlow / c.maxThroughputPaxMin) * 100);
          let signage = c.signageStatus;
          if (congestion > 90) signage = 'DANGER_DIVERT';
          else if (congestion > 70) signage = 'SLOW';
          else signage = 'GO';

          return {
            ...c,
            currentFlowPaxMin: currentFlow,
            congestionPercent: congestion,
            signageStatus: signage
          };
        })
      );

      // 3. CCTV counts jitter
      setCctvFeeds(prevFeeds =>
        prevFeeds.map(cam => ({
          ...cam,
          aiPedestrianCount: Math.max(50, cam.aiPedestrianCount + Math.round(Math.random() * 10 - 5)),
          crowdVelocity: Math.max(0.2, Number((cam.crowdVelocity + (Math.random() * 0.04 - 0.02)).toFixed(2)))
        }))
      );
    }, 2500 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isLiveSimulation, simulationSpeed, modifiers]);

  // Simulate an on-demand surge or emergency incident
  const simulateSurgeIncident = (targetSectorId?: string) => {
    const secId = targetSectorId || (['sec-b', 'sec-f', 'sec-a', 'sec-c'][Math.floor(Math.random() * 4)]);
    const targetSector = sectors.find(s => s.id === secId) || sectors[0];

    soundFx.playAlert();

    const newAlert: IncidentAlert = {
      id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      sectorId: targetSector.id,
      sectorName: targetSector.name,
      type: 'SURGE_VELOCITY_SPIKE',
      severity: 'CRITICAL',
      headline: `UNEXPECTED CROWD SURGE ANOMALY DETECTED IN ${targetSector.code}`,
      description: `Rapid wave formation detected. Velocity dropped abruptly. Inflow spike exceeding +140% of baseline corridor throughput.`,
      aiConfidence: 97.6,
      status: 'ACTIVE',
      assignedUnits: [],
      estimatedClearanceMinutes: 18,
      coordinates: {
        x: targetSector.coordinates.x + 40,
        y: targetSector.coordinates.y + 40
      }
    };

    setAlerts(prev => [newAlert, ...prev]);

    // Elevate sector density and threat level
    setSectors(prev =>
      prev.map(s =>
        s.id === targetSector.id
          ? {
              ...s,
              density: Math.min(5.9, s.density + 1.2),
              riskLevel: 'CRITICAL',
              riskScore: 98,
              flowVelocity: 0.3,
              chokePointStatus: 'CRITICAL'
            }
          : s
      )
    );
  };

  const clearIncident = (alertId: string) => {
    soundFx.playBeep();
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: 'RESOLVED' } : a))
    );
  };

  const acknowledgeAlert = (alertId: string) => {
    soundFx.playBeep();
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
  };

  const dispatchResource = (unitId: string, sectorId: string) => {
    soundFx.playDispatch();
    const sec = sectors.find(s => s.id === sectorId);
    setResources(prev =>
      prev.map(u =>
        u.id === unitId
          ? {
              ...u,
              status: 'EN_ROUTE',
              assignedSectorId: sectorId,
              assignedSectorName: sec?.name,
              etaSeconds: 90
            }
          : u
      )
    );

    // Link unit to sector
    setSectors(prev =>
      prev.map(s =>
        s.id === sectorId && !s.assignedUnits.includes(unitId)
          ? { ...s, assignedUnits: [...s.assignedUnits, unitId] }
          : s
      )
    );
  };

  const recallResource = (unitId: string) => {
    soundFx.playBeep();
    setResources(prev =>
      prev.map(u =>
        u.id === unitId
          ? {
              ...u,
              status: 'AVAILABLE',
              assignedSectorId: null,
              assignedSectorName: undefined,
              etaSeconds: 0
            }
          : u
      )
    );
  };

  const toggleCorridorBlock = (corridorId: string) => {
    soundFx.playBeep();
    setCorridors(prev =>
      prev.map(c => {
        if (c.id === corridorId) {
          const nextBlocked = !c.isBlocked;
          return {
            ...c,
            isBlocked: nextBlocked,
            signageStatus: nextBlocked ? 'CLOSED' : 'GO',
            signageMessage: nextBlocked
              ? 'CORRIDOR CLOSED BY DISPATCH COMMAND // DETOUR'
              : 'CORRIDOR RE-OPENED // RESUME FLOW',
            currentFlowPaxMin: nextBlocked ? 0 : 350,
            congestionPercent: nextBlocked ? 100 : 40
          };
        }
        return c;
      })
    );
  };

  const triggerEmergencyEvacuation = (sectorId?: string) => {
    soundFx.playAlert();
    setDefconState(1);

    // Set emergency signage across corridors
    setCorridors(prev =>
      prev.map(c => ({
        ...c,
        signageStatus: c.isEmergencyCorridor ? 'GO' : 'DANGER_DIVERT',
        signageMessage: c.isEmergencyCorridor
          ? 'EMERGENCY EVACUATION ARTERY // PROCEED EXPEDITIOUSLY'
          : 'DIVERT TOWARDS SOUTH ARTERY BOULEVARD'
      }))
    );

    const alert: IncidentAlert = {
      id: `EVAC-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      sectorId: sectorId || 'sec-a',
      sectorName: sectorId ? sectors.find(s => s.id === sectorId)?.name || 'General' : 'ALL SECTORS',
      type: 'EVACUATION_BLOCKAGE',
      severity: 'CRITICAL',
      headline: 'FULL FACILITY EMERGENCY EVACUATION PROTOCOL INITIATED',
      description: 'Automatic dynamic signages overridden to egress direction. Public Address sirens activated. Rapid Barrier squads deploying egress funnels.',
      aiConfidence: 99.9,
      status: 'ACTIVE',
      assignedUnits: ['UNIT-P1', 'UNIT-P2', 'UNIT-P3', 'UNIT-B1', 'UNIT-S1'],
      estimatedClearanceMinutes: 24,
      coordinates: { x: 380, y: 220 }
    };

    setAlerts(prev => [alert, ...prev]);
  };

  const resetSimulation = () => {
    soundFx.playBeep();
    setSectors(INITIAL_SECTORS);
    setResources(INITIAL_RESOURCES);
    setCorridors(INITIAL_CORRIDORS);
    setAlerts(INITIAL_ALERTS);
    setCctvFeeds(INITIAL_CCTV_FEEDS);
    setDefconState(2);
    setModifiers({
      weather: 'CLEAR',
      transitDelayMinutes: 10,
      eventSurgeMultiplier: 1.2,
      gateChokeThrottle: 90
    });
  };

  const updateSectorDensity = (sectorId: string, deltaDensity: number) => {
    setSectors(prev =>
      prev.map(s => {
        if (s.id === sectorId) {
          const nextDensity = Math.max(0.5, Math.min(6.5, s.density + deltaDensity));
          const nextRiskLevel: RiskLevel =
            nextDensity > 4.5 ? 'CRITICAL' : nextDensity > 3.8 ? 'SEVERE' : nextDensity > 2.8 ? 'ELEVATED' : 'LOW';
          return {
            ...s,
            density: Number(nextDensity.toFixed(2)),
            riskLevel: nextRiskLevel,
            riskScore: Math.round((nextDensity / 6.0) * 100)
          };
        }
        return s;
      })
    );
  };

  // Aggregated Stats
  const totalCrowdCount = useMemo(
    () => sectors.reduce((acc, s) => acc + s.currentCount, 0),
    [sectors]
  );

  const averageDensity = useMemo(() => {
    if (!sectors.length) return 0;
    const avg = sectors.reduce((acc, s) => acc + s.density, 0) / sectors.length;
    return Number(avg.toFixed(2));
  }, [sectors]);

  const highRiskCount = useMemo(
    () => sectors.filter(s => s.riskLevel === 'CRITICAL' || s.riskLevel === 'SEVERE').length,
    [sectors]
  );

  const activeUnitsCount = useMemo(
    () => resources.filter(r => r.status === 'ON_SCENE' || r.status === 'EN_ROUTE').length,
    [resources]
  );

  const selectedSector = useMemo(
    () => sectors.find(s => s.id === selectedSectorId) || null,
    [sectors, selectedSectorId]
  );

  return (
    <CommandContext.Provider
      value={{
        sectors,
        resources,
        corridors,
        alerts,
        cctvFeeds,
        defcon,
        activeTab,
        selectedSectorId,
        isLiveSimulation,
        simulationSpeed,
        modifiers,
        soundEnabled,
        systemTime,
        totalCrowdCount,
        averageDensity,
        highRiskCount,
        activeUnitsCount,
        systemUptimeSeconds,
        selectedSector,
        setDefcon,
        setActiveTab,
        setSelectedSectorId,
        toggleAudio,
        toggleLiveSimulation,
        setSimulationSpeed,
        simulateSurgeIncident,
        clearIncident,
        acknowledgeAlert,
        dispatchResource,
        recallResource,
        toggleCorridorBlock,
        updateModifiers,
        triggerEmergencyEvacuation,
        resetSimulation,
        updateSectorDensity
      }}
    >
      {children}
    </CommandContext.Provider>
  );
};

export const useCommand = () => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useCommand must be used within a CommandProvider');
  }
  return context;
};
