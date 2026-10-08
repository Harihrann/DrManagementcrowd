// Tactical Command System Data Types

export type RiskLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'SEVERE' | 'CRITICAL';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentType =
  | 'CHOKE_POINT_BOTTLENECK'
  | 'DENSITY_CRUSH_HAZARD'
  | 'SURGE_VELOCITY_SPIKE'
  | 'EVACUATION_BLOCKAGE'
  | 'GATE_FAILURE'
  | 'MEDICAL_ASSISTANCE_REQUIRED'
  | 'SUSPICIOUS_UNATTENDED_ITEM'
  | 'PERIMETER_BREACH';

export type IncidentStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'DISPATCHED' | 'RESOLVED';

export type ResourceType =
  | 'POLICE_TACTICAL'
  | 'PARAMEDIC_EMS'
  | 'FIRE_RESCUE'
  | 'DRONE_AERIAL_SURVEILLANCE'
  | 'STEWARD_CROWD_CONTROL'
  | 'RAPID_BARRIER_SQUAD';

export type ResourceStatus = 'AVAILABLE' | 'EN_ROUTE' | 'ON_SCENE' | 'STANDBY';

export interface Sector {
  id: string;
  name: string;
  code: string;
  coordinates: { x: number; y: number; width: number; height: number };
  currentCount: number;
  capacity: number;
  density: number; // people per m²
  maxSafeDensity: number; // standard safe threshold is 3.0 - 4.0 p/m²
  flowVelocity: number; // m/s average speed
  inflowRate: number; // people per minute
  outflowRate: number; // people per minute
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  tempCelsius: number;
  co2Ppm: number;
  cameraCount: number;
  assignedUnits: string[];
  chokePointStatus: 'CLEAR' | 'MODERATE' | 'CRITICAL';
  statusDescription: string;
}

export interface IncidentAlert {
  id: string;
  timestamp: string;
  sectorId: string;
  sectorName: string;
  type: IncidentType;
  severity: IncidentSeverity;
  headline: string;
  description: string;
  aiConfidence: number; // e.g. 96.8%
  status: IncidentStatus;
  assignedUnits: string[];
  estimatedClearanceMinutes: number;
  coordinates: { x: number; y: number };
}

export interface ResourceUnit {
  id: string;
  callsign: string;
  type: ResourceType;
  status: ResourceStatus;
  assignedSectorId: string | null;
  assignedSectorName?: string;
  personnelCount: number;
  etaSeconds: number;
  batteryOrFuel: number; // percentage
  location: { x: number; y: number };
  equippedGear: string[];
  lastPing: string;
}

export interface PredictionPoint {
  timeLabel: string;
  minutesAhead: number;
  predictedDensity: number;
  baselineDensity: number;
  confidenceLower: number;
  confidenceUpper: number;
  predictedInflow: number;
  predictedOutflow: number;
  surgeProbability: number;
}

export interface RouteCorridor {
  id: string;
  name: string;
  fromSector: string;
  toSector: string;
  widthMeters: number;
  maxThroughputPaxMin: number;
  currentFlowPaxMin: number;
  congestionPercent: number; // 0 - 100
  isEmergencyCorridor: boolean;
  isBlocked: boolean;
  blockReason?: string;
  signageMessage: string;
  signageStatus: 'GO' | 'SLOW' | 'DANGER_DIVERT' | 'CLOSED';
}

export interface CCTVFeed {
  id: string;
  sectorId: string;
  sectorCode: string;
  name: string;
  resolution: string;
  fps: number;
  isOnline: boolean;
  aiPedestrianCount: number;
  crowdVelocity: number;
  anomalyDetected: boolean;
  anomalyLabel?: string;
  opticalFlowDirection: string; // e.g., 'NORTH-EAST'
}

export interface SimulationModifiers {
  weather: 'CLEAR' | 'HEAVY_RAIN' | 'EXTREME_HEAT';
  transitDelayMinutes: number; // 0 - 60
  eventSurgeMultiplier: number; // 0.8 - 2.5
  gateChokeThrottle: number; // 25% - 100%
}
