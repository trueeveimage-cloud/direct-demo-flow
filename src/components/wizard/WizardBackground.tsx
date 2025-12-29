import { memo } from 'react';

// Static background - no animations for performance
export const WizardBackground = memo(function WizardBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Static gradient blobs - no animations */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.25) 0%, transparent 70%)',
        }}
      />
      
      <div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.2) 0%, transparent 70%)',
        }}
      />
      
      <div
        className="absolute bottom-20 left-1/4 w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
});
