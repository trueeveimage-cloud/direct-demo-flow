import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  /** Radius in pixels within which the magnetic effect works */
  radius?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  strength = 0.3,
  radius = 100,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    if (distance < radius) {
      // Calculate magnetic pull based on distance (stronger when closer)
      const pull = 1 - (distance / radius);
      setPosition({
        x: distanceX * strength * pull,
        y: distanceY * strength * pull,
      });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
};

// Wrapper for applying magnetic effect to any element
export const MagneticWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  strength?: number;
}> = ({ children, className, strength = 0.4 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // 3D tilt effect
    const rotateX = (distanceY / rect.height) * 10;
    const rotateY = (distanceX / rect.width) * -10;
    
    setTransform({
      x: distanceX * strength * 0.3,
      y: distanceY * strength * 0.3,
      rotateX,
      rotateY,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: transform.x,
        y: transform.y,
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={cn("inline-block", className)}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
};
