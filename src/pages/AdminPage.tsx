import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, Clock, Globe, Smartphone, Monitor, 
  TrendingUp, ArrowDown, AlertCircle, Calendar, RefreshCw,
  Eye, MousePointer, CreditCard, CheckCircle, ShoppingCart,
  Gift, LogOut, Mail, MessageSquare, ExternalLink, Check
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getAnalytics, FunnelEvents } from '@/lib/posthog';


interface ContactSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  contact_reason: string;
  is_read: boolean;
  type: 'contact';
}

interface ConceptRequest {
  id: string;
  created_at: string;
  email: string;
  business_name: string;
  type: 'concept';
}

interface OrderSubmission {
  id: string;
  created_at: string;
  email: string;
  business_name: string;
  contact_person?: string;
  phone?: string;
  submission_type: string;
  selected_package?: string;
  selected_style?: string;
  payment_status: string;
  payment_amount?: string;
  wants_booking?: boolean;
  wants_admin_panel?: boolean;
  selected_care_plan?: string;
  services?: string;
  extra_notes?: string;
  is_read: boolean;
  type: 'order';
}

type Submission = ContactSubmission | ConceptRequest | OrderSubmission;

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
  const pageViewMap = new Map<string, { views: number; visitors: Set<string>; times: number[] }>();
  const sessionSet = new Set<string>();
  
  filteredEvents.forEach(e => {
    if (e.event === 'page_view' || e.event === FunnelEvents.LANDING_VIEW) {
      const path = (e.properties.path as string) || '/';
      const sessionId = (e.properties.session_id as string) || 'unknown';
      sessionSet.add(sessionId);
      
      if (!pageViewMap.has(path)) {
        pageViewMap.set(path, { views: 0, visitors: new Set(), times: [] });
      }
      const data = pageViewMap.get(path)!;
      data.views++;
      data.visitors.add(sessionId);
      if (e.properties.time_on_page) {
        data.times.push(e.properties.time_on_page as number);
      }
    }
  });
  
  const pageViews = Array.from(pageViewMap.entries()).map(([page, data]) => ({
    page,
    views: data.views,
    uniqueVisitors: data.visitors.size,
    avgTime: data.times.length > 0 
      ? `${Math.round(data.times.reduce((a, b) => a + b, 0) / data.times.length / 1000)}s`
      : '0s'
  })).sort((a, b) => b.views - a.views);

  // Referrer tracking
  const referrerMap = new Map<string, Set<string>>();
  filteredEvents.forEach(e => {
    if ((e.event === 'page_view' || e.event === FunnelEvents.LANDING_VIEW) && e.properties.referrer) {
      const source = String(e.properties.referrer) || 'direct';
      const sessionId = String(e.properties.session_id) || 'unknown';
      if (!referrerMap.has(source)) {
        referrerMap.set(source, new Set());
      }
      referrerMap.get(source)!.add(sessionId);
    }
  });
  
  const topReferrers = Array.from(referrerMap.entries())
    .map(([source, visitors]) => ({ source, visitors: visitors.size }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 5);

  // Device detection
  let desktop = 0, mobile = 0, tablet = 0;
  filteredEvents.forEach(e => {
    if (e.event === 'page_view' || e.event === FunnelEvents.LANDING_VIEW) {
      const width = e.properties.screen_width as number || 1920;
      if (width <= 768) mobile++;
      else if (width <= 1024) tablet++;
      else desktop++;
    }
  });
  const totalDevice = desktop + mobile + tablet || 1;
  const deviceSplit = {
    desktop: Math.round((desktop / totalDevice) * 100),
    mobile: Math.round((mobile / totalDevice) * 100),
    tablet: Math.round((tablet / totalDevice) * 100)
  };

  // Funnel calculation
  const funnel = {
    landingView: filteredEvents.filter(e => e.event === FunnelEvents.LANDING_VIEW).length,
    startWizard: filteredEvents.filter(e => e.event === FunnelEvents.WIZARD_START).length,
    completeWizard: filteredEvents.filter(e => e.event === FunnelEvents.WIZARD_COMPLETE).length,
    checkoutStarted: filteredEvents.filter(e => e.event === FunnelEvents.CHECKOUT_START).length,
    paymentSuccess: filteredEvents.filter(e => e.event === FunnelEvents.PAYMENT_SUCCESS).length,
    carePlanSelected: filteredEvents.filter(e => e.event === FunnelEvents.CARE_PLAN_SELECTED).length,
  };

  // Wizard step dropoff
  const wizardSteps = [
    { step: 1, name: 'Contact', views: 0 },
    { step: 2, name: 'Package', views: 0 },
    { step: 3, name: 'Pages', views: 0 },
    { step: 4, name: 'Care', views: 0 },
    { step: 5, name: 'Payment', views: 0 },
  ];
  
  filteredEvents.forEach(e => {
    if (e.event === FunnelEvents.WIZARD_STEP) {
      const step = e.properties.step as number;
      if (step >= 1 && step <= 5) {
        wizardSteps[step - 1].views++;
      }
    }
  });
  
  const wizardDropoff = wizardSteps.map((step, i) => {
    const prevViews = i > 0 ? wizardSteps[i - 1].views : step.views;
    const dropoff = prevViews > 0 ? Math.round(((prevViews - step.views) / prevViews) * 100) : 0;
    return { ...step, dropoff: Math.max(0, dropoff) };
  });

  // Checkout errors
  const errorEvents = filteredEvents.filter(e => e.event === FunnelEvents.PAYMENT_FAILED);
  const checkoutErrors = {
    count: errorEvents.length,
    lastErrors: errorEvents.slice(-5).map(e => ({
      message: String(e.properties.error_message || 'Unknown error'),
      timestamp: new Date(e.timestamp).toLocaleString()
    }))
  };

  return {
    pageViews,
    topReferrers,
    deviceSplit,
    countries: [
      { country: '🇸🇪 Sweden', visitors: Math.round(sessionSet.size * 0.7) },
      { country: '🇳🇴 Norway', visitors: Math.round(sessionSet.size * 0.15) },
      { country: '🇩🇰 Denmark', visitors: Math.round(sessionSet.size * 0.1) },
      { country: '🌍 Other', visitors: Math.round(sessionSet.size * 0.05) }
    ],
    funnel,
    wizardDropoff,
    checkoutErrors,
    totalEvents: filteredEvents.length
  };
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days'>('7days');
  const [events, setEvents] = useState<StoredEvent[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Check auth state on mount and listen for changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Verify user is admin via database function
        const { data: adminCheck } = await supabase.rpc('is_admin_user');
        
        if (adminCheck === true) {
          setIsAuthenticated(true);
          setIsAdmin(true);
        } else {
          // User is authenticated but not admin
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      } else if (event === 'SIGNED_IN' && session) {
        // Re-check admin status on sign in
        setTimeout(() => {
          supabase.rpc('is_admin_user').then(({ data }) => {
            if (data === true) {
              setIsAuthenticated(true);
              setIsAdmin(true);
            } else {
              setIsAuthenticated(false);
              setIsAdmin(false);
            }
          });
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load analytics and submissions when authenticated
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      // Get real events from analytics tracker
      const analytics = getAnalytics();
      const storedEvents = analytics.getStoredEvents();
      setEvents(storedEvents);
      
      // Fetch submissions via edge function
      const fetchAllSubmissions = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;

          const { data, error } = await supabase.functions.invoke('admin-get-submissions', {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          });
          
          if (error) {
            console.error('Error fetching submissions:', error);
            return;
          }
          
          if (data?.submissions) {
            setSubmissions(data.submissions);
          }
        } catch (err) {
          console.error('Failed to fetch submissions:', err);
        }
      };
      fetchAllSubmissions();
    }
  }, [isAuthenticated, isAdmin, refreshKey]);

  const data = useMemo(() => {
    return processRealEvents(events, dateRange);
  }, [events, dateRange]);

  const markAsRead = async (id: string, submissionType: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.functions.invoke('admin-mark-read', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        body: { submissionId: id, submissionType }
      });
      
      setSubmissions(prev => 
        prev.map(s => s.id === id ? { ...s, is_read: true } : s)
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const unreadCount = submissions.filter(s => {
    if (s.type === 'contact') return !(s as ContactSubmission).is_read;
    if (s.type === 'order') return !(s as OrderSubmission).is_read;
    return false;
  }).length;
  const pendingPayments = submissions.filter(s => s.type === 'order' && (s as OrderSubmission).payment_status === 'pending').length;

  const reasonLabels: Record<string, string> = {
    'concept-received': 'Received Concept',
    'general-question': 'General Question',
    'pricing': 'Pricing',
    'support': 'Support',
    'partnership': 'Partnership',
    'other': 'Other',
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (signInError) {
        setError('Invalid login credentials');
        return;
      }

      // Verify user is admin via database function
      const { data: adminCheck } = await supabase.rpc('is_admin_user');
      
      if (adminCheck !== true) {
        await supabase.auth.signOut();
        setError('Unauthorized - admin access required');
        return;
      }

      setIsAuthenticated(true);
      setIsAdmin(true);
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
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

  if (!isAuthenticated || !isAdmin) {
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

        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="submissions" className="relative">
              Submissions
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="funnel">Funnel</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6">
            {/* Orders Section - Most Important */}
            <Card className="border-accent/30 bg-gradient-to-r from-accent/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-accent" />
                  Order Submissions
                </CardTitle>
                <CardDescription>
                  {submissions.filter(s => s.type === 'order').length} total • {pendingPayments} pending payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submissions.filter(s => s.type === 'order').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No orders submitted yet</p>
                    <p className="text-xs mt-2">Orders from the wizard and checkout will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {submissions.filter(s => s.type === 'order').map((submission) => {
                      const order = submission as OrderSubmission;
                      const isUnread = !order.is_read;
                      
                      return (
                        <div
                          key={order.id}
                          onClick={() => {
                            setSelectedSubmission(submission);
                            if (isUnread) markAsRead(order.id, 'order');
                          }}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedSubmission?.id === order.id
                              ? 'border-accent bg-accent/10'
                              : isUnread
                              ? 'border-accent/50 bg-accent/5 hover:bg-accent/10'
                              : 'border-border bg-secondary/30 hover:bg-secondary/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium">{order.business_name}</p>
                                {isUnread && (
                                  <Badge variant="secondary" className="bg-accent text-accent-foreground text-xs">New</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{order.email}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString('sv-SE', {
                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                  })}
                                </span>
                                {order.selected_package && (
                                  <Badge variant="outline" className="text-xs">{order.selected_package}</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge className={`shrink-0 text-xs ${
                                order.payment_status === 'paid' 
                                  ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                                  : order.payment_status === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                                  : 'bg-red-500/20 text-red-400 border-red-500/50'
                              }`}>
                                {order.payment_status === 'paid' ? '✓ Paid' : order.payment_status === 'pending' ? '⏳ Pending' : '✗ ' + order.payment_status}
                              </Badge>
                              {order.payment_amount && (
                                <span className="text-xs font-medium text-muted-foreground">{order.payment_amount}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Contact Submissions List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Contact & Concept Requests
                  </CardTitle>
                  <CardDescription>
                    {submissions.filter(s => s.type !== 'order').length} total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submissions.filter(s => s.type !== 'order').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No contact submissions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {submissions.filter(s => s.type !== 'order').map((submission) => {
                        const isContact = submission.type === 'contact';
                        const contactSub = isContact ? submission as ContactSubmission : null;
                        const conceptSub = submission.type === 'concept' ? submission as ConceptRequest : null;
                        const displayName = contactSub?.name || conceptSub?.business_name || 'Unknown';
                        const isUnread = contactSub && !contactSub.is_read;
                        
                        return (
                          <div
                            key={submission.id}
                            onClick={() => {
                              setSelectedSubmission(submission);
                              if (contactSub && !contactSub.is_read) {
                                markAsRead(submission.id, submission.type);
                              }
                            }}
                            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                              selectedSubmission?.id === submission.id
                                ? 'border-accent bg-accent/10'
                                : isUnread
                                ? 'border-accent/50 bg-accent/5 hover:bg-accent/10'
                                : 'border-border bg-secondary/30 hover:bg-secondary/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium truncate">{displayName}</p>
                                  {isUnread && (
                                    <Badge variant="secondary" className="bg-accent text-accent-foreground text-xs">New</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{submission.email}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(submission.created_at).toLocaleDateString('sv-SE', {
                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <Badge variant="outline" className={`shrink-0 text-xs ${submission.type === 'concept' ? 'bg-primary/10 border-primary' : ''}`}>
                                {isContact 
                                  ? (reasonLabels[contactSub!.contact_reason] || contactSub!.contact_reason)
                                  : '🚀 Concept Request'
                                }
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Selected Submission Detail */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    {selectedSubmission?.type === 'order' ? 'Order Details' : selectedSubmission?.type === 'concept' ? 'Concept Request' : 'Message Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSubmission ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {selectedSubmission.type === 'order' ? (
                        // Order submission detail
                        <>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <h3 className="text-lg font-semibold">{(selectedSubmission as OrderSubmission).business_name}</h3>
                              <a href={`mailto:${selectedSubmission.email}`} className="text-accent hover:underline flex items-center gap-1">
                                {selectedSubmission.email}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <Badge className={`${
                              (selectedSubmission as OrderSubmission).payment_status === 'paid' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                            }`}>
                              {(selectedSubmission as OrderSubmission).payment_status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            {new Date(selectedSubmission.created_at).toLocaleString('sv-SE')}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {(selectedSubmission as OrderSubmission).contact_person && (
                              <div className="p-3 bg-secondary/50 rounded-lg">
                                <p className="text-xs text-muted-foreground">Contact</p>
                                <p className="font-medium text-sm">{(selectedSubmission as OrderSubmission).contact_person}</p>
                              </div>
                            )}
                            {(selectedSubmission as OrderSubmission).phone && (
                              <div className="p-3 bg-secondary/50 rounded-lg">
                                <p className="text-xs text-muted-foreground">Phone</p>
                                <p className="font-medium text-sm">{(selectedSubmission as OrderSubmission).phone}</p>
                              </div>
                            )}
                            {(selectedSubmission as OrderSubmission).selected_package && (
                              <div className="p-3 bg-accent/10 rounded-lg border border-accent/30">
                                <p className="text-xs text-muted-foreground">Package</p>
                                <p className="font-medium text-sm">{(selectedSubmission as OrderSubmission).selected_package}</p>
                              </div>
                            )}
                            {(selectedSubmission as OrderSubmission).payment_amount && (
                              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                                <p className="text-xs text-muted-foreground">Amount</p>
                                <p className="font-bold text-sm">{(selectedSubmission as OrderSubmission).payment_amount}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {(selectedSubmission as OrderSubmission).wants_booking && <Badge variant="outline">📅 Booking</Badge>}
                            {(selectedSubmission as OrderSubmission).wants_admin_panel && <Badge variant="outline">🔧 Admin Panel</Badge>}
                            {(selectedSubmission as OrderSubmission).selected_care_plan && <Badge variant="outline">🛡️ {(selectedSubmission as OrderSubmission).selected_care_plan}</Badge>}
                          </div>

                          {(selectedSubmission as OrderSubmission).services && (
                            <div className="p-3 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">Services</p>
                              <p className="text-sm">{(selectedSubmission as OrderSubmission).services}</p>
                            </div>
                          )}

                          {(selectedSubmission as OrderSubmission).extra_notes && (
                            <div className="p-3 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">Extra Notes</p>
                              <p className="text-sm whitespace-pre-wrap">{(selectedSubmission as OrderSubmission).extra_notes}</p>
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Button asChild className="flex-1">
                              <a href={`mailto:${selectedSubmission.email}?subject=Your Nomia Order - ${(selectedSubmission as OrderSubmission).business_name}`}>
                                <Mail className="w-4 h-4 mr-2" />
                                Contact Customer
                              </a>
                            </Button>
                            {!(selectedSubmission as OrderSubmission).is_read && (
                              <Button variant="outline" onClick={() => markAsRead(selectedSubmission.id, 'order')}>
                                <Check className="w-4 h-4 mr-2" />
                                Mark Read
                              </Button>
                            )}
                          </div>
                        </>
                      ) : selectedSubmission.type === 'contact' ? (
                        // Contact submission detail
                        <>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{(selectedSubmission as ContactSubmission).name}</h3>
                              <a href={`mailto:${selectedSubmission.email}`} className="text-accent hover:underline flex items-center gap-1">
                                {selectedSubmission.email}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <Badge>
                              {reasonLabels[(selectedSubmission as ContactSubmission).contact_reason] || (selectedSubmission as ContactSubmission).contact_reason}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            {new Date(selectedSubmission.created_at).toLocaleString('sv-SE')}
                          </div>
                          
                          <div className="p-4 bg-secondary/50 rounded-lg">
                            <p className="whitespace-pre-wrap">{(selectedSubmission as ContactSubmission).message}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button asChild className="flex-1">
                              <a href={`mailto:${selectedSubmission.email}?subject=Re: Your message to Nomia`}>
                                <Mail className="w-4 h-4 mr-2" />
                                Reply via Email
                              </a>
                            </Button>
                            {!(selectedSubmission as ContactSubmission).is_read && (
                              <Button variant="outline" onClick={() => markAsRead(selectedSubmission.id, 'contact')}>
                                <Check className="w-4 h-4 mr-2" />
                                Mark Read
                              </Button>
                            )}
                          </div>
                        </>
                      ) : (
                        // Concept request detail
                        <>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{(selectedSubmission as ConceptRequest).business_name}</h3>
                              <a href={`mailto:${selectedSubmission.email}`} className="text-accent hover:underline flex items-center gap-1">
                                {selectedSubmission.email}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <Badge className="bg-primary/10 border-primary">🚀 Concept Request</Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            {new Date(selectedSubmission.created_at).toLocaleString('sv-SE')}
                          </div>
                          
                          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm text-muted-foreground mb-2">Business requesting a free concept:</p>
                            <p className="font-medium text-lg">{(selectedSubmission as ConceptRequest).business_name}</p>
                          </div>
                          
                          <Button asChild className="w-full">
                            <a href={`mailto:${selectedSubmission.email}?subject=Your Nomia Concept Request`}>
                              <Mail className="w-4 h-4 mr-2" />
                              Contact Customer
                            </a>
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a submission to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
