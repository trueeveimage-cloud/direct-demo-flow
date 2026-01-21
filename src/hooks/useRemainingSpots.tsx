import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SpotsConfig {
  max_spots: number;
  current_spots: number;
  last_reset_at: string;
}

export function useRemainingSpots() {
  const [remainingSpots, setRemainingSpots] = useState<number>(4);
  const [maxSpots, setMaxSpots] = useState<number>(7);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSpots = async () => {
    try {
      const { data, error } = await supabase
        .from('spots_config')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching spots config:', error);
        // Fallback to client-side calculation
        setRemainingSpots(calculateFallbackSpots());
        setIsLoading(false);
        return;
      }

      if (data) {
        const config = data as SpotsConfig;
        setMaxSpots(config.max_spots);
        
        // Check if 24 hours have passed since last reset
        const lastReset = new Date(config.last_reset_at);
        const now = new Date();
        const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
        const daysSinceReset = Math.floor(hoursSinceReset / 24);
        
        // Calculate spots based on days passed (drop 1 per 24 hours)
        let currentSpots = config.current_spots - daysSinceReset;
        currentSpots = Math.max(1, Math.min(currentSpots, config.max_spots));
        
        setRemainingSpots(currentSpots);
      }
    } catch (err) {
      console.error('Error:', err);
      setRemainingSpots(calculateFallbackSpots());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();

    // Update every minute to keep it fresh
    const interval = setInterval(fetchSpots, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { remainingSpots, maxSpots, isLoading, refetch: fetchSpots };
}

// Fallback calculation if database is unavailable
function calculateFallbackSpots(): number {
  const MAX_SPOTS = 7;
  const MIN_SPOTS = 1;
  const CYCLE_DAYS = 7; // 7 days for full cycle
  
  // Fixed reference point
  const EPOCH = new Date('2024-01-01T00:00:00Z').getTime();
  
  const now = Date.now();
  const daysSinceEpoch = Math.floor((now - EPOCH) / (1000 * 60 * 60 * 24));
  const daysInCurrentCycle = daysSinceEpoch % CYCLE_DAYS;
  
  // Spots drop by 1 every 24 hours
  const spots = MAX_SPOTS - daysInCurrentCycle;
  
  return Math.max(spots, MIN_SPOTS);
}

export async function recordConceptRequest(email: string, businessName: string) {
  // No longer tracking in database - just a no-op for compatibility
  console.log('Concept request:', email, businessName);
  return { error: null };
}

// Admin function to update spots
export async function updateSpotsConfig(currentSpots: number, maxSpots?: number) {
  const updates: Record<string, unknown> = {
    current_spots: currentSpots,
    last_reset_at: new Date().toISOString(),
  };
  
  if (maxSpots !== undefined) {
    updates.max_spots = maxSpots;
  }

  const { error } = await supabase
    .from('spots_config')
    .update(updates)
    .eq('id', (await supabase.from('spots_config').select('id').single()).data?.id);

  return { error };
}
