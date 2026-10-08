import React, { ReactNode } from 'react';

interface TacticalCardProps {
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  glow?: boolean;
  action?: ReactNode;
}

export const TacticalCard: React.FC<TacticalCardProps> = ({
  title,
  subtitle,
  badge,
  children,
  className = '',
  glow = false,
  action
}) => {
  return (
    <div
      className={`hud-panel rounded-sm relative overflow-hidden transition-all duration-300 ${
        glow ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-red-900/30'
      } ${className}`}
    >
      {(title || subtitle || badge || action) && (
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-red-900/25 bg-red-950/15">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_6px_#ef4444]" />
            <div>
              {title && (
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200 font-hud flex items-center gap-2">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[10px] text-neutral-400 font-mono tracking-tight">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {badge}
            {action}
          </div>
        </div>
      )}
      <div className="p-3.5 relative z-10">{children}</div>
    </div>
  );
};
