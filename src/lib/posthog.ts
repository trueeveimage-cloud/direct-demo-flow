// Custom Analytics Implementation
// Stores events locally for admin dashboard analytics
// No external service integration - data stays client-side

const ANALYTICS_KEY = 'nomia_analytics'; // Local storage identifier

interface EventProperties {
  [key: string]: string | number | boolean | undefined | null;
}

interface UserProperties {
  email?: string;
  name?: string;
  [key: string]: string | number | boolean | undefined | null;
}

// Simple analytics tracker that works without PostHog SDK
// Stores events locally and syncs to our backend
class AnalyticsTracker {
  private sessionId: string;
  private userId: string | null = null;
  private utmParams: Record<string, string> = {};
  private events: Array<{
    event: string;
    properties: EventProperties;
    timestamp: string;
  }> = [];

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.captureUtmParams();
    this.trackPageView();
    
    // Track page views on route changes
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => this.trackPageView());
    }
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
        // Persist UTMs for the session
        sessionStorage.setItem(key, value);
      } else {
        // Try to get from session storage
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
    
    // Store for persistence
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nomia_user_id', userId);
    }
  }

  track(event: string, properties: EventProperties = {}): void {
    const eventData = {
      event,
      properties: {
        ...properties,
        ...this.utmParams,
        $session_id: this.sessionId,
        $current_url: typeof window !== 'undefined' ? window.location.href : '',
        $pathname: typeof window !== 'undefined' ? window.location.pathname : '',
        $referrer: typeof document !== 'undefined' ? document.referrer : '',
        $device_type: this.getDeviceType(),
        $screen_width: typeof window !== 'undefined' ? window.innerWidth : 0,
        $screen_height: typeof window !== 'undefined' ? window.innerHeight : 0,
        $user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        $timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    this.events.push(eventData);
    
    // Store events in localStorage for persistence
    this.persistEvents();
    
    // Also log for debugging
    console.log(`[Analytics] ${event}`, eventData.properties);
  }

  private trackPageView(): void {
    this.track('$pageview', {
      $title: typeof document !== 'undefined' ? document.title : '',
    });
  }

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown';
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private persistEvents(): void {
    if (typeof localStorage === 'undefined') return;
    
    // Get existing events
    const stored = localStorage.getItem('nomia_analytics_events');
    let allEvents = stored ? JSON.parse(stored) : [];
    
    // Add new events
    allEvents = [...allEvents, ...this.events];
    
    // Keep only last 1000 events to prevent storage overflow
    if (allEvents.length > 1000) {
      allEvents = allEvents.slice(-1000);
    }
    
    localStorage.setItem('nomia_analytics_events', JSON.stringify(allEvents));
    this.events = [];
  }

  // Get stored events for admin dashboard
  getStoredEvents(): Array<{
    event: string;
    properties: EventProperties;
    timestamp: string;
  }> {
    if (typeof localStorage === 'undefined') return [];
    
    const stored = localStorage.getItem('nomia_analytics_events');
    return stored ? JSON.parse(stored) : [];
  }

  // Clear stored events
  clearEvents(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('nomia_analytics_events');
    }
    this.events = [];
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
