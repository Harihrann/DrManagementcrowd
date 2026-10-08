import React, { useState } from 'react';

export interface DataPoint {
  label: string;
  actual?: number;
  predicted?: number;
  upper?: number;
  lower?: number;
  inflow?: number;
  outflow?: number;
}

interface TacticalLineChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  showConfidence?: boolean;
  showInflowOutflow?: boolean;
}

export const TacticalLineChart: React.FC<TacticalLineChartProps> = ({
  data,
  height = 220,
  showConfidence = true,
  showInflowOutflow = false
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  // Find max value
  const allValues: number[] = [];
  data.forEach(d => {
    if (d.actual !== undefined) allValues.push(d.actual);
    if (d.predicted !== undefined) allValues.push(d.predicted);
    if (d.upper !== undefined) allValues.push(d.upper);
    if (d.inflow !== undefined) allValues.push(d.inflow);
    if (d.outflow !== undefined) allValues.push(d.outflow);
  });
  const maxVal = Math.max(...allValues, 6.0) * 1.15;
  const minVal = 0;

  const chartWidth = 600;
  const chartHeight = height;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const getX = (idx: number) => padding.left + (idx / (data.length - 1)) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - ((val - minVal) / (maxVal - minVal)) * innerHeight;

  // Build path strings
  const buildPath = (key: 'actual' | 'predicted' | 'inflow' | 'outflow') => {
    return data
      .filter(d => d[key] !== undefined)
      .map((d, i) => {
        const val = d[key]!;
        const x = getX(i);
        const y = getY(val);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  // Build confidence area band
  let confidencePath = '';
  if (showConfidence && data[0]?.upper !== undefined && data[0]?.lower !== undefined) {
    const upperPoints = data.map((d, i) => `${getX(i)} ${getY(d.upper || 0)}`);
    const lowerPoints = [...data]
      .reverse()
      .map((d, i) => `${getX(data.length - 1 - i)} ${getY(d.lower || 0)}`);
    confidencePath = `M ${upperPoints.join(' L ')} L ${lowerPoints.join(' L ')} Z`;
  }

  const hoverData = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div className="relative select-none w-full overflow-hidden bg-black/60 rounded border border-neutral-800/80 p-2">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="grid-glow-red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="grid-glow-cyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const val = minVal + pct * (maxVal - minVal);
          const y = padding.top + innerHeight - pct * innerHeight;
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                fill="#64748b"
                fontSize="9"
                fontFamily="JetBrains Mono"
                textAnchor="end"
              >
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Confidence Area Band */}
        {showConfidence && confidencePath && (
          <path d={confidencePath} fill="rgba(239, 68, 68, 0.12)" />
        )}

        {/* Inflow / Outflow curves */}
        {showInflowOutflow ? (
          <>
            <path
              d={buildPath('inflow')}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="2,2"
            />
            <path
              d={buildPath('outflow')}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
            />
          </>
        ) : (
          <>
            {/* Predicted Surge Curve */}
            <path
              d={buildPath('predicted')}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeDasharray="5,3"
            />

            {/* Actual Density Curve */}
            <path
              d={buildPath('actual')}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          </>
        )}

        {/* Data points & hover listener columns */}
        {data.map((d, i) => {
          const x = getX(i);
          return (
            <g
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              className="cursor-pointer"
            >
              {/* Invisible touch column */}
              <rect
                x={x - innerWidth / (data.length * 2)}
                y={padding.top}
                width={innerWidth / data.length}
                height={innerHeight}
                fill="transparent"
              />

              {/* X Axis Label */}
              <text
                x={x}
                y={chartHeight - padding.bottom + 18}
                fill={hoverIndex === i ? '#ffffff' : '#64748b'}
                fontSize="9"
                fontFamily="JetBrains Mono"
                textAnchor="middle"
              >
                {d.label}
              </text>

              {/* Point on curve */}
              {d.actual !== undefined && (
                <circle
                  cx={x}
                  cy={getY(d.actual)}
                  r={hoverIndex === i ? 4.5 : 2.5}
                  fill="#ffffff"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                />
              )}
              {d.predicted !== undefined && (
                <circle
                  cx={x}
                  cy={getY(d.predicted)}
                  r={hoverIndex === i ? 4.5 : 2.5}
                  fill="#ef4444"
                />
              )}
            </g>
          );
        })}

        {/* Hover Crosshair line */}
        {hoverIndex !== null && (
          <line
            x1={getX(hoverIndex)}
            y1={padding.top}
            x2={getX(hoverIndex)}
            y2={padding.top + innerHeight}
            stroke="rgba(239, 68, 68, 0.6)"
            strokeDasharray="3,3"
            strokeWidth="1.5"
          />
        )}
      </svg>

      {/* Hover Floating Tooltip */}
      {hoverData && hoverIndex !== null && (
        <div
          className="absolute pointer-events-none bg-black/90 border border-red-500/80 px-2.5 py-1.5 rounded text-[10px] font-mono shadow-[0_0_12px_rgba(239,68,68,0.3)] z-30 space-y-0.5"
          style={{
            top: 10,
            left: Math.min(380, Math.max(50, getX(hoverIndex) * 0.95))
          }}
        >
          <div className="text-white font-bold border-b border-red-900/40 pb-0.5 flex justify-between gap-3">
            <span>T+{hoverData.label}</span>
            <span className="text-red-400">SURGE MODEL</span>
          </div>
          {hoverData.actual !== undefined && (
            <div className="flex justify-between gap-3 text-neutral-300">
              <span>Observed:</span>
              <strong className="text-white">{hoverData.actual.toFixed(2)} p/m²</strong>
            </div>
          )}
          {hoverData.predicted !== undefined && (
            <div className="flex justify-between gap-3 text-red-300">
              <span>Predicted:</span>
              <strong className="text-red-400">{hoverData.predicted.toFixed(2)} p/m²</strong>
            </div>
          )}
          {hoverData.upper !== undefined && hoverData.lower !== undefined && (
            <div className="flex justify-between gap-3 text-neutral-400 text-[9px]">
              <span>95% CI:</span>
              <span>[{hoverData.lower.toFixed(1)} - {hoverData.upper.toFixed(1)}]</span>
            </div>
          )}
          {hoverData.inflow !== undefined && (
            <div className="flex justify-between gap-3 text-cyan-300">
              <span>Inflow:</span>
              <strong>{hoverData.inflow} pax/min</strong>
            </div>
          )}
          {hoverData.outflow !== undefined && (
            <div className="flex justify-between gap-3 text-emerald-300">
              <span>Outflow:</span>
              <strong>{hoverData.outflow} pax/min</strong>
            </div>
          )}
        </div>
      )}

      {/* Chart Legend */}
      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1 px-2 border-t border-neutral-900 mt-1">
        <div className="flex items-center gap-4">
          {!showInflowOutflow ? (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-white inline-block" /> Actual Live
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-red-500 border-b border-dashed inline-block" /> AI Predicted
              </span>
              {showConfidence && (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 bg-red-950/80 border border-red-800/40 inline-block" /> 95% Confidence Band
                </span>
              )}
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-3 h-0.5 bg-cyan-400 inline-block" /> Inflow Rate
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-0.5 bg-emerald-400 inline-block" /> Outflow Rate
              </span>
            </>
          )}
        </div>
        <span className="text-[9px] text-neutral-500">SPATIAL-TEMPORAL GNN</span>
      </div>
    </div>
  );
};
