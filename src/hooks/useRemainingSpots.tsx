import { useState, useEffect } from 'react';

function calculateRemainingSpots(): number {
  const MAX_SPOTS = 4;
  const INTERVAL_HOURS = 12;
  const CYCLE_HOURS = (MAX_SPOTS + 1) * INTERVAL_HOURS; // 60 hours for full cycle (4,3,2,1,0 then reset)
  
  // Fixed reference point
  const EPOCH = new Date('2024-01-01T00:00:00Z').getTime();
  
  const now = Date.now();
  const hoursSinceEpoch = (now - EPOCH) / (1000 * 60 * 60);
  const hoursInCurrentCycle = hoursSinceEpoch % CYCLE_HOURS;
  const periodsElapsed = Math.floor(hoursInCurrentCycle / INTERVAL_HOURS);
  
  return MAX_SPOTS - periodsElapsed;
}

export function useRemainingSpots() {
  const [remainingSpots, setRemainingSpots] = useState<number>(() => calculateRemainingSpots());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Update every minute to keep it fresh
    const interval = setInterval(() => {
      setRemainingSpots(calculateRemainingSpots());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { remainingSpots, isLoading };
}

export async function recordConceptRequest(email: string, businessName: string) {
  // No longer tracking in database - just a no-op for compatibility
  console.log('Concept request:', email, businessName);
  return { error: null };
}
