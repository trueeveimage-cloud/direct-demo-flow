import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, Clock, Globe, Smartphone, Monitor, 
  TrendingUp, ArrowDown, AlertCircle, Calendar,
  Eye, MousePointer, CreditCard, CheckCircle, ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ADMIN_PASSWORD = 'nomia2024'; // Simple password protection

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
}

// Mock data - In production, this would come from PostHog/GA4/Plausible API
const getMockData = (range: string): AnalyticsData => {
  const multiplier = range === 'today' ? 1 : range === '7days' ? 7 : 30;
  
  return {
    pageViews: [
      { page: '/', views: 450 * multiplier, uniqueVisitors: 320 * multiplier, avgTime: '1:45' },
      { page: '/demo', views: 180 * multiplier, uniqueVisitors: 150 * multiplier, avgTime: '3:20' },
      { page: '/priser', views: 120 * multiplier, uniqueVisitors: 100 * multiplier, avgTime: '2:10' },
      { page: '/bestall', views: 85 * multiplier, uniqueVisitors: 70 * multiplier, avgTime: '5:30' },
      { page: '/portfolio', views: 65 * multiplier, uniqueVisitors: 55 * multiplier, avgTime: '1:55' },
    ],
    topReferrers: [
      { source: 'google', visitors: 200 * multiplier },
      { source: 'direct', visitors: 150 * multiplier },
      { source: 'instagram', visitors: 80 * multiplier },
      { source: 'facebook', visitors: 45 * multiplier },
      { source: 'linkedin', visitors: 25 * multiplier },
    ],
    deviceSplit: {
      desktop: 45,
      mobile: 50,
      tablet: 5,
    },
    countries: [
      { country: 'Sweden', visitors: 350 * multiplier },
      { country: 'Norway', visitors: 45 * multiplier },
      { country: 'Denmark', visitors: 30 * multiplier },
      { country: 'Finland', visitors: 20 * multiplier },
      { country: 'Other', visitors: 55 * multiplier },
    ],
    funnel: {
      landingView: 500 * multiplier,
      startWizard: 180 * multiplier,
      completeWizard: 85 * multiplier,
      checkoutStarted: 45 * multiplier,
      paymentSuccess: 12 * multiplier,
      carePlanSelected: 8 * multiplier,
    },
    wizardDropoff: [
      { step: 1, name: 'Contact', dropoff: 15 },
      { step: 2, name: 'Package', dropoff: 22 },
      { step: 3, name: 'Pages', dropoff: 18 },
      { step: 4, name: 'Care Plan', dropoff: 12 },
      { step: 5, name: 'Payment', dropoff: 35 },
    ],
    checkoutErrors: {
      count: 3 * multiplier,
      lastErrors: [
        { message: 'Card declined - insufficient funds', timestamp: '2024-01-15 14:32' },
        { message: 'Network timeout during payment', timestamp: '2024-01-14 09:15' },
        { message: 'Invalid card number', timestamp: '2024-01-13 16:45' },
      ],
    },
  };
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'custom'>('7days');
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setData(getMockData(dateRange));
    }
  }, [isAuthenticated, dateRange]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (!isAuthenticated) {
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-12"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button type="submit" className="w-full h-12">
              Access Dashboard
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!data) return null;

  const totalViews = data.pageViews.reduce((sum, p) => sum + p.views, 0);
  const totalUniqueVisitors = data.pageViews.reduce((sum, p) => sum + p.uniqueVisitors, 0);
  const conversionRate = ((data.funnel.paymentSuccess / data.funnel.landingView) * 100).toFixed(2);

  return (
    <div className="py-12 section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor your website performance and conversion funnels</p>
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
                Unique Visitors
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
                    const dropoff = index > 0 ? ((prevValue - step.value) / prevValue * 100).toFixed(1) : '0';
                    const width = (step.value / arr[0].value) * 100;
                    
                    return (
                      <div key={step.label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <step.icon className="w-4 h-4 text-muted-foreground" />
                            {step.label}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="font-medium">{step.value.toLocaleString()}</span>
                            {index > 0 && (
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
                            style={{ width: `${width}%` }}
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
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground border-b border-border">
                        <th className="pb-3">Page</th>
                        <th className="pb-3">Views</th>
                        <th className="pb-3">Unique</th>
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
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.countries.map((country) => (
                      <div key={country.country} className="flex justify-between items-center">
                        <span>{country.country}</span>
                        <span className="font-medium">{country.visitors.toLocaleString()}</span>
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
                <div className="space-y-3">
                  {data.checkoutErrors.lastErrors.map((err, i) => (
                    <div key={i} className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <p className="font-medium text-destructive">{err.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{err.timestamp}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
