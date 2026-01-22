// Custom Analytics Implementation
// Stores events in Supabase database for admin dashboard analytics

import { supabase } from '@/integrations/supabase/client';

interface EventProperties {
  [key: string]: string | number | boolean | undefined | null;
}

interface UserProperties {
  email?: string;
  name?: string;
  [key: string]: string | number | boolean | undefined | null;
}

// Analytics tracker that stores events in Supabase
class AnalyticsTracker {
  private sessionId: string;
  private userId: string | null = null;
  private utmParams: Record<string, string> = {};
  private pendingEvents: Array<{
    event: string;
    properties: EventProperties;
    timestamp: string;
  }> = [];
  private isFlushingEvents = false;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.captureUtmParams();
    this.trackPageView();
    
    // Track page views on route changes (popstate for browser nav)
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => this.trackPageView());
      
      // Also intercept history.pushState for React Router navigation
      const originalPushState = history.pushState.bind(history);
      history.pushState = (...args) => {
        originalPushState(...args);
        // Small delay to ensure the URL has changed
        setTimeout(() => this.trackPageView(), 50);
      };
      
      const originalReplaceState = history.replaceState.bind(history);
      history.replaceState = (...args) => {
        originalReplaceState(...args);
        setTimeout(() => this.trackPageView(), 50);
      };
    }
    
    // Flush events periodically
    setInterval(() => this.flushEvents(), 5000);
  }

  private getOrCreateSessionId(): string {
    const key = 'nomia_session_id';
    let sessionId = sessionStorage.getItem(key);
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(key, sessionId);
    }
    return sessionId;
  }

  private captureUtmParams(): void {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    
    utmKeys.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        this.utmParams[key] = value;
        sessionStorage.setItem(key, value);
      } else {
        const stored = sessionStorage.getItem(key);
        if (stored) {
          this.utmParams[key] = stored;
        }
      }
    });
  }

  getUtmParams(): Record<string, string> {
    return { ...this.utmParams };
  }

  identify(userId: string, properties?: UserProperties): void {
    this.userId = userId;
    this.track('$identify', { 
      distinct_id: userId,
      ...properties 
    });
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nomia_user_id', userId);
    }
  }

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown';
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  track(event: string, properties: EventProperties = {}): void {
    const eventData = {
      event,
      properties: {
        ...properties,
        ...this.utmParams,
        session_id: this.sessionId,
        path: typeof window !== 'undefined' ? window.location.pathname : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        device_type: this.getDeviceType(),
        screen_width: typeof window !== 'undefined' ? window.innerWidth : 0,
        screen_height: typeof window !== 'undefined' ? window.innerHeight : 0,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      },
      timestamp: new Date().toISOString(),
    };

    this.pendingEvents.push(eventData);
    
    // Also persist to localStorage as backup
    this.persistToLocalStorage(eventData);
    
    // Try to flush immediately for important events
    if (event.startsWith('funnel_') || event === '$pageview') {
      this.flushEvents();
    }
  }

  private persistToLocalStorage(eventData: { event: string; properties: EventProperties; timestamp: string }): void {
    if (typeof localStorage === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('nomia_analytics_events');
      let allEvents = stored ? JSON.parse(stored) : [];
      allEvents.push(eventData);
      
      if (allEvents.length > 500) {
        allEvents = allEvents.slice(-500);
      }
      
      localStorage.setItem('nomia_analytics_events', JSON.stringify(allEvents));
    } catch (e) {
      console.error('[Analytics] Failed to persist to localStorage:', e);
    }
  }

  private async flushEvents(): Promise<void> {
    if (this.isFlushingEvents || this.pendingEvents.length === 0) return;
    
    this.isFlushingEvents = true;
    const eventsToFlush = [...this.pendingEvents];
    this.pendingEvents = [];
    
    try {
      // Insert events to Supabase
      const insertData = eventsToFlush.map(e => ({
        event_name: e.event,
        session_id: e.properties.session_id as string,
        page_path: e.properties.path as string || null,
        referrer: e.properties.referrer as string || null,
        device_type: e.properties.device_type as string || null,
        screen_width: e.properties.screen_width as number || null,
        screen_height: e.properties.screen_height as number || null,
        user_agent: e.properties.user_agent as string || null,
        utm_source: e.properties.utm_source as string || null,
        utm_medium: e.properties.utm_medium as string || null,
        utm_campaign: e.properties.utm_campaign as string || null,
        properties: e.properties,
      }));
      
      const { error } = await supabase
        .from('analytics_events')
        .insert(insertData);
      
      if (error) {
        console.error('[Analytics] Failed to insert events:', error);
        // Put events back in queue
        this.pendingEvents = [...eventsToFlush, ...this.pendingEvents];
      }
    } catch (err) {
      console.error('[Analytics] Flush error:', err);
      // Put events back in queue
      this.pendingEvents = [...eventsToFlush, ...this.pendingEvents];
    } finally {
      this.isFlushingEvents = false;
    }
  }

  private trackPageView(): void {
    this.track('$pageview', {
      title: typeof document !== 'undefined' ? document.title : '',
    });
  }

  // Get stored events from localStorage (for backwards compatibility)
  getStoredEvents(): Array<{
    event: string;
    properties: EventProperties;
    timestamp: string;
  }> {
    if (typeof localStorage === 'undefined') return [];
    
    const stored = localStorage.getItem('nomia_analytics_events');
    return stored ? JSON.parse(stored) : [];
  }

  clearEvents(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('nomia_analytics_events');
    }
    this.pendingEvents = [];
  }
}

// Singleton instance
let analyticsInstance: AnalyticsTracker | null = null;

export function getAnalytics(): AnalyticsTracker {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsTracker();
  }
  return analyticsInstance;
}

// Convenience methods
export function trackEvent(event: string, properties: EventProperties = {}): void {
  getAnalytics().track(event, properties);
}

export function identifyUser(userId: string, properties?: UserProperties): void {
  getAnalytics().identify(userId, properties);
}

export function getUtmParams(): Record<string, string> {
  return getAnalytics().getUtmParams();
}

// Specific funnel events
export const FunnelEvents = {
  LANDING_VIEW: 'funnel_landing_view',
  WIZARD_START: 'funnel_wizard_start',
  WIZARD_STEP: 'funnel_wizard_step',
  WIZARD_COMPLETE: 'funnel_wizard_complete',
  CHECKOUT_START: 'funnel_checkout_start',
  CHECKOUT_COMPLETE: 'funnel_checkout_complete',
  PAYMENT_SUCCESS: 'funnel_payment_success',
  PAYMENT_FAILED: 'funnel_payment_failed',
  CARE_PLAN_SELECTED: 'funnel_care_plan_selected',
  DEMO_REQUEST: 'funnel_demo_request',
  CONCEPT_APPROVAL: 'funnel_concept_approval',
} as const;

export function trackFunnelEvent(event: keyof typeof FunnelEvents, properties: EventProperties = {}): void {
  trackEvent(FunnelEvents[event], {
    ...properties,
    funnel_step: event,
  });
}