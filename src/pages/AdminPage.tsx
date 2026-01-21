import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Users, Clock, Globe, Smartphone, Monitor, 
  TrendingUp, ArrowDown, AlertCircle, Calendar, RefreshCw,
  Eye, MousePointer, CreditCard, CheckCircle, ShoppingCart,
  LogOut, Mail, MessageSquare, ExternalLink, Check, Trash2,
  LayoutDashboard, Inbox, LineChart, Settings, ChevronLeft,
  ChevronRight, X, Server, Database, Zap, Activity,
  FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { getAnalytics, FunnelEvents } from '@/lib/posthog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  updated_at?: string;
  email: string;
  business_name: string;
  contact_person?: string;
  phone?: string;
  submission_type: string;
  customer_type?: string;
  company_name?: string;
  org_number?: string;
  vat_number?: string;
  vat_verified?: boolean;
  country?: string;
  selected_package?: string;
  selected_style?: string;
  selected_language?: string;
  primary_color?: string;
  accent_color?: string;
  selected_pages?: string[];
  custom_pages?: string[];
  legal_pages?: string[];
  payment_status: string;
  payment_amount?: string;
  stripe_session_id?: string;
  paid_at?: string;
  wants_booking?: boolean;
  wants_admin_panel?: boolean;
  wants_google_reviews?: boolean;
  wants_google_maps?: boolean;
  wants_before_after?: boolean;
  wants_checkout_system?: boolean;
  selected_care_plan?: string;
  is_yearly_care_plan?: boolean;
  services?: string;
  opening_hours?: string;
  booking_services?: unknown;
  appointment_lengths?: string[];
  buffer_time?: string;
  max_bookings_per_day?: string;
  advance_booking_days?: string;
  google_maps_address?: string;
  google_business_link?: string;
  business_type?: string;
  business_followups?: unknown;
  website_goal?: string;
  current_website?: string;
  competitors?: string;
  seo_keywords?: string;
  brand_preferences?: string;
  uploaded_photos?: string[];
  terms_explanation?: string;
  page_notes?: string;
  extra_notes?: string;
  concept_link?: string;
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

type NavItem = 'overview' | 'orders' | 'messages' | 'analytics' | 'system';

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
  
  const filteredEvents = events.filter(e => new Date(e.timestamp) >= filterDate);
  
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

  const funnel = {
    landingView: filteredEvents.filter(e => e.event === FunnelEvents.LANDING_VIEW).length,
    startWizard: filteredEvents.filter(e => e.event === FunnelEvents.WIZARD_START).length,
    completeWizard: filteredEvents.filter(e => e.event === FunnelEvents.WIZARD_COMPLETE).length,
    checkoutStarted: filteredEvents.filter(e => e.event === FunnelEvents.CHECKOUT_START).length,
    paymentSuccess: filteredEvents.filter(e => e.event === FunnelEvents.PAYMENT_SUCCESS).length,
    carePlanSelected: filteredEvents.filter(e => e.event === FunnelEvents.CARE_PLAN_SELECTED).length,
  };

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
  const [activeNav, setActiveNav] = useState<NavItem>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<Submission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Bulk selection state
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleteType, setBulkDeleteType] = useState<'orders' | 'messages'>('orders');
  
  // Full order details modal
  const [fullDetailsOrder, setFullDetailsOrder] = useState<OrderSubmission | null>(null);

  // Check for stored lockout on mount
  useEffect(() => {
    const storedLockout = localStorage.getItem('admin_lockout');
    if (storedLockout) {
      const lockTime = parseInt(storedLockout, 10);
      if (Date.now() < lockTime) {
        setLockedUntil(lockTime);
      } else {
        localStorage.removeItem('admin_lockout');
        localStorage.removeItem('admin_attempts');
      }
    }
    const storedAttempts = localStorage.getItem('admin_attempts');
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts, 10));
    }
  }, []);

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

        const { data: adminCheck } = await supabase.rpc('is_admin_user');
        
        if (adminCheck === true) {
          setIsAuthenticated(true);
          setIsAdmin(true);
        } else {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      } else if (event === 'SIGNED_IN' && session) {
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

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const analytics = getAnalytics();
      const storedEvents = analytics.getStoredEvents();
      setEvents(storedEvents);
      fetchAllSubmissions();
      
      // Auto-refresh submissions every 30 seconds
      const refreshInterval = setInterval(() => {
        console.log('[Admin] Auto-refreshing submissions...');
        fetchAllSubmissions();
      }, 30000);
      
      return () => clearInterval(refreshInterval);
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.functions.invoke('admin-update-order-status', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        body: { orderId, paymentStatus: newStatus }
      });
      
      if (error) {
        console.error('Update status error:', error);
        return;
      }
      
      // Update local state
      setSubmissions(prev => 
        prev.map(s => s.id === orderId ? { ...s, payment_status: newStatus } : s)
      );
      
      // Update selected submission if it's the same order
      if (selectedSubmission?.id === orderId) {
        setSelectedSubmission({ ...selectedSubmission, payment_status: newStatus } as OrderSubmission);
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleDelete = async () => {
    if (!submissionToDelete) return;
    
    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.functions.invoke('admin-delete-submission', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        body: { 
          items: [{ id: submissionToDelete.id, type: submissionToDelete.type }]
        }
      });
      
      if (error) {
        console.error('Delete error:', error);
        return;
      }
      
      setSubmissions(prev => prev.filter(s => s.id !== submissionToDelete.id));
      if (selectedSubmission?.id === submissionToDelete.id) {
        setSelectedSubmission(null);
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSubmissionToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    const selectedIds = bulkDeleteType === 'orders' ? selectedOrders : selectedMessages;
    if (selectedIds.size === 0) return;
    
    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const items = Array.from(selectedIds).map(id => {
        const submission = submissions.find(s => s.id === id);
        return { id, type: submission?.type || (bulkDeleteType === 'orders' ? 'order' : 'contact') };
      });

      const { error } = await supabase.functions.invoke('admin-delete-submission', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        body: { items }
      });
      
      if (error) {
        console.error('Bulk delete error:', error);
        return;
      }
      
      setSubmissions(prev => prev.filter(s => !selectedIds.has(s.id)));
      if (selectedSubmission && selectedIds.has(selectedSubmission.id)) {
        setSelectedSubmission(null);
      }
      
      if (bulkDeleteType === 'orders') {
        setSelectedOrders(new Set());
      } else {
        setSelectedMessages(new Set());
      }
    } catch (err) {
      console.error('Failed to bulk delete:', err);
    } finally {
      setIsDeleting(false);
      setBulkDeleteDialogOpen(false);
    }
  };

  const confirmDelete = (submission: Submission) => {
    setSubmissionToDelete(submission);
    setDeleteDialogOpen(true);
  };

  const confirmBulkDelete = (type: 'orders' | 'messages') => {
    setBulkDeleteType(type);
    setBulkDeleteDialogOpen(true);
  };

  const toggleOrderSelection = (id: string) => {
    setSelectedOrders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleMessageSelection = (id: string) => {
    setSelectedMessages(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const orders = submissions.filter(s => s.type === 'order') as OrderSubmission[];
  const messages = submissions.filter(s => s.type !== 'order');
  
  const filteredOrders = orders;
  const filteredMessages = messages;

  const toggleAllOrders = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const toggleAllMessages = () => {
    if (selectedMessages.size === filteredMessages.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(filteredMessages.map(m => m.id)));
    }
  };

  const unreadCount = submissions.filter(s => {
    if (s.type === 'contact') return !(s as ContactSubmission).is_read;
    if (s.type === 'order') return !(s as OrderSubmission).is_read;
    return false;
  }).length;
  
  const pendingPayments = orders.filter(o => o.payment_status === 'pending').length;
  const paidOrders = orders.filter(o => o.payment_status === 'paid').length;

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
    
    if (lockedUntil && Date.now() < lockedUntil) {
      const remainingTime = Math.ceil((lockedUntil - Date.now()) / 60000);
      setError(`Too many attempts. Try again in ${remainingTime} minute(s).`);
      return;
    }
    
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
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('admin_attempts', String(newAttempts));
        
        if (newAttempts >= 3) {
          const lockTime = Date.now() + 15 * 60 * 1000;
          setLockedUntil(lockTime);
          localStorage.setItem('admin_lockout', String(lockTime));
          setError('Too many failed attempts. Locked for 15 minutes.');
        } else {
          setError(`Invalid login credentials. ${3 - newAttempts} attempt(s) remaining.`);
        }
        return;
      }

      const { data: adminCheck } = await supabase.rpc('is_admin_user');
      
      if (adminCheck !== true) {
        await supabase.auth.signOut();
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('admin_attempts', String(newAttempts));
        
        if (newAttempts >= 3) {
          const lockTime = Date.now() + 15 * 60 * 1000;
          setLockedUntil(lockTime);
          localStorage.setItem('admin_lockout', String(lockTime));
          setError('Too many failed attempts. Locked for 15 minutes.');
        } else {
          setError(`Unauthorized - admin access required. ${3 - newAttempts} attempt(s) remaining.`);
        }
        return;
      }

      setLoginAttempts(0);
      localStorage.removeItem('admin_attempts');
      localStorage.removeItem('admin_lockout');
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Refresh analytics
    const analytics = getAnalytics();
    const storedEvents = analytics.getStoredEvents();
    setEvents(storedEvents);
    
    // Refresh submissions
    await fetchAllSubmissions();
    
    setRefreshKey(k => k + 1);
    
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm p-8 bg-secondary/50 rounded-2xl border border-border"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-12"
              autoFocus
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-12"
            />
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
  const conversionRate = data.funnel.landingView > 0 
    ? ((data.funnel.paymentSuccess / data.funnel.landingView) * 100).toFixed(1)
    : '0';

  const navItems: { id: NavItem; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: pendingPayments > 0 ? pendingPayments : undefined },
    { id: 'messages', label: 'Messages', icon: Inbox, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'system', label: 'System', icon: Server },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-secondary/30 border-r border-border transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!sidebarCollapsed && (
            <h1 className="font-bold text-lg">Admin Panel</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={sidebarCollapsed ? 'mx-auto' : ''}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
        
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                activeNav === item.id
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              {item.badge && (
                <Badge 
                  className={`${sidebarCollapsed ? 'absolute -top-1 -right-1' : 'ml-auto'} h-5 min-w-5 flex items-center justify-center p-0 text-xs bg-destructive`}
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-border">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold capitalize">{activeNav}</h2>
              <p className="text-sm text-muted-foreground">
                {activeNav === 'overview' && `${data.totalEvents} events tracked`}
                {activeNav === 'orders' && `${orders.length} total orders`}
                {activeNav === 'messages' && `${messages.length} messages`}
                {activeNav === 'analytics' && 'Conversion funnel & page performance'}
                {activeNav === 'system' && 'System information & quick actions'}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {/* Overview Section */}
          {activeNav === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Page Views
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Paid Orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-500">{paidOrders}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Pending
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-yellow-500">{pendingPayments}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Conversion
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{conversionRate}%</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No orders yet</p>
                  ) : (
                    <div className="space-y-2">
                      {orders.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{order.business_name}</p>
                            <p className="text-sm text-muted-foreground">{order.email}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {order.payment_amount && (
                              <span className="text-sm font-medium">{order.payment_amount}</span>
                            )}
                            <Badge className={`${
                              order.payment_status === 'paid' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {order.payment_status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Conversion Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-4">
                    {[
                      { label: 'Views', value: data.funnel.landingView },
                      { label: 'Wizard', value: data.funnel.startWizard },
                      { label: 'Checkout', value: data.funnel.checkoutStarted },
                      { label: 'Paid', value: data.funnel.paymentSuccess },
                    ].map((step, i, arr) => {
                      const height = arr[0].value > 0 ? (step.value / arr[0].value) * 100 : 0;
                      return (
                        <div key={step.label} className="flex-1 text-center">
                          <div className="h-32 flex items-end justify-center mb-2">
                            <div 
                              className="w-full max-w-16 bg-accent rounded-t transition-all duration-500"
                              style={{ height: `${Math.max(height, 5)}%` }}
                            />
                          </div>
                          <p className="text-lg font-bold">{step.value}</p>
                          <p className="text-xs text-muted-foreground">{step.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders Section */}
          {activeNav === 'orders' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Orders List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Orders</CardTitle>
                      <CardDescription>{filteredOrders.length} orders</CardDescription>
                    </div>
                    {selectedOrders.size > 0 && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => confirmBulkDelete('orders')}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete ({selectedOrders.size})
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredOrders.length > 0 && (
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
                      <Checkbox
                        checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                        onCheckedChange={toggleAllOrders}
                      />
                      <span className="text-sm text-muted-foreground">
                        {selectedOrders.size > 0 
                          ? `${selectedOrders.size} selected` 
                          : 'Select all'}
                      </span>
                    </div>
                  )}
                  <div className="space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto">
                    {filteredOrders.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">No orders found</p>
                    ) : (
                      filteredOrders.map((order) => (
                        <div
                          key={order.id}
                          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedSubmission?.id === order.id
                              ? 'border-accent bg-accent/10'
                              : selectedOrders.has(order.id)
                              ? 'border-destructive/50 bg-destructive/5'
                              : !order.is_read
                              ? 'border-accent/50 bg-accent/5 hover:bg-accent/10'
                              : 'border-border hover:bg-secondary/50'
                          }`}
                        >
                          <Checkbox
                            checked={selectedOrders.has(order.id)}
                            onCheckedChange={() => toggleOrderSelection(order.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div 
                            className="flex-1 min-w-0"
                            onClick={() => {
                              setSelectedSubmission(order);
                              if (!order.is_read) markAsRead(order.id, 'order');
                            }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{order.business_name}</p>
                                  {!order.is_read && <Badge className="bg-accent text-xs">New</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{order.email}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(order.created_at).toLocaleDateString('sv-SE', {
                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge className={`text-xs ${
                                  order.payment_status === 'paid' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : order.payment_status === 'pending'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {order.payment_status}
                                </Badge>
                                {order.payment_amount && (
                                  <span className="text-xs font-medium">{order.payment_amount}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Details */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSubmission && selectedSubmission.type === 'order' ? (
                    <OrderDetails 
                      order={selectedSubmission as OrderSubmission} 
                      onDelete={() => confirmDelete(selectedSubmission)}
                      onMarkRead={() => markAsRead(selectedSubmission.id, 'order')}
                      onViewFull={() => setFullDetailsOrder(selectedSubmission as OrderSubmission)}
                      onUpdateStatus={(status) => updateOrderStatus(selectedSubmission.id, status)}
                    />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select an order to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Messages Section */}
          {activeNav === 'messages' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Messages List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Messages</CardTitle>
                      <CardDescription>{filteredMessages.length} messages</CardDescription>
                    </div>
                    {selectedMessages.size > 0 && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => confirmBulkDelete('messages')}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete ({selectedMessages.size})
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredMessages.length > 0 && (
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
                      <Checkbox
                        checked={selectedMessages.size === filteredMessages.length && filteredMessages.length > 0}
                        onCheckedChange={toggleAllMessages}
                      />
                      <span className="text-sm text-muted-foreground">
                        {selectedMessages.size > 0 
                          ? `${selectedMessages.size} selected` 
                          : 'Select all'}
                      </span>
                    </div>
                  )}
                  <div className="space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto">
                    {filteredMessages.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">No messages found</p>
                    ) : (
                      filteredMessages.map((message) => {
                        const isContact = message.type === 'contact';
                        const contact = isContact ? message as ContactSubmission : null;
                        const concept = message.type === 'concept' ? message as ConceptRequest : null;
                        const displayName = contact?.name || concept?.business_name || 'Unknown';
                        const isUnread = contact && !contact.is_read;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                              selectedSubmission?.id === message.id
                                ? 'border-accent bg-accent/10'
                                : selectedMessages.has(message.id)
                                ? 'border-destructive/50 bg-destructive/5'
                                : isUnread
                                ? 'border-accent/50 bg-accent/5 hover:bg-accent/10'
                                : 'border-border hover:bg-secondary/50'
                            }`}
                          >
                            <Checkbox
                              checked={selectedMessages.has(message.id)}
                              onCheckedChange={() => toggleMessageSelection(message.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div 
                              className="flex-1 min-w-0"
                              onClick={() => {
                                setSelectedSubmission(message);
                                if (contact && !contact.is_read) {
                                  markAsRead(message.id, message.type);
                                }
                              }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium truncate">{displayName}</p>
                                    {isUnread && <Badge className="bg-accent text-xs">New</Badge>}
                                  </div>
                                  <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(message.created_at).toLocaleDateString('sv-SE', {
                                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <Badge variant="outline" className={`text-xs ${message.type === 'concept' ? 'bg-primary/10 border-primary' : ''}`}>
                                  {isContact 
                                    ? (reasonLabels[contact!.contact_reason] || contact!.contact_reason)
                                    : '🚀 Concept'
                                  }
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Message Details */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Message Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSubmission && selectedSubmission.type !== 'order' ? (
                    <MessageDetails 
                      message={selectedSubmission} 
                      reasonLabels={reasonLabels}
                      onDelete={() => confirmDelete(selectedSubmission)}
                    />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a message to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analytics Section */}
          {activeNav === 'analytics' && (
            <div className="space-y-6">
              {/* Date Range Filter */}
              <div className="flex gap-2">
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

              {/* Funnel */}
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

              {/* Page Performance & Device Split */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Page Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.pageViews.slice(0, 8).map((page) => (
                        <div key={page.page} className="flex justify-between items-center">
                          <span className="text-sm truncate max-w-[60%]">{page.page}</span>
                          <span className="font-medium">{page.views}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Device Split</CardTitle>
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
              </div>

              {/* Errors */}
              {data.checkoutErrors.count > 0 && (
                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-5 h-5" />
                      Checkout Errors ({data.checkoutErrors.count})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data.checkoutErrors.lastErrors.map((err, i) => (
                        <div key={i} className="p-3 bg-destructive/10 rounded-lg">
                          <p className="text-sm">{err.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{err.timestamp}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* System Section */}
          {activeNav === 'system' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Total Submissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{submissions.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Events Tracked
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{events.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Active Sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-500">Live</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      System Status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-500">OK</p>
                  </CardContent>
                </Card>
              </div>

              {/* Spots Configuration */}
              <SpotsConfigCard />

              {/* System Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Database Tables
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                        <span>order_submissions</span>
                        <Badge>{orders.length} rows</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                        <span>contact_submissions</span>
                        <Badge>{messages.filter(m => m.type === 'contact').length} rows</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                        <span>concept_requests</span>
                        <Badge>{messages.filter(m => m.type === 'concept').length} rows</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={handleRefresh}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh All Data
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          localStorage.removeItem('nomia_analytics_events');
                          setEvents([]);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Analytics Cache
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        asChild
                      >
                        <a href="https://stripe.com/dashboard" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Stripe Dashboard
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Package Prices Reference */}
              <Card>
                <CardHeader>
                  <CardTitle>Package Prices (SEK)</CardTitle>
                  <CardDescription>Current pricing configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                      <h4 className="font-semibold text-lg">Starter</h4>
                      <p className="text-2xl font-bold text-accent">2,900 kr</p>
                      <p className="text-sm text-muted-foreground mt-1">1-page website</p>
                    </div>
                    <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                      <h4 className="font-semibold text-lg">Standard</h4>
                      <p className="text-2xl font-bold text-accent">6,900 kr</p>
                      <p className="text-sm text-muted-foreground mt-1">Multi-page + booking</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                      <h4 className="font-semibold text-lg">Pro</h4>
                      <p className="text-2xl font-bold text-accent">15,900 kr</p>
                      <p className="text-sm text-muted-foreground mt-1">Full-featured</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Care Plan Prices */}
              <Card>
                <CardHeader>
                  <CardTitle>Care Plan Prices (Monthly)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <h4 className="font-semibold">Basic</h4>
                      <p className="text-xl font-bold">290 kr/mo</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <h4 className="font-semibold">Standard</h4>
                      <p className="text-xl font-bold">490 kr/mo</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <h4 className="font-semibold">Premium</h4>
                      <p className="text-xl font-bold">790 kr/mo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Single Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {submissionToDelete?.type}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {bulkDeleteType === 'orders' ? selectedOrders.size : selectedMessages.size} Items</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {bulkDeleteType === 'orders' ? selectedOrders.size : selectedMessages.size} selected {bulkDeleteType}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : `Delete All (${bulkDeleteType === 'orders' ? selectedOrders.size : selectedMessages.size})`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Full Order Details Modal */}
      <Dialog open={!!fullDetailsOrder} onOpenChange={() => setFullDetailsOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Full Order Details - {fullDetailsOrder?.business_name}
            </DialogTitle>
          </DialogHeader>
          {fullDetailsOrder && (
            <div className="space-y-4">
              <FullOrderDetails order={fullDetailsOrder} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Full Order Details Component - Shows EVERYTHING
function FullOrderDetails({ order }: { order: OrderSubmission }) {
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? '✓ Yes' : '✗ No';
    if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '—';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const sections = [
    {
      title: '📋 Basic Info',
      fields: [
        { label: 'ID', value: order.id },
        { label: 'Created', value: new Date(order.created_at).toLocaleString('sv-SE') },
        { label: 'Updated', value: order.updated_at ? new Date(order.updated_at).toLocaleString('sv-SE') : null },
        { label: 'Submission Type', value: order.submission_type },
        { label: 'Is Read', value: order.is_read },
      ]
    },
    {
      title: '🏢 Business Details',
      fields: [
        { label: 'Business Name', value: order.business_name },
        { label: 'Contact Person', value: order.contact_person },
        { label: 'Email', value: order.email },
        { label: 'Phone', value: order.phone },
        { label: 'Customer Type', value: order.customer_type },
        { label: 'Company Name', value: order.company_name },
        { label: 'Org Number', value: order.org_number },
        { label: 'VAT Number', value: order.vat_number },
        { label: 'VAT Verified', value: order.vat_verified },
        { label: 'Country', value: order.country },
        { label: 'Business Type', value: order.business_type },
      ]
    },
    {
      title: '💳 Payment Info',
      fields: [
        { label: 'Payment Status', value: order.payment_status },
        { label: 'Payment Amount', value: order.payment_amount },
        { label: 'Stripe Session ID', value: order.stripe_session_id },
        { label: 'Paid At', value: order.paid_at ? new Date(order.paid_at).toLocaleString('sv-SE') : null },
      ]
    },
    {
      title: '📦 Package & Style',
      fields: [
        { label: 'Selected Package', value: order.selected_package },
        { label: 'Selected Style', value: order.selected_style },
        { label: 'Selected Language', value: order.selected_language },
        { label: 'Primary Color', value: order.primary_color },
        { label: 'Accent Color', value: order.accent_color },
      ]
    },
    {
      title: '📄 Pages',
      fields: [
        { label: 'Selected Pages', value: order.selected_pages },
        { label: 'Custom Pages', value: order.custom_pages },
        { label: 'Legal Pages', value: order.legal_pages },
      ]
    },
    {
      title: '🛠️ Features & Add-ons',
      fields: [
        { label: 'Wants Booking', value: order.wants_booking },
        { label: 'Wants Admin Panel', value: order.wants_admin_panel },
        { label: 'Wants Google Reviews', value: order.wants_google_reviews },
        { label: 'Wants Google Maps', value: order.wants_google_maps },
        { label: 'Wants Before/After', value: order.wants_before_after },
        { label: 'Wants Checkout System', value: order.wants_checkout_system },
      ]
    },
    {
      title: '🛡️ Care Plan',
      fields: [
        { label: 'Selected Care Plan', value: order.selected_care_plan },
        { label: 'Is Yearly', value: order.is_yearly_care_plan },
      ]
    },
    {
      title: '📅 Booking Settings',
      fields: [
        { label: 'Services', value: order.services },
        { label: 'Opening Hours', value: order.opening_hours },
        { label: 'Booking Services', value: order.booking_services },
        { label: 'Appointment Lengths', value: order.appointment_lengths },
        { label: 'Buffer Time', value: order.buffer_time },
        { label: 'Max Bookings/Day', value: order.max_bookings_per_day },
        { label: 'Advance Booking Days', value: order.advance_booking_days },
      ]
    },
    {
      title: '📍 Location & Links',
      fields: [
        { label: 'Google Maps Address', value: order.google_maps_address },
        { label: 'Google Business Link', value: order.google_business_link },
        { label: 'Concept Link', value: order.concept_link },
        { label: 'Current Website', value: order.current_website },
      ]
    },
    {
      title: '📝 Project Details',
      fields: [
        { label: 'Website Goal', value: order.website_goal },
        { label: 'Competitors', value: order.competitors },
        { label: 'SEO Keywords', value: order.seo_keywords },
        { label: 'Brand Preferences', value: order.brand_preferences },
        { label: 'Business Followups', value: order.business_followups },
      ]
    },
    {
      title: '🖼️ Files & Notes',
      fields: [
        { label: 'Uploaded Photos', value: order.uploaded_photos },
        { label: 'Terms Explanation', value: order.terms_explanation },
        { label: 'Page Notes', value: order.page_notes },
        { label: 'Extra Notes', value: order.extra_notes },
      ]
    },
  ];

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      {(order.primary_color || order.accent_color) && (
        <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
          <span className="text-sm font-medium">Colors:</span>
          {order.primary_color && (
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full border-2 border-border" 
                style={{ backgroundColor: order.primary_color }}
              />
              <span className="text-xs">{order.primary_color}</span>
            </div>
          )}
          {order.accent_color && (
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full border-2 border-border" 
                style={{ backgroundColor: order.accent_color }}
              />
              <span className="text-xs">{order.accent_color}</span>
            </div>
          )}
        </div>
      )}

      {sections.map((section) => (
        <div key={section.title} className="space-y-2">
          <h3 className="font-semibold text-lg border-b border-border pb-2">{section.title}</h3>
          <div className="grid grid-cols-2 gap-2">
            {section.fields.map((field) => (
              <div key={field.label} className="p-2 bg-secondary/20 rounded">
                <p className="text-xs text-muted-foreground">{field.label}</p>
                <p className="text-sm font-medium break-all">{formatValue(field.value)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Order Details Component
function OrderDetails({ order, onDelete, onMarkRead, onViewFull, onUpdateStatus }: { 
  order: OrderSubmission; 
  onDelete: () => void;
  onMarkRead: () => void;
  onViewFull: () => void;
  onUpdateStatus: (status: string) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    await onUpdateStatus(newStatus);
    setIsUpdating(false);
  };

  const statusOptions = [
    { value: 'pending', label: '⏳ Pending', className: 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' },
    { value: 'paid', label: '✓ Paid', className: 'bg-green-500/20 text-green-400 hover:bg-green-500/30' },
    { value: 'failed', label: '✗ Failed', className: 'bg-red-500/20 text-red-400 hover:bg-red-500/30' },
    { value: 'refunded', label: '↩ Refunded', className: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{order.business_name}</h3>
          <a href={`mailto:${order.email}`} className="text-accent hover:underline flex items-center gap-1 text-sm">
            {order.email}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!order.is_read && (
              <DropdownMenuItem onClick={onMarkRead}>
                <Check className="w-4 h-4 mr-2" />
                Mark as read
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Payment Status Editor */}
      <div className="p-3 bg-secondary/30 rounded-lg">
        <p className="text-xs text-muted-foreground mb-2">Payment Status (click to change)</p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              disabled={isUpdating || order.payment_status === status.value}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                order.payment_status === status.value 
                  ? `${status.className} ring-2 ring-offset-2 ring-offset-background ring-accent` 
                  : `${status.className} opacity-50 hover:opacity-100`
              } ${isUpdating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {new Date(order.created_at).toLocaleString('sv-SE')}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {order.contact_person && (
          <div className="p-3 bg-secondary/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Contact</p>
            <p className="font-medium text-sm">{order.contact_person}</p>
          </div>
        )}
        {order.phone && (
          <div className="p-3 bg-secondary/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="font-medium text-sm">{order.phone}</p>
          </div>
        )}
        {order.selected_package && (
          <div className="p-3 bg-accent/10 rounded-lg border border-accent/30">
            <p className="text-xs text-muted-foreground">Package</p>
            <p className="font-medium text-sm">{order.selected_package}</p>
          </div>
        )}
        {order.payment_amount && (
          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="font-bold text-sm">{order.payment_amount}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {order.wants_booking && <Badge variant="outline">📅 Booking</Badge>}
        {order.wants_admin_panel && <Badge variant="outline">🔧 Admin Panel</Badge>}
        {order.selected_care_plan && <Badge variant="outline">🛡️ {order.selected_care_plan}</Badge>}
      </div>

      {order.services && (
        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Services</p>
          <p className="text-sm">{order.services}</p>
        </div>
      )}

      {order.extra_notes && (
        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Extra Notes</p>
          <p className="text-sm whitespace-pre-wrap">{order.extra_notes}</p>
        </div>
      )}

      <div className="space-y-2 pt-2">
        <Button onClick={onViewFull} variant="outline" className="w-full">
          <FileText className="w-4 h-4 mr-2" />
          View ALL Details
        </Button>
        <Button asChild className="w-full">
          <a href={`mailto:${order.email}?subject=Your Nomia Order - ${order.business_name}`}>
            <Mail className="w-4 h-4 mr-2" />
            Contact Customer
          </a>
        </Button>
      </div>
    </div>
  );
}

// Message Details Component
function MessageDetails({ message, reasonLabels, onDelete }: { 
  message: Submission; 
  reasonLabels: Record<string, string>;
  onDelete: () => void;
}) {
  if (message.type === 'contact') {
    const contact = message as ContactSubmission;
    return (
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{contact.name}</h3>
            <a href={`mailto:${contact.email}`} className="text-accent hover:underline flex items-center gap-1 text-sm">
              {contact.email}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Badge>{reasonLabels[contact.contact_reason] || contact.contact_reason}</Badge>
        
        <div className="text-sm text-muted-foreground">
          {new Date(contact.created_at).toLocaleString('sv-SE')}
        </div>
        
        <div className="p-4 bg-secondary/50 rounded-lg">
          <p className="whitespace-pre-wrap">{contact.message}</p>
        </div>
        
        <Button asChild className="w-full">
          <a href={`mailto:${contact.email}?subject=Re: Your message to Nomia`}>
            <Mail className="w-4 h-4 mr-2" />
            Reply via Email
          </a>
        </Button>
      </div>
    );
  }

  // Concept request
  const concept = message as ConceptRequest;
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{concept.business_name}</h3>
          <a href={`mailto:${concept.email}`} className="text-accent hover:underline flex items-center gap-1 text-sm">
            {concept.email}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Badge className="bg-primary/10 border-primary">🚀 Concept Request</Badge>
      
      <div className="text-sm text-muted-foreground">
        {new Date(concept.created_at).toLocaleString('sv-SE')}
      </div>
      
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-sm text-muted-foreground mb-2">Business requesting a free concept:</p>
        <p className="font-medium text-lg">{concept.business_name}</p>
      </div>
      
      <Button asChild className="w-full">
        <a href={`mailto:${concept.email}?subject=Your Nomia Concept Request`}>
          <Mail className="w-4 h-4 mr-2" />
          Contact Customer
        </a>
      </Button>
    </div>
  );
}

// Spots Configuration Card for Admin
function SpotsConfigCard() {
  const [currentSpots, setCurrentSpots] = useState<number>(4);
  const [maxSpots, setMaxSpots] = useState<number>(7);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastReset, setLastReset] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpotsConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('spots_config')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching spots config:', error);
          return;
        }

        if (data) {
          setCurrentSpots(data.current_spots);
          setMaxSpots(data.max_spots);
          setLastReset(data.last_reset_at);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpotsConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: config } = await supabase
        .from('spots_config')
        .select('id')
        .single();

      if (config) {
        const { error } = await supabase
          .from('spots_config')
          .update({
            current_spots: currentSpots,
            max_spots: maxSpots,
            last_reset_at: new Date().toISOString(),
          })
          .eq('id', config.id);

        if (error) {
          console.error('Error updating spots config:', error);
        } else {
          setLastReset(new Date().toISOString());
        }
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Loading spots configuration...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          Weekly Spots Configuration
        </CardTitle>
        <CardDescription>
          Control the scarcity spots shown to users. Spots drop by 1 every 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Current Spots Available</label>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentSpots(Math.max(1, currentSpots - 1))}
              >
                <span className="text-lg">−</span>
              </Button>
              <span className="text-4xl font-bold text-accent w-16 text-center">{currentSpots}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentSpots(Math.min(maxSpots, currentSpots + 1))}
              >
                <span className="text-lg">+</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This is what users see as "X spots left"
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Max Spots Per Week</label>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setMaxSpots(Math.max(1, maxSpots - 1))}
              >
                <span className="text-lg">−</span>
              </Button>
              <span className="text-4xl font-bold text-foreground w-16 text-center">{maxSpots}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setMaxSpots(maxSpots + 1)}
              >
                <span className="text-lg">+</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Maximum spots that can be available
            </p>
          </div>
        </div>

        {lastReset && (
          <div className="p-3 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Last updated:</span>{' '}
              {new Date(lastReset).toLocaleString('sv-SE')}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setCurrentSpots(maxSpots);
              handleSave();
            }}
            disabled={isSaving}
          >
            Reset to Max
          </Button>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-secondary/20 rounded-lg">
          <p className="font-medium mb-1">How it works:</p>
          <ul className="space-y-1 list-disc pl-4">
            <li>Current spots decrease by 1 every 24 hours automatically</li>
            <li>Minimum spots is always 1 (never shows 0)</li>
            <li>Use "Reset to Max" to start a new week cycle</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
