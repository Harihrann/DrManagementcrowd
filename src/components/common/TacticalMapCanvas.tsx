import React, { useRef, useEffect } from 'react';
import { useCommand } from '../../context/CommandContext';
import { Sector, RouteCorridor, ResourceUnit } from '../../types';

interface TacticalMapProps {
  interactive?: boolean;
  onSelectSector?: (sector: Sector) => void;
  height?: number | string;
}

export const TacticalMapCanvas: React.FC<TacticalMapProps> = ({
  interactive = true,
  onSelectSector,
  height = 420
}) => {
  const { sectors, corridors, resources, selectedSectorId, setSelectedSectorId } = useCommand();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation frame loop for flowing crowd particles and drone movement
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let step = 0;

    // Synthetic crowd particles
    const particles = Array.from({ length: 65 }, () => ({
      corridorIdx: Math.floor(Math.random() * corridors.length),
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.006,
      size: 1.5 + Math.random() * 1.5
    }));

    const render = () => {
      step++;
      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark tactical canvas tone
      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle tactical grid lines
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Corridors (connections between sectors)
      corridors.forEach(corr => {
        const fromSec = sectors.find(s => s.id === corr.fromSector);
        const toSec = sectors.find(s => s.id === corr.toSector);
        if (!fromSec || !toSec) return;

        const x1 = fromSec.coordinates.x + fromSec.coordinates.width / 2;
        const y1 = fromSec.coordinates.y + fromSec.coordinates.height / 2;
        const x2 = toSec.coordinates.x + toSec.coordinates.width / 2;
        const y2 = toSec.coordinates.y + toSec.coordinates.height / 2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        if (corr.isBlocked) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
          ctx.lineWidth = 4;
          ctx.setLineDash([6, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (corr.congestionPercent > 80) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
          ctx.lineWidth = 3.5;
          ctx.stroke();
        } else if (corr.congestionPercent > 50) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw moving crowd particles along corridors
      particles.forEach(p => {
        const corr = corridors[p.corridorIdx % corridors.length];
        if (!corr || corr.isBlocked) return;

        const fromSec = sectors.find(s => s.id === corr.fromSector);
        const toSec = sectors.find(s => s.id === corr.toSector);
        if (!fromSec || !toSec) return;

        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const x1 = fromSec.coordinates.x + fromSec.coordinates.width / 2;
        const y1 = fromSec.coordinates.y + fromSec.coordinates.height / 2;
        const x2 = toSec.coordinates.x + toSec.coordinates.width / 2;
        const y2 = toSec.coordinates.y + toSec.coordinates.height / 2;

        const curX = x1 + (x2 - x1) * p.progress;
        const curY = y1 + (y2 - y1) * p.progress;

        ctx.fillStyle =
          corr.congestionPercent > 75
            ? 'rgba(239, 68, 68, 0.9)'
            : 'rgba(56, 189, 248, 0.7)';
        ctx.beginPath();
        ctx.arc(curX, curY, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Sectors
      sectors.forEach(sec => {
        const { x, y, width: sw, height: sh } = sec.coordinates;
        const isSelected = selectedSectorId === sec.id;

        // Determine color based on density & risk
        let strokeColor = 'rgba(16, 185, 129, 0.5)';
        let fillColor = 'rgba(16, 185, 129, 0.08)';
        if (sec.riskLevel === 'CRITICAL') {
          strokeColor = '#ef4444';
          fillColor = 'rgba(239, 68, 68, 0.22)';
        } else if (sec.riskLevel === 'SEVERE') {
          strokeColor = '#f97316';
          fillColor = 'rgba(249, 115, 22, 0.18)';
        } else if (sec.riskLevel === 'ELEVATED') {
          strokeColor = '#eab308';
          fillColor = 'rgba(234, 179, 8, 0.14)';
        }

        // Sector backdrop
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, sw, sh);

        // Border & corner brackets
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isSelected ? 2.5 : 1.2;
        ctx.strokeRect(x, y, sw, sh);

        // Highlight if selected
        if (isSelected) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.strokeRect(x - 3, y - 3, sw + 6, sh + 6);
        }

        // Draw Sector Label & Density Badge
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Rajdhani, sans-serif';
        ctx.fillText(`${sec.code} // ${sec.name.split(' ')[0]}`, x + 6, y + 16);

        // Density readout
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle =
          sec.riskLevel === 'CRITICAL' ? '#ef4444' : sec.riskLevel === 'SEVERE' ? '#f97316' : '#94a3b8';
        ctx.fillText(`${sec.density.toFixed(1)} pax/m²`, x + 6, y + 32);

        // Headcount
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`${sec.currentCount.toLocaleString()} pax`, x + 6, y + 46);

        // Mini pulse ring if critical
        if (sec.riskLevel === 'CRITICAL') {
          const pulseRadius = (step % 40) * 0.7;
          ctx.strokeStyle = `rgba(239, 68, 68, ${1 - pulseRadius / 28})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x + sw - 14, y + 14, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(x + sw - 14, y + 14, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Resource Units (Police, EMS, Drones, Stewards)
      resources.forEach(unit => {
        const ux = unit.location.x;
        const uy = unit.location.y;

        ctx.beginPath();
        let iconColor = '#38bdf8';
        if (unit.type === 'POLICE_TACTICAL') iconColor = '#3b82f6';
        if (unit.type === 'PARAMEDIC_EMS') iconColor = '#10b981';
        if (unit.type === 'DRONE_AERIAL_SURVEILLANCE') iconColor = '#c084fc';
        if (unit.type === 'RAPID_BARRIER_SQUAD') iconColor = '#f59e0b';

        ctx.fillStyle = iconColor;
        ctx.arc(ux, uy, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(unit.id, ux + 7, uy + 3);
      });

      // Draw Drone radar sweeping circle
      const drone = resources.find(r => r.type === 'DRONE_AERIAL_SURVEILLANCE');
      if (drone) {
        const dx = drone.location.x;
        const dy = drone.location.y;
        const angle = (step * 0.05) % (Math.PI * 2);

        ctx.strokeStyle = 'rgba(192, 132, 252, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(dx, dy, 36, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(192, 132, 252, 0.7)';
        ctx.beginPath();
        ctx.moveTo(dx, dy);
        ctx.lineTo(dx + Math.cos(angle) * 36, dy + Math.sin(angle) * 36);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [sectors, corridors, resources, selectedSectorId]);

  // Click on sector to select
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Check hit test on sectors
    const hitSector = sectors.find(
      s =>
        clickX >= s.coordinates.x &&
        clickX <= s.coordinates.x + s.coordinates.width &&
        clickY >= s.coordinates.y &&
        clickY <= s.coordinates.y + s.coordinates.height
    );

    if (hitSector) {
      setSelectedSectorId(hitSector.id);
      if (onSelectSector) onSelectSector(hitSector);
    }
  };

  return (
    <div className="relative border border-red-900/40 rounded overflow-hidden bg-black/90 select-none shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
      <canvas
        ref={canvasRef}
        width={760}
        height={500}
        onClick={handleCanvasClick}
        className="w-full h-auto cursor-crosshair block"
        style={{ maxHeight: height }}
      />

      {/* Map Overlay Controls / HUD Legend */}
      <div className="absolute top-2 left-2 bg-black/80 backdrop-blur border border-red-900/40 px-2.5 py-1.5 rounded text-[10px] font-mono text-neutral-400 space-y-1">
        <div className="flex items-center gap-1.5 text-white font-bold font-hud">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>TACTICAL SPATIAL HUD // METRO COMPLEX</span>
        </div>
        <div className="flex items-center gap-3 text-[9px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-emerald-500 inline-block" /> &lt;2.5 p/m² Safe
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-amber-500 inline-block" /> 2.5-3.8 Warning
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-red-500 inline-block" /> &gt;4.0 Critical
          </span>
        </div>
      </div>

      <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur border border-neutral-800 px-2 py-1 rounded text-[9px] font-mono text-neutral-400 flex items-center gap-2">
        <span>CLICK SECTOR TO INSPECT</span>
        <span className="text-red-500">■</span>
        <span>LAT: 40.7128° N | LON: 74.0060° W</span>
      </div>
    </div>
  );
};
