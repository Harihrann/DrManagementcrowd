import React, { useRef, useEffect, useState } from 'react';
import {
  Camera,
  Layers,
  Radio,
  Eye,
  Crosshair,
  Maximize2,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { CCTVFeed } from '../../types';

interface CCTVPlayerProps {
  feed: CCTVFeed;
  showControls?: boolean;
}

export const CCTVPlayer: React.FC<CCTVPlayerProps> = ({ feed, showControls = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showBoxes, setShowBoxes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [nightVision, setNightVision] = useState(false);
  const [showFlowVectors, setShowFlowVectors] = useState(false);

  // Generate synthetic crowd agents for the camera
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    // Synthetic pedestrian agents inside camera frame
    const agentCount = Math.min(24, Math.max(10, Math.round(feed.aiPedestrianCount / 18)));
    const agents = Array.from({ length: agentCount }, (_, i) => ({
      id: `P-${1000 + i * 17}`,
      x: 30 + Math.random() * (canvas.width - 60),
      y: 40 + Math.random() * (canvas.height - 80),
      vx: (Math.random() - 0.45) * 1.2,
      vy: (Math.random() - 0.45) * 1.2,
      w: 18 + Math.random() * 8,
      h: 36 + Math.random() * 12,
      conf: 92 + Math.floor(Math.random() * 8)
    }));

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Base background tone (infrared or tactical surveillance darkness)
      if (nightVision) {
        ctx.fillStyle = '#06170d'; // Night-vision green FLIR tone
      } else {
        ctx.fillStyle = '#0a0c10'; // Obsidian tactical surveillance tone
      }
      ctx.fillRect(0, 0, w, h);

      // Perspective floor grid
      ctx.strokeStyle = nightVision ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, h);
        ctx.lineTo(w / 2 + (i - w / 2) * 0.3, 30);
        ctx.stroke();
      }

      // Draw Simulated Crowd Density Heatmap Glow
      if (showHeatmap) {
        agents.forEach(a => {
          const radGrad = ctx.createRadialGradient(a.x + a.w / 2, a.y + a.h / 2, 5, a.x + a.w / 2, a.y + a.h / 2, 45);
          if (feed.anomalyDetected) {
            radGrad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
            radGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.25)');
            radGrad.addColorStop(1, 'transparent');
          } else {
            radGrad.addColorStop(0, 'rgba(234, 179, 8, 0.3)');
            radGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.15)');
            radGrad.addColorStop(1, 'transparent');
          }
          ctx.fillStyle = radGrad;
          ctx.fillRect(a.x - 45, a.y - 45, a.w + 90, a.h + 90);
        });
      }

      // Draw Pedestrian Figures & AI Bounding Boxes
      agents.forEach(a => {
        // Subtle drift movement
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 20 || a.x > w - 40) a.vx *= -1;
        if (a.y < 30 || a.y > h - 60) a.vy *= -1;

        // Pedestrian silhouette
        ctx.fillStyle = nightVision ? 'rgba(134, 239, 172, 0.6)' : 'rgba(203, 213, 225, 0.6)';
        ctx.beginPath();
        // Head
        ctx.arc(a.x + a.w / 2, a.y + 6, a.w / 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Torso / body
        ctx.fillRect(a.x + a.w * 0.2, a.y + 12, a.w * 0.6, a.h - 14);

        // AI Computer Vision Bounding Box
        if (showBoxes) {
          const isHazardAgent = feed.anomalyDetected && a.conf > 95;
          ctx.strokeStyle = isHazardAgent
            ? 'rgba(239, 68, 68, 0.95)'
            : nightVision
            ? 'rgba(34, 197, 94, 0.85)'
            : 'rgba(56, 189, 248, 0.75)';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(a.x, a.y, a.w, a.h);

          // Corner tags
          const tagSize = 4;
          ctx.fillStyle = ctx.strokeStyle;
          ctx.fillRect(a.x, a.y, tagSize, 2);
          ctx.fillRect(a.x, a.y, 2, tagSize);
          ctx.fillRect(a.x + a.w - tagSize, a.y, tagSize, 2);
          ctx.fillRect(a.x + a.w - 2, a.y, 2, tagSize);

          // Annotation Tag
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillStyle = isHazardAgent ? '#ef4444' : '#38bdf8';
          ctx.fillText(`${a.id} [${a.conf}%]`, a.x, a.y - 3);
        }

        // Optical flow vectors
        if (showFlowVectors) {
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x + a.w / 2, a.y + a.h / 2);
          ctx.lineTo(a.x + a.w / 2 + a.vx * 15, a.y + a.h / 2 + a.vy * 15);
          ctx.stroke();
        }
      });

      // Video scanlines and HUD crosshair
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let sl = 0; sl < h; sl += 4) {
        ctx.beginPath();
        ctx.moveTo(0, sl);
        ctx.lineTo(w, sl);
        ctx.stroke();
      }

      // Camera HUD overlays (Center Crosshair)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.beginPath();
      ctx.moveTo(w / 2 - 10, h / 2);
      ctx.lineTo(w / 2 + 10, h / 2);
      ctx.moveTo(w / 2, h / 2 - 10);
      ctx.lineTo(w / 2, h / 2 + 10);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [feed, showBoxes, showHeatmap, nightVision, showFlowVectors]);

  return (
    <div className="border border-red-900/40 rounded bg-black overflow-hidden relative group">
      {/* Camera Top HUD Header */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/75 backdrop-blur px-2 py-1 rounded border border-red-900/40 text-[10px] font-mono">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white font-bold">{feed.name}</span>
          <span className="text-neutral-400">| {feed.resolution}</span>
          <span className="text-emerald-400 font-bold">{feed.fps} FPS</span>
        </div>

        {feed.anomalyDetected && (
          <div className="flex items-center gap-1.5 bg-red-950/90 border border-red-500 text-red-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold animate-pulse">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>AI ANOMALY: {feed.anomalyLabel}</span>
          </div>
        )}
      </div>

      {/* Main Canvas Canvas Element */}
      <canvas
        ref={canvasRef}
        width={480}
        height={270}
        className="w-full h-auto block select-none"
      />

      {/* Live Military Time & Anonymization Badge (Bottom Left) */}
      <div className="absolute bottom-2 left-2 z-20 pointer-events-none flex items-center gap-2 text-[9px] font-mono bg-black/70 px-2 py-0.5 rounded border border-neutral-800 text-neutral-300">
        <span className="text-red-400">LIVE FEED</span>
        <span>FLOW: {feed.opticalFlowDirection}</span>
        <span className="text-emerald-400">GDPR ANONYMIZED</span>
      </div>

      {/* Bottom Interactive Filter Toolbar */}
      {showControls && (
        <div className="p-2 bg-[#090b10] border-t border-neutral-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowBoxes(!showBoxes)}
              className={`px-2 py-1 rounded text-[10px] transition-colors ${
                showBoxes ? 'bg-red-950 text-red-300 border border-red-800/60' : 'bg-neutral-900 text-neutral-500'
              }`}
            >
              <Eye className="w-3 h-3 inline mr-1" />
              B-BOXES
            </button>

            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-2 py-1 rounded text-[10px] transition-colors ${
                showHeatmap ? 'bg-amber-950 text-amber-300 border border-amber-800/60' : 'bg-neutral-900 text-neutral-500'
              }`}
            >
              <Flame className="w-3 h-3 inline mr-1" />
              HEATMAP
            </button>

            <button
              onClick={() => setShowFlowVectors(!showFlowVectors)}
              className={`px-2 py-1 rounded text-[10px] transition-colors ${
                showFlowVectors ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60' : 'bg-neutral-900 text-neutral-500'
              }`}
            >
              <Layers className="w-3 h-3 inline mr-1" />
              FLOW
            </button>

            <button
              onClick={() => setNightVision(!nightVision)}
              className={`px-2 py-1 rounded text-[10px] transition-colors ${
                nightVision ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'bg-neutral-900 text-neutral-500'
              }`}
            >
              <Radio className="w-3 h-3 inline mr-1" />
              FLIR
            </button>
          </div>

          <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
            <span>COUNT: <strong className="text-white">{feed.aiPedestrianCount}</strong></span>
            <span>VEL: <strong className="text-cyan-400">{feed.crowdVelocity} m/s</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
