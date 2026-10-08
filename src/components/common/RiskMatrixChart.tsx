import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import { Sector } from '../../types';

export const RiskMatrixChart: React.FC = () => {
  const { sectors, setSelectedSectorId, selectedSectorId } = useCommand();
  const [hoveredSector, setHoveredSector] = useState<Sector | null>(null);

  // Compute 1-5 likelihood & consequence coordinates from sector metrics
  const getSectorCoords = (sec: Sector) => {
    // Likelihood based on inflow rate and density vs maxSafeDensity
    const densityRatio = sec.density / sec.maxSafeDensity;
    let likelihood = Math.min(5, Math.max(1, Math.round(densityRatio * 3.5)));
    
    // Consequence based on total headcount capacity and choke point status
    let consequence = Math.min(5, Math.max(1, Math.round((sec.riskScore / 100) * 4.5)));
    if (sec.chokePointStatus === 'CRITICAL') consequence = Math.max(4, consequence);
    if (sec.density > 4.5) {
      likelihood = 5;
      consequence = 5;
    }

    return { likelihood, consequence };
  };

  const likelihoodLabels = ['1. Rare', '2. Unlikely', '3. Possible', '4. Likely', '5. Imminent'];
  const consequenceLabels = ['5. Catastrophic', '4. Major', '3. Moderate', '2. Minor', '1. Negligible'];

  const getCellColor = (l: number, c: number) => {
    const score = l * c;
    if (score >= 16) return 'bg-red-950/90 border-red-600/80 hover:bg-red-900';
    if (score >= 10) return 'bg-amber-950/70 border-amber-600/60 hover:bg-amber-900';
    if (score >= 5) return 'bg-yellow-950/50 border-yellow-700/50 hover:bg-yellow-900';
    return 'bg-emerald-950/40 border-emerald-800/40 hover:bg-emerald-900';
  };

  return (
    <div className="bg-black/70 border border-red-900/40 rounded p-4 select-none">
      <div className="flex items-center justify-between mb-3 border-b border-red-900/30 pb-2">
        <div>
          <h4 className="text-xs font-bold font-hud uppercase tracking-wider text-white">
            5X5 CROWD DYNAMICS THREAT MATRIX
          </h4>
          <p className="text-[10px] text-neutral-400 font-mono">
            STAMPEDE / CRUSH HAZARD PROBABILITY EVALUATION
          </p>
        </div>
        <span className="text-[10px] font-mono bg-red-950 px-2 py-0.5 rounded text-red-300 border border-red-800/50">
          ISO 31000 DEFENSE STANDARD
        </span>
      </div>

      <div className="flex">
        {/* Y-Axis Label */}
        <div className="w-8 flex items-center justify-center">
          <span className="text-[10px] font-mono text-neutral-400 -rotate-90 whitespace-nowrap tracking-widest uppercase">
            ▲ IMPACT / CONSEQUENCE
          </span>
        </div>

        {/* Matrix Grid */}
        <div className="flex-1">
          <div className="grid grid-rows-5 gap-1.5">
            {[5, 4, 3, 2, 1].map(cVal => (
              <div key={cVal} className="grid grid-cols-6 gap-1.5 items-center">
                {/* Row label */}
                <span className="text-[9px] font-mono text-neutral-400 text-right pr-2">
                  {consequenceLabels[5 - cVal]}
                </span>

                {/* 5 columns */}
                {[1, 2, 3, 4, 5].map(lVal => {
                  // Find sectors sitting in this cell
                  const cellSectors = sectors.filter(sec => {
                    const coords = getSectorCoords(sec);
                    return coords.likelihood === lVal && coords.consequence === cVal;
                  });

                  return (
                    <div
                      key={lVal}
                      className={`h-11 rounded border flex items-center justify-center relative p-1 transition-all ${getCellColor(
                        lVal,
                        cVal
                      )}`}
                    >
                      {/* Plot Sector Badges inside cell */}
                      <div className="flex flex-wrap gap-1 justify-center">
                        {cellSectors.map(sec => {
                          const isSelected = selectedSectorId === sec.id;
                          return (
                            <button
                              key={sec.id}
                              onClick={() => setSelectedSectorId(sec.id)}
                              onMouseEnter={() => setHoveredSector(sec)}
                              onMouseLeave={() => setHoveredSector(null)}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-transform cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-black scale-110 shadow-[0_0_8px_#ffffff]'
                                  : sec.riskLevel === 'CRITICAL'
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : sec.riskLevel === 'SEVERE'
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                              }`}
                            >
                              {sec.code}
                            </button>
                          );
                        })}
                      </div>

                      {/* Coordinate marker */}
                      <span className="absolute bottom-0.5 right-1 text-[7px] text-neutral-600 font-mono">
                        {lVal},{cVal}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* X-Axis Column Labels */}
          <div className="grid grid-cols-6 gap-1.5 mt-2">
            <div />
            {likelihoodLabels.map((lbl, idx) => (
              <span key={idx} className="text-[9px] font-mono text-neutral-400 text-center">
                {lbl}
              </span>
            ))}
          </div>

          <div className="text-center mt-1">
            <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
              SURGE LIKELIHOOD / PROBABILITY OF INITIATION ►
            </span>
          </div>
        </div>
      </div>

      {/* Hovered Sector Inspector */}
      {hoveredSector && (
        <div className="mt-3 p-2 bg-red-950/40 border border-red-800/60 rounded flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{hoveredSector.code}: {hoveredSector.name}</span>
            <span className="text-red-400">| Density: {hoveredSector.density} p/m²</span>
            <span className="text-amber-400">| Risk Score: {hoveredSector.riskScore}/100</span>
          </div>
          <div className="text-[10px] text-neutral-300">
            Click to focus sector across all command modules
          </div>
        </div>
      )}
    </div>
  );
};
