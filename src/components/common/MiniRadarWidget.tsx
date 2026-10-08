import React, { useEffect, useRef } from 'react';
import { useCommand } from '../../context/CommandContext';

export const MiniRadarWidget: React.FC<{ size?: number }> = ({ size = 160 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { sectors } = useCommand();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      angle = (angle + 0.04) % (Math.PI * 2);
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = (Math.min(w, h) / 2) - 8;

      ctx.clearRect(0, 0, w, h);

      // Outer border circle
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner concentric rings
      [0.33, 0.66, 1].forEach(frac => {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * frac, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshairs
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Sweeping Beam
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0.05)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle - 0.4, angle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();

      // Sweep line
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.stroke();

      // Sector targets
      sectors.forEach((sec, idx) => {
        const secAngle = (idx / sectors.length) * Math.PI * 2;
        const dist = radius * (0.4 + (idx % 3) * 0.2);
        const bx = cx + Math.cos(secAngle) * dist;
        const by = cy + Math.sin(secAngle) * dist;

        ctx.fillStyle = sec.riskLevel === 'CRITICAL' ? '#ef4444' : '#10b981';
        ctx.beginPath();
        ctx.arc(bx, by, sec.riskLevel === 'CRITICAL' ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [sectors]);

  return (
    <div className="relative flex flex-col items-center justify-center p-2 bg-black/60 border border-red-900/40 rounded">
      <canvas ref={canvasRef} width={size} height={size} className="block" />
      <div className="text-[9px] font-mono text-neutral-400 mt-1 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
        <span>RADAR 360° // 4.8 KM RANGE</span>
      </div>
    </div>
  );
};
