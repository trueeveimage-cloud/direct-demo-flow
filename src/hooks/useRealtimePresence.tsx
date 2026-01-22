import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PresenceState {
  user_id: string;
  page: string;
  online_at: string;
  device_type: string;
}

export function useRealtimePresence(isAdmin: boolean = false) {
  const [activeVisitors, setActiveVisitors] = useState<PresenceState[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const channel = supabase.channel('site_presence', {
      config: {
        presence: {
          key: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        },
      },
    });

    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const visitors: PresenceState[] = [];
        
        Object.values(state).forEach((presences) => {
          if (Array.isArray(presences)) {
            presences.forEach((p) => {
              if (p && typeof p === 'object') {
                visitors.push(p as unknown as PresenceState);
              }
            });
          }
        });
        
        setActiveVisitors(visitors);
        setVisitorCount(visitors.length);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('[Presence] User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('[Presence] User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && !isAdmin) {
          // Track current visitor (non-admins only)
          const deviceType = window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';
          
          await channel.track({
            user_id: sessionStorage.getItem('nomia_session_id') || 'anonymous',
            page: window.location.pathname,
            online_at: new Date().toISOString(),
            device_type: deviceType,
          });
        }
      });

    // Update page on route change
    const handleRouteChange = async () => {
      if (channelRef.current && !isAdmin) {
        const deviceType = window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';
        await channelRef.current.track({
          user_id: sessionStorage.getItem('nomia_session_id') || 'anonymous',
          page: window.location.pathname,
          online_at: new Date().toISOString(),
          device_type: deviceType,
        });
      }
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [isAdmin]);

  // Get breakdown by page
  const visitorsByPage = activeVisitors.reduce((acc, v) => {
    acc[v.page] = (acc[v.page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get breakdown by device
  const visitorsByDevice = activeVisitors.reduce((acc, v) => {
    acc[v.device_type] = (acc[v.device_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    visitorCount,
    activeVisitors,
    visitorsByPage,
    visitorsByDevice,
  };
}
