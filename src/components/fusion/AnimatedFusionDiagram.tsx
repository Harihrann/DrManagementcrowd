import React, { useRef, useEffect } from 'react';
import {
  Camera,
  Car,
  CloudRain,
  Wifi,
  Bluetooth,
  Calendar,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export interface ModalitySource {
  id: string;
  name: string;
  category: 'CCTV' | 'TRAFFIC' | 'WEATHER' | 'WIFI' | 'BLUETOOTH' | 'EVENT';
  weight: number; // percentage
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  dataRate: string;
  confidence: number;
  color: string;
  metricLabel: string;
  metricValue: string;
}

interface AnimatedFusionDiagramProps {
  sources: ModalitySource[];
  activeSourceId: string | null;
  onSelectSource: (id: string) => void;
  overallConfidence: number;
}

export const AnimatedFusionDiagram: React.FC<AnimatedFusionDiagramProps> = ({
  sources,
  activeSourceId,
  onSelectSource,
  overallConfidence
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    // Synthetic data particles traveling from source nodes to central fusion core
    const particles = Array.from({ length: 48 }, () => ({
      sourceIdx: Math.floor(Math.random() * sources.length),
      progress: Math.random(),
      speed: 0.005 + Math.random() * 0.008,
      size: 2 + Math.random() * 2
    }));

    const render = () => {
      step++;
      const w = canvas.width;
      const h = canvas.height;

      // Dark tactical canvas background
      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, w, h);

      // Subtle grid
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Center Core Coordinates
      const centerX = w / 2;
      const centerY = h / 2;
      const coreRadius = 54;

      // Calculate node positions (3 on left, 3 on right)
      const leftIndices = [0, 1, 2]; // CCTV, Traffic, Weather
      const rightIndices = [3, 4, 5]; // WiFi, Bluetooth, Event
      const nodeRadius = 24;

      const getNodePos = (idx: number) => {
        if (leftIndices.includes(idx)) {
          const row = leftIndices.indexOf(idx);
          const x = 90;
          const y = (h / 4) * (row + 1);
          return { x, y };
        } else {
          const row = rightIndices.indexOf(idx);
          const x = w - 90;
          const y = (h / 4) * (row + 1);
          return { x, y };
        }
      };

      // Draw connection bus lines from nodes to central engine
      sources.forEach((src, idx) => {
        const { x, y } = getNodePos(idx);
        const isOffline = src.status === 'OFFLINE';

        ctx.beginPath();
        ctx.moveTo(x, y);

        // Curved bezier line to center core
        const cp1x = x > centerX ? x - 80 : x + 80;
        const cp1y = y;
        const cp2x = x > centerX ? centerX + 50 : centerX - 50;
        const cp2y = centerY;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, centerX, centerY);

        if (isOffline) {
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          // Gradient line glowing towards center
          const grad = ctx.createLinearGradient(x, y, centerX, centerY);
          grad.addColorStop(0, src.color + '40');
          grad.addColorStop(0.5, src.color + '90');
          grad.addColorStop(1, '#ef444490');

          ctx.strokeStyle = grad;
          ctx.lineWidth = activeSourceId === src.id ? 3 : 1.8;
          ctx.stroke();
        }
      });

      // Draw flowing data packet particles along the bezier paths
      particles.forEach(p => {
        const src = sources[p.sourceIdx % sources.length];
        if (!src || src.status === 'OFFLINE') return;

        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const { x: startX, y: startY } = getNodePos(p.sourceIdx);
        const cp1x = startX > centerX ? startX - 80 : startX + 80;
        const cp1y = startY;
        const cp2x = startX > centerX ? centerX + 50 : centerX - 50;
        const cp2y = centerY;

        // Cubic bezier point calculation
        const t = p.progress;
        const cx =
          Math.pow(1 - t, 3) * startX +
          3 * Math.pow(1 - t, 2) * t * cp1x +
          3 * (1 - t) * Math.pow(t, 2) * cp2x +
          Math.pow(t, 3) * centerX;
        const cy =
          Math.pow(1 - t, 3) * startY +
          3 * Math.pow(1 - t, 2) * t * cp1y +
          3 * (1 - t) * Math.pow(t, 2) * cp2y +
          Math.pow(t, 3) * centerY;

        // Draw glowing particle
        ctx.fillStyle = src.color;
        ctx.beginPath();
        ctx.arc(cx, cy, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow trail
        ctx.strokeStyle = src.color + '55';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw Center Central AI Fusion Engine Core
      // 1. Concentric pulsing radar rings
      const pulse1 = (step % 60) / 60;
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 * (1 - pulse1)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius + pulse1 * 30, 0, Math.PI * 2);
      ctx.stroke();

      const pulse2 = ((step + 30) % 60) / 60;
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 * (1 - pulse2)})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius + pulse2 * 30, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Core body
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        5,
        centerX,
        centerY,
        coreRadius
      );
      coreGrad.addColorStop(0, '#7f1d1d');
      coreGrad.addColorStop(0.7, '#1f0d11');
      coreGrad.addColorStop(1, '#0c0709');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 3. Central rotating neural ring
      const angle = (step * 0.03) % (Math.PI * 2);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, coreRadius - 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 4. Center Core Labels
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Rajdhani, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AI FUSION CORE', centerX, centerY - 10);

      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText(`${overallConfidence.toFixed(1)}%`, centerX, centerY + 8);

      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('CROSS-ATTENTION', centerX, centerY + 22);

      // Draw Modality Source Nodes
      sources.forEach((src, idx) => {
        const { x, y } = getNodePos(idx);
        const isSelected = activeSourceId === src.id;

        // Outer glow on select
        if (isSelected) {
          ctx.strokeStyle = src.color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius + 5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Node Circle
        ctx.fillStyle = '#0a0d14';
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = src.status === 'OFFLINE' ? '#475569' : src.color;
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.stroke();

        // Node Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(src.name.split(' ')[0], x, y - 2);

        // Weight tag
        ctx.font = 'bold 8px "JetBrains Mono", monospace';
        ctx.fillStyle = src.color;
        ctx.fillText(`${src.weight.toFixed(0)}% WT`, x, y + 10);

        // Status indicator dot
        ctx.fillStyle =
          src.status === 'ONLINE'
            ? '#10b981'
            : src.status === 'DEGRADED'
            ? '#f59e0b'
            : '#ef4444';
        ctx.beginPath();
        ctx.arc(x + 16, y - 16, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [sources, activeSourceId, overallConfidence]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Check hit test against the 6 source nodes
    sources.forEach((src, idx) => {
      const leftIndices = [0, 1, 2];
      const rightIndices = [3, 4, 5];
      let x = 90;
      let y = (canvas.height / 4) * (leftIndices.indexOf(idx) + 1);
      if (rightIndices.includes(idx)) {
        x = canvas.width - 90;
        y = (canvas.height / 4) * (rightIndices.indexOf(idx) + 1);
      }

      const dist = Math.hypot(clickX - x, clickY - y);
      if (dist <= 30) {
        onSelectSource(src.id);
      }
    });
  };

  return (
    <div className="relative border border-red-900/40 rounded bg-black/90 overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.85)]">
      <canvas
        ref={canvasRef}
        width={760}
        height={420}
        onClick={handleCanvasClick}
        className="w-full h-auto cursor-pointer block select-none"
      />

      {/* Top Banner Overlay */}
      <div className="absolute top-2 left-2 bg-black/80 backdrop-blur border border-red-900/50 px-2.5 py-1 rounded text-[10px] font-mono text-neutral-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <span className="text-white font-bold font-hud">
          MULTIMODAL NEURAL BUS ARCHITECTURE
        </span>
        <span className="text-red-400">| 6 INPUT STREAMS CONNECTED</span>
      </div>

      <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur border border-neutral-800 px-2 py-1 rounded text-[9px] font-mono text-neutral-400 flex items-center gap-2">
        <span>CLICK MODALITY NODE TO INSPECT TELEMETRY</span>
        <span className="text-red-500">■</span>
        <span className="text-emerald-400">LATENCY: 14.2ms</span>
      </div>
    </div>
  );
};
