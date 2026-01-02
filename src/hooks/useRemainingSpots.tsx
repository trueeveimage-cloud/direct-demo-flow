import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRemainingSpots() {
  const [remainingSpots, setRemainingSpots] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRemainingSpots = async () => {
      try {
        const { data, error } = await supabase.rpc('get_remaining_spots');
        
        if (error) {
          console.error('Error fetching remaining spots:', error);
          return;
        }
        
        setRemainingSpots(data ?? 10);
      } catch (err) {
        console.error('Error fetching remaining spots:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRemainingSpots();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('concept_requests_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'concept_requests'
        },
        () => {
          // Refetch when a new request is added
          fetchRemainingSpots();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { remainingSpots, isLoading };
}

export async function recordConceptRequest(email: string, businessName: string) {
  const { error } = await supabase
    .from('concept_requests')
    .insert({ email, business_name: businessName });
  
  if (error) {
    console.error('Error recording concept request:', error);
  }
  
  return { error };
}
