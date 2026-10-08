# AETHERIS // AI Crowd Intelligence & Tactical Risk Command Platform

> **Classified Defense-Grade / Government Command Center Platform** for Real-Time Crowd Dynamics, Stampede Defense, Surge Forecasting, Dynamic Egress Optimization, and C4ISR Rapid Dispatch.

Developed with a **tactical black & crimson HUD aesthetic**, military-grade typography (`Rajdhani`, `Chakra Petch`, `JetBrains Mono`), synthetic multi-sector telemetry, simulated edge computer vision CCTV with bounding boxes and heatmaps, and Web Audio API acoustic alarm synthesis.

---

## 🚀 Live Demo & Quick Launch

The platform is running locally at:
```bash
http://localhost:5173/
```

To run manually:
```bash
npm install
npm run dev
```

To create a production build:
```bash
npm run build
```

---

## 🏛️ All 7 Dedicated Command Modules

### 1. 📊 Dashboard (`Executive SitRep & Central Telemetry`)
- **Key Metrics HUD**: Active Population Counter (`PAX`), Facility Capacity Gauge (`% Load`), Mean Crowd Density (`pax/m²`), Critical Choke Hotspots Count, and Active Responder Units Deployed.
- **Metropolitan Spatial Vector Map**: Real-time canvas rendering of 8 metropolitan sectors with flow particle streams, risk heat boundaries, drone sweep radiuses, and responder callsign markers.
- **Surveillance Mini-Wall**: Live CCTV video feed from Gate 4 North Turnstiles with AI edge bounding boxes, pedestrian velocities, and optical flow indicators.
- **Mini 360° Tactical Radar**: Continuously sweeping radar beacon showing sector target blips and range rings.
- **Urgent Critical Incidents Queue**: Instant incident queue with one-click **"DISPATCH RESCUE"** actions.
- **Executive SitRep Generator**: Instant formatted Situation Report modal with clipboard export.

### 2. 👁️ Crowd Monitoring (`Tactical Grid & Computer Vision`)
- **Interactive Multi-Sector Map**: Click any sector to load detailed sensory telemetry (density vs safe threshold, velocity distribution, gate inflow/outflow delta).
- **Simulated AI Edge Vision CCTV**:
  - 6 High-Definition surveillance cameras across all sectors.
  - Interactive toggles: **B-Boxes** (AI pedestrian detection tags with confidence score), **Heatmap** (infrared density clusters), **Flow** (optical flow vector direction arrows), and **FLIR** (Night-vision thermal mode).
  - Single Camera Inspector & 2x2 Multi-View Quad Wall.
- **Sensory Telemetry Array**: Headcount, Flow Velocity, Thermal Radiation (°C), and CO2 Air Quality (ppm) to detect crush asphyxiation risks.
- **Live Stress-Test Slider**: Manually inject density spikes (-0.4 to +0.4 pax/m²) or trigger sudden localized surges to evaluate platform response.

### 3. 📈 Prediction Engine (`AI Forecasting & What-If Simulator`)
- **Spatio-Temporal Graph Neural Network (ST-GCN)**: Predictive surge timeline across multi-horizons (+15m, +30m, +60m, +120m).
- **95% Confidence Uncertainty Envelopes**: Visual lower and upper confidence bands with real-time tooltips.
- **Inflow vs Outflow Rate Differential Graph**: Identifies accumulating pressure waves before physical crushes occur.
- **Interactive "What-If" Scenario Shock Modifiers**:
  - *Weather Severity*: Clear (1.0x), Monsoon Rain (1.35x), Extreme Heatwave (1.15x).
  - *Subway / Metro Delays*: 0 to 60 minute backlog slider.
  - *Event Egress Multiplier*: 0.8x to 2.5x surge factor.
  - *Gate Turnstile Throttle*: 100% full capacity down to 25% malfunction.
  - *Instant Dynamic Recomputation*: Adjusting any slider immediately updates the forecast curve and time-to-breach.

### 4. 🛡️ Risk Assessment (`Quantitative Threat Evaluation & Countermeasures`)
- **5x5 Crowd Dynamics Threat Matrix**: Consequence / Severity (1 to 5) vs Likelihood (1 to 5) based on ISO 31000 public safety defense standards. Interactive plotting of sectors into color-coded matrix cells.
- **Multi-Factor Risk Decomposition**:
  - Physical Crush Hazard (%)
  - Choke Point Saturation (%)
  - Evacuation Flow Impedance (%)
  - Panic Propagation Probability (%)
- **AI Automated Safety Countermeasures Engine**: Actionable tactical directives with one-click **"EXECUTE COUNTERMEASURE"** buttons that immediately reduce sector risk scores and deploy squads.

### 5. 🔀 Route Optimization (`Dynamic Egress & Evacuation Routes`)
- **Estimated Evacuation Clearance Time (EECT)**: Real-time calculation of standard egress time vs AI-diverted optimal clearance time.
- **Interactive Pathway Network**: 8 monitored arterial corridors with throughput capacities, widths (meters), and congestion percentages.
- **Corridor Hazard Injector**: Click **"BLOCK CORRIDOR (INJECT HAZARD)"** or **"RE-OPEN"** to test structural blockages and see dynamic rerouting in real time.
- **Dynamic Overhead LED Signage Display**: Real-time sign overrides (`"DANGER_DIVERT"`, `"CLOSED"`, `"EMERGENCY ARTERY OPEN"`).
- **One-Click All-Sector Evacuation**: Engages facility-wide emergency protocols.

### 6. 👥 Resource Allocation (`Responder Fleet & Dispatch Console`)
- **Fleet Roster**: Tactical Police (`ALPHA`), Paramedic EMS (`MEDIC`), Heavy Fire Rescue (`RESCUE`), Surveillance Drones (`DRONE FALCON`), Stewards (`STEWARD`), and Rapid Barrier Squads (`VANGUARD`).
- **Interactive Dispatch Console**: Select Unit -> Select Target Sector -> Click **"DISPATCH TO SECTOR"** (plays tactical audio radio chirp, transitions unit to `EN_ROUTE`, updates ETA).
- **Sector Coverage Deficit Radar**: Highlights under-defended sectors in flashing red indicators.
- **Equipment Locker**: Tracks available gear (Crowd shields, Mojo barriers, Mobile ICUs, Thermal payloads).

### 7. 🚨 Alert Center (`Incident Protocol Dispatch & Mass Broadcast`)
- **Real-Time Incident Stream**: Filterable by Severity (Critical, High, Medium, Low) and Lifecycle Status (Active, Acknowledged, Dispatched, Resolved).
- **Acoustic Audio Alarm**: Built-in Web Audio API synthesizer that plays authentic tactical alarms and clicks with zero external audio assets.
- **Incident Resolution Console**: Acknowledge, Escalate to DEFCON 1, Dispatch Rapid Unit, Mark Resolved.
- **Mass Emergency Broadcast Push**: Compose and push alerts to Public Address (PA) Audio speakers, SMS / Cell Broadcast, and Digital Overhead Signage with pre-set emergency templates.
- **Audit Log Export**: One-click download of the complete incident history as JSON.

### 8. 🧠 Multimodal Fusion (`Central Neural Aggregator`)
- **6 Streaming Input Modalities**:
  - **CCTV** (Computer Vision edge inferencing, YOLO-v11 counts, optical flow)
  - **Traffic API** (Transit authority feeds, arterial velocity, parking occupancy)
  - **Weather API** (Precipitation radar, ambient temperature, wind chill)
  - **WiFi Analytics** (802.11 probe requests, unique MAC packet bursts, AP dwell time)
  - **Bluetooth Analytics** (BLE 5.2 beacon pings, RSSI proximity clustering)
  - **Event Metadata** (Turnstile RFID scan cadence, performer schedule, stage times)
- **Central AI Fusion Core**: Multi-Head Cross-Attention Transformer & Kalman-Bayesian filter with animated data particle flows from all 6 sources into the core.
- **Dynamic Contribution Percentages**: Visual stacked distribution bar with individual ablation toggles to test sensor outages.
- **Unified Crowd State**: Fused holistic headcount (PAX), fused density index, global velocity vector, and cross-modal discrepancy / hallucination check.
- **Fusion Confidence Score**: Overall confidence rating (e.g. 97.8%) with Bayesian uncertainty bounds ($\sigma = \pm 1.8\%$) and stream telemetry table.

---

## 🎨 Theme & Government Command Center Styling

- **Obsidian Black Background** (`#050608` / `#06070a`) with tactical dot and line grids.
- **Tactical Red Accents** (`#ef4444`, `#b91c1c`, `#dc2626`) with crimson glows and pulses.
- **HUD Box Corner Brackets** on all cards and telemetry panels.
- **Scanline Video Overlays & Crosshairs** on surveillance video feeds.
- **DEFCON Threat Switcher** (DEFCON 1 to 5) with animated radar beacons.
- **Web Audio API Sound Engine** with full Mute/Unmute control.

---

## ⚙️ Technical Architecture

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Custom HUD Tactical Utility Layers
- **Icons**: Lucide React
- **Visualizations**: Custom Canvas 2D Vector Particle Engine + Interactive SVG Tactical Charts
- **Audio**: Web Audio API Oscillators & Biquad Filter Synthesis
- **State Management**: React Context (`CommandContext`) with real-time simulation tick engine.
