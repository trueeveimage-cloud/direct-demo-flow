import { useState, useEffect } from 'react';

function calculateRemainingSpots(): number {
  const MAX_SPOTS = 4;
  const MIN_SPOTS = 1;
  const CYCLE_DAYS = 4; // 4 days for full cycle (4,3,2,1 then reset to 4)
  
  // Fixed reference point
  const EPOCH = new Date('2024-01-01T00:00:00Z').getTime();
  
  const now = Date.now();
  const daysSinceEpoch = Math.floor((now - EPOCH) / (1000 * 60 * 60 * 24));
  const daysInCurrentCycle = daysSinceEpoch % CYCLE_DAYS;
  
  // Spots go: 4, 3, 2, 1, then back to 4
  const spots = MAX_SPOTS - daysInCurrentCycle;
  
  return Math.max(spots, MIN_SPOTS);
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
