import { motion } from 'framer-motion';

export function WizardBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.3) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.25) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-1/4 w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.2) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10,
        }}
      />

      {/* Subtle noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
}
