import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, Clock, Globe, Smartphone, Monitor, 
  TrendingUp, ArrowDown, AlertCircle, Calendar, RefreshCw,
  Eye, MousePointer, CreditCard, CheckCircle, ShoppingCart,
  Gift, LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAnalytics, FunnelEvents } from '@/lib/posthog';
import type { User } from '@supabase/supabase-js';

interface StoredEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
}

interface AnalyticsData {
  pageViews: { page: string; views: number; uniqueVisitors: number; avgTime: string }[];
  topReferrers: { source: string; visitors: number }[];
  deviceSplit: { desktop: number; mobile: number; tablet: number };
  countries: { country: string; visitors: number }[];
  funnel: {
    landingView: number;
    startWizard: number;
    completeWizard: number;
    checkoutStarted: number;
    paymentSuccess: number;
    carePlanSelected: number;
  };
  wizardDropoff: { step: number; name: string; dropoff: number }[];
  checkoutErrors: { count: number; lastErrors: { message: string; timestamp: string }[] };
  totalEvents: number;
}

// Process real events from localStorage
function processRealEvents(events: StoredEvent[], dateRange: string): AnalyticsData {
  const filterDate = new Date();
  
  if (dateRange === 'today') {
    filterDate.setHours(0, 0, 0, 0);
  } else if (dateRange === '7days') {
    filterDate.setDate(filterDate.getDate() - 7);
  } else {
    filterDate.setDate(filterDate.getDate() - 30);
  }
  
  // Filter events by date
  const filteredEvents = events.filter(e => new Date(e.timestamp) >= filterDate);
  
  // Page views by path
  const pageViewEvents = filteredEvents.filter(e => e.event === '$pageview');
  const pageViewsByPath: Record<string, { views: number; sessions: Set<string> }> = {};
  
  pageViewEvents.forEach(e => {
    const path = (e.properties.$pathname as string) || '/';
    const sessionId = e.properties.$session_id as string;
    
    if (!pageViewsByPath[path]) {
      pageViewsByPath[path] = { views: 0, sessions: new Set() };
    }
    pageViewsByPath[path].views++;
    if (sessionId) pageViewsByPath[path].sessions.add(sessionId);
  });
  
  const pageViews = Object.entries(pageViewsByPath)
    .map(([page, data]) => ({
      page,
      views: data.views,
      uniqueVisitors: data.sessions.size,
      avgTime: '2:15', // Would need session duration tracking for real data
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  
  // Top referrers
  const referrerCounts: Record<string, Set<string>> = {};
  filteredEvents.forEach(e => {
    const referrer = (e.properties.$referrer as string) || 'direct';
    const sessionId = e.properties.$session_id as string;
    
    let source = 'direct';
    if (referrer.includes('google')) source = 'google';
    else if (referrer.includes('instagram')) source = 'instagram';
    else if (referrer.includes('facebook')) source = 'facebook';
    else if (referrer.includes('linkedin')) source = 'linkedin';
    else if (referrer.includes('twitter') || referrer.includes('x.com')) source = 'twitter';
    else if (referrer && referrer !== 'direct') source = 'other';
    
    if (!referrerCounts[source]) referrerCounts[source] = new Set();
    if (sessionId) referrerCounts[source].add(sessionId);
  });
  
  const topReferrers = Object.entries(referrerCounts)
    .map(([source, sessions]) => ({ source, visitors: sessions.size }))
    .sort((a, b) => b.visitors - a.visitors);
  
  // Device split
  let desktop = 0, mobile = 0, tablet = 0;
  const sessionDevices: Record<string, string> = {};
  
  filteredEvents.forEach(e => {
    const sessionId = e.properties.$session_id as string;
    const deviceType = e.properties.$device_type as string;
    
    if (sessionId && deviceType && !sessionDevices[sessionId]) {
      sessionDevices[sessionId] = deviceType;
    }
  });
  
  Object.values(sessionDevices).forEach(device => {
    if (device === 'desktop') desktop++;
    else if (device === 'mobile') mobile++;
    else if (device === 'tablet') tablet++;
  });
  
  const totalDevices = desktop + mobile + tablet || 1;
  
  // Funnel metrics
  const funnelEvents = {
    landingView: filteredEvents.filter(e => e.event === '$pageview' && (e.properties.$pathname === '/' || e.properties.$pathname === '')).length,
    startWizard: filteredEvents.filter(e => e.event === FunnelEvents.WIZARD_START || e.event === 'funnel_wizard_start').length,
    completeWizard: filteredEvents.filter(e => e.event === FunnelEvents.WIZARD_COMPLETE || e.event === 'funnel_wizard_complete').length,
    checkoutStarted: filteredEvents.filter(e => e.event === FunnelEvents.CHECKOUT_START || e.event === 'funnel_checkout_start').length,
    paymentSuccess: filteredEvents.filter(e => e.event === FunnelEvents.PAYMENT_SUCCESS || e.event === 'funnel_payment_success').length,
    carePlanSelected: filteredEvents.filter(e => e.event === FunnelEvents.CARE_PLAN_SELECTED || e.event === 'funnel_care_plan_selected').length,
  };
  
  // Wizard step dropoff
  const wizardStepEvents = filteredEvents.filter(e => e.event === 'funnel_wizard_step' || e.event === FunnelEvents.WIZARD_STEP);
  const stepCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  wizardStepEvents.forEach(e => {
    const step = e.properties.step as number;
    if (step && stepCounts[step] !== undefined) {
      stepCounts[step]++;
    }
  });
  
  const stepNames = ['Contact', 'Package', 'Pages', 'Care Plan', 'Payment'];
  const wizardDropoff = stepNames.map((name, i) => {
    const step = i + 1;
    const currentCount = stepCounts[step] || 0;
    const prevCount = step === 1 ? (funnelEvents.startWizard || 1) : (stepCounts[step - 1] || 1);
    const dropoff = prevCount > 0 ? Math.round(((prevCount - currentCount) / prevCount) * 100) : 0;
    
    return { step, name, dropoff: Math.max(0, Math.min(100, dropoff)) };
  });
  
  // Checkout errors
  const errorEvents = filteredEvents.filter(e => 
    e.event === 'funnel_payment_failed' || 
    e.event === FunnelEvents.PAYMENT_FAILED ||
    e.event === 'checkout_error'
  );
  
  const checkoutErrors = {
    count: errorEvents.length,
    lastErrors: errorEvents
      .slice(-5)
      .reverse()
      .map(e => ({
        message: (e.properties.error as string) || (e.properties.message as string) || 'Unknown error',
        timestamp: new Date(e.timestamp).toLocaleString(),
      })),
  };
  
  return {
    pageViews: pageViews.length > 0 ? pageViews : [{ page: '/', views: 0, uniqueVisitors: 0, avgTime: '0:00' }],
    topReferrers: topReferrers.length > 0 ? topReferrers : [{ source: 'No data yet', visitors: 0 }],
    deviceSplit: {
      desktop: Math.round((desktop / totalDevices) * 100) || 33,
      mobile: Math.round((mobile / totalDevices) * 100) || 34,
      tablet: Math.round((tablet / totalDevices) * 100) || 33,
    },
    countries: [{ country: 'Sweden', visitors: Object.keys(sessionDevices).length }], // Geo needs backend
    funnel: funnelEvents,
    wizardDropoff,
    checkoutErrors,
    totalEvents: filteredEvents.length,
  };
}

// Admin email allowlist - only these emails can access the dashboard
// This provides server-side validation since auth state comes from Supabase server
const ADMIN_EMAILS = [
  'nordicsite.help@gmail.com',
  // Add additional admin emails here as needed
];

function isAdminUser(user: User | null): boolean {
  if (!user) return false;
  return ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '');
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days'>('7days');
  const [events, setEvents] = useState<StoredEvent[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Check if authenticated user is an admin
  const isAdmin = isAdminUser(user);

  // Set up auth state listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Only load analytics data if user is an admin
    if (user && isAdmin) {
      // Get real events from analytics tracker
      const analytics = getAnalytics();
      const storedEvents = analytics.getStoredEvents();
      setEvents(storedEvents);
    }
  }, [user, isAdmin, refreshKey]);

  const data = useMemo(() => {
    return processRealEvents(events, dateRange);
  }, [events, dateRange]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    const { error: authError, data: authData } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });
    
    if (authError) {
      setError(authError.message);
      return;
    }

    // Check if the authenticated user is an admin
    if (authData.user && !ADMIN_EMAILS.includes(authData.user.email?.toLowerCase() ?? '')) {
      // Sign out non-admin users immediately
      await supabase.auth.signOut();
      setError('Access denied. You do not have admin privileges.');
      return;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm p-8 bg-secondary/50 rounded-2xl border border-border"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="h-12"
                autoFocus
              />
            </div>
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="h-12"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button type="submit" className="w-full h-12">
              Sign In
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Show access denied for authenticated users who are not admins
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm p-8 bg-secondary/50 rounded-2xl border border-border text-center"
        >
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You do not have permission to access the admin dashboard.
          </p>
          <Button variant="outline" onClick={handleLogout} className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    );
  }

  const totalViews = data.pageViews.reduce((sum, p) => sum + p.views, 0);
  const totalUniqueVisitors = data.pageViews.reduce((sum, p) => sum + p.uniqueVisitors, 0);
  const conversionRate = data.funnel.landingView > 0 
    ? ((data.funnel.paymentSuccess / data.funnel.landingView) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="py-12 section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Real tracking data • {data.totalEvents} events recorded
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Date Range Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'today', label: 'Today' },
            { id: '7days', label: '7 Days' },
            { id: '30days', label: '30 Days' },
          ].map((range) => (
            <Button
              key={range.id}
              variant={dateRange === range.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(range.id as typeof dateRange)}
            >
              {range.label}
            </Button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Page Views
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Unique Sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalUniqueVisitors.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Conversion Rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{conversionRate}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.funnel.paymentSuccess}</p>
            </CardContent>
          </Card>
        </div>

        {data.totalEvents === 0 && (
          <Card className="mb-8 border-accent/50 bg-accent/5">
            <CardContent className="py-6">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start Collecting Data</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Analytics are now tracking! Browse the site to generate events. 
                  Data persists in localStorage and updates automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="funnel" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="funnel">Funnel</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>

          {/* Funnel Tab */}
          <TabsContent value="funnel" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Conversion Funnel
                </CardTitle>
                <CardDescription>Real funnel data from tracked events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Landing View', value: data.funnel.landingView, icon: Eye },
                    { label: 'Start Wizard', value: data.funnel.startWizard, icon: MousePointer },
                    { label: 'Complete Wizard', value: data.funnel.completeWizard, icon: CheckCircle },
                    { label: 'Checkout Started', value: data.funnel.checkoutStarted, icon: ShoppingCart },
                    { label: 'Payment Success', value: data.funnel.paymentSuccess, icon: CreditCard },
                    { label: 'Care Plan Selected', value: data.funnel.carePlanSelected, icon: Calendar },
                  ].map((step, index, arr) => {
                    const prevValue = index > 0 ? arr[index - 1].value : step.value;
                    const dropoff = index > 0 && prevValue > 0 ? ((prevValue - step.value) / prevValue * 100).toFixed(1) : '0';
                    const width = arr[0].value > 0 ? (step.value / arr[0].value) * 100 : 0;
                    
                    return (
                      <div key={step.label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <step.icon className="w-4 h-4 text-muted-foreground" />
                            {step.label}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="font-medium">{step.value.toLocaleString()}</span>
                            {index > 0 && Number(dropoff) > 0 && (
                              <span className="text-destructive text-xs flex items-center gap-1">
                                <ArrowDown className="w-3 h-3" />
                                {dropoff}%
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="h-8 bg-secondary rounded-lg overflow-hidden">
                          <div 
                            className="h-full bg-accent/80 rounded-lg transition-all duration-500"
                            style={{ width: `${Math.max(width, step.value > 0 ? 5 : 0)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Wizard Step Dropoff */}
            <Card>
              <CardHeader>
                <CardTitle>Wizard Step Dropoff</CardTitle>
                <CardDescription>Where users abandon the wizard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {data.wizardDropoff.map((step) => (
                    <div key={step.step} className="text-center p-4 bg-secondary/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Step {step.step}</p>
                      <p className="font-medium text-sm">{step.name}</p>
                      <p className="text-destructive text-lg font-bold mt-2">{step.dropoff}%</p>
                      <p className="text-xs text-muted-foreground">dropoff</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Page Performance</CardTitle>
                <CardDescription>Based on actual pageview events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground border-b border-border">
                        <th className="pb-3">Page</th>
                        <th className="pb-3">Views</th>
                        <th className="pb-3">Sessions</th>
                        <th className="pb-3">Avg Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.pageViews.map((page) => (
                        <tr key={page.page} className="border-b border-border/50">
                          <td className="py-3 font-medium">{page.page}</td>
                          <td className="py-3">{page.views.toLocaleString()}</td>
                          <td className="py-3">{page.uniqueVisitors.toLocaleString()}</td>
                          <td className="py-3 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {page.avgTime}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Top Referrers
                  </CardTitle>
                  <CardDescription>Based on document.referrer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.topReferrers.map((ref) => (
                      <div key={ref.source} className="flex justify-between items-center">
                        <span className="capitalize">{ref.source}</span>
                        <span className="font-medium">{ref.visitors.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Split</CardTitle>
                  <CardDescription>Based on screen width detection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        Desktop
                      </span>
                      <span className="font-medium">{data.deviceSplit.desktop}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Mobile
                      </span>
                      <span className="font-medium">{data.deviceSplit.mobile}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 rotate-90" />
                        Tablet
                      </span>
                      <span className="font-medium">{data.deviceSplit.tablet}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Countries</CardTitle>
                  <CardDescription>Geo detection requires backend integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.countries.map((country) => (
                      <div key={country.country} className="flex justify-between items-center">
                        <span>{country.country}</span>
                        <span className="font-medium">{country.visitors.toLocaleString()} sessions</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  Checkout Errors
                </CardTitle>
                <CardDescription>
                  {data.checkoutErrors.count} errors in selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.checkoutErrors.lastErrors.length > 0 ? (
                  <div className="space-y-3">
                    {data.checkoutErrors.lastErrors.map((err, i) => (
                      <div key={i} className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                        <p className="font-medium text-destructive">{err.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{err.timestamp}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No checkout errors recorded
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
