import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, MousePointerClick, TrendingUp, ArrowRight, 
  ExternalLink, Clock, Users, BarChart3 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UTMDashboard } from './UTMDashboard';

interface StoredEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
}

interface CampaignAnalyticsProps {
  events: StoredEvent[];
}

export function CampaignAnalytics({ events }: CampaignAnalyticsProps) {
  const campaignData = useMemo(() => {
    // Filter only campaign-related events
    const campaignPageViews = events.filter(e => 
      (e.event === '$pageview' || e.event === 'page_view' || e.event === 'LANDING_VIEW') &&
      (e.properties.path === '/kampanj' || String(e.properties.path).includes('kampanj'))
    );
    
    const campaignLandingViews = events.filter(e => 
      e.event === 'campaign_landing_view'
    );
    
    const campaignCtaClicks = events.filter(e => 
      e.event === 'campaign_cta_click'
    );
    
    const learnMoreClicks = events.filter(e => 
      e.event === 'campaign_learn_more_click'
    );
    
    // Track user journeys
    const sessionJourneys = new Map<string, {
      enteredCampaign: boolean;
      clickedCta: boolean;
      clickedLearnMore: boolean;
      completedWizard: boolean;
      paid: boolean;
      timestamps: string[];
    }>();
    
    events.forEach(e => {
      const sessionId = (e.properties.session_id as string) || 'unknown';
      
      if (!sessionJourneys.has(sessionId)) {
        sessionJourneys.set(sessionId, {
          enteredCampaign: false,
          clickedCta: false,
          clickedLearnMore: false,
          completedWizard: false,
          paid: false,
          timestamps: [],
        });
      }
      
      const journey = sessionJourneys.get(sessionId)!;
      
      if (e.event === 'campaign_landing_view' || 
          ((e.event === '$pageview' || e.event === 'page_view') && 
           String(e.properties.path).includes('kampanj'))) {
        journey.enteredCampaign = true;
      }
      
      if (e.event === 'campaign_cta_click') {
        journey.clickedCta = true;
      }
      
      if (e.event === 'campaign_learn_more_click') {
        journey.clickedLearnMore = true;
      }
      
      if (e.event === 'WIZARD_COMPLETE') {
        journey.completedWizard = true;
      }
      
      if (e.event === 'PAYMENT_SUCCESS' || e.event === 'CHECKOUT_COMPLETE') {
        journey.paid = true;
      }
      
      journey.timestamps.push(e.timestamp);
    });
    
    // Count campaign-originated journeys
    const campaignSessions = Array.from(sessionJourneys.values()).filter(j => j.enteredCampaign);
    const sessionsWithCta = campaignSessions.filter(j => j.clickedCta);
    const sessionsWithLearnMore = campaignSessions.filter(j => j.clickedLearnMore);
    const sessionsCompleted = campaignSessions.filter(j => j.completedWizard);
    const sessionsPaid = campaignSessions.filter(j => j.paid);
    
    // CTA performance breakdown
    const ctaBreakdown = campaignCtaClicks.reduce((acc, e) => {
      const button = (e.properties.button as string) || 'unknown';
      acc[button] = (acc[button] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Hourly distribution
    const hourlyDistribution = campaignPageViews.reduce((acc, e) => {
      const hour = new Date(e.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    return {
      totalViews: campaignPageViews.length + campaignLandingViews.length,
      uniqueSessions: campaignSessions.length,
      ctaClicks: campaignCtaClicks.length,
      learnMoreClicks: learnMoreClicks.length,
      wizardCompletions: sessionsCompleted.length,
      payments: sessionsPaid.length,
      ctaClickRate: campaignSessions.length > 0 
        ? ((sessionsWithCta.length / campaignSessions.length) * 100).toFixed(1)
        : '0',
      learnMoreClickRate: campaignSessions.length > 0
        ? ((sessionsWithLearnMore.length / campaignSessions.length) * 100).toFixed(1)
        : '0',
      conversionRate: campaignSessions.length > 0
        ? ((sessionsPaid.length / campaignSessions.length) * 100).toFixed(2)
        : '0',
      ctaBreakdown,
      hourlyDistribution,
      funnelData: [
        { stage: 'Campaign Page Views', count: campaignSessions.length, percentage: 100 },
        { stage: 'Clicked "Beställ direkt"', count: sessionsWithCta.length, percentage: campaignSessions.length > 0 ? (sessionsWithCta.length / campaignSessions.length) * 100 : 0 },
        { stage: 'Clicked "Läs mer"', count: sessionsWithLearnMore.length, percentage: campaignSessions.length > 0 ? (sessionsWithLearnMore.length / campaignSessions.length) * 100 : 0 },
        { stage: 'Completed Wizard', count: sessionsCompleted.length, percentage: campaignSessions.length > 0 ? (sessionsCompleted.length / campaignSessions.length) * 100 : 0 },
        { stage: 'Paid', count: sessionsPaid.length, percentage: campaignSessions.length > 0 ? (sessionsPaid.length / campaignSessions.length) * 100 : 0 },
      ]
    };
  }, [events]);

  return (
    <div className="space-y-6">
      {/* Campaign Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Campaign Views
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{campaignData.totalViews}</p>
              <p className="text-xs text-muted-foreground">{campaignData.uniqueSessions} unique sessions</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="border-amber-500/30">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <MousePointerClick className="w-4 h-4" />
                "Beställ direkt" Clicks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-500">{campaignData.ctaClicks}</p>
              <p className="text-xs text-muted-foreground">{campaignData.ctaClickRate}% click rate</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-blue-500/30">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                "Läs mer" Clicks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-500">{campaignData.learnMoreClicks}</p>
              <p className="text-xs text-muted-foreground">{campaignData.learnMoreClickRate}% click rate</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-green-500/30">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">{campaignData.payments}</p>
              <p className="text-xs text-muted-foreground">{campaignData.conversionRate}% rate</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Campaign Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Campaign Conversion Funnel
          </CardTitle>
          <CardDescription>Track user journey from campaign page to payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campaignData.funnelData.map((step, index) => (
              <motion.div
                key={step.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{step.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{step.count}</span>
                    <Badge variant={step.percentage > 50 ? "default" : step.percentage > 20 ? "secondary" : "outline"}>
                      {step.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${step.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full rounded-full ${
                      index === 0 ? 'bg-accent' :
                      index === 1 ? 'bg-amber-500' :
                      index === 2 ? 'bg-blue-500' :
                      index === 3 ? 'bg-purple-500' :
                      'bg-green-500'
                    }`}
                  />
                </div>
                {index < campaignData.funnelData.length - 1 && (
                  <div className="flex justify-center my-1">
                    <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Performance Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Button Performance
            </CardTitle>
            <CardDescription>Compare which CTAs drive more engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">🔥 "Beställ direkt" (Gold)</span>
                  <Badge className="bg-amber-500">{campaignData.ctaClicks} clicks</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Primary conversion CTA</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">📖 "Läs mer"</span>
                  <Badge variant="secondary">{campaignData.learnMoreClicks} clicks</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Information-seeking users</p>
              </div>
              
              {campaignData.ctaClicks > 0 && campaignData.learnMoreClicks > 0 && (
                <div className="p-3 bg-secondary/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    "Beställ direkt" outperforms "Läs mer" by{' '}
                    <span className="font-bold text-foreground">
                      {((campaignData.ctaClicks / campaignData.learnMoreClicks) * 100 - 100).toFixed(0)}%
                    </span>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Peak Hours
            </CardTitle>
            <CardDescription>When campaign visitors are most active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 24 }, (_, hour) => {
                const count = campaignData.hourlyDistribution[hour] || 0;
                const maxCount = Math.max(...Object.values(campaignData.hourlyDistribution), 1);
                const intensity = count / maxCount;
                
                return (
                  <div
                    key={hour}
                    className={`h-8 rounded text-xs flex items-center justify-center ${
                      intensity > 0.8 ? 'bg-accent text-accent-foreground' :
                      intensity > 0.5 ? 'bg-accent/60 text-foreground' :
                      intensity > 0.2 ? 'bg-accent/30' :
                      'bg-muted/50'
                    }`}
                    title={`${hour}:00 - ${count} views`}
                  >
                    {hour}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">Hour of day (24h format)</p>
          </CardContent>
        </Card>
      </div>

      {/* UTM Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            UTM Campaign Tracking
          </CardTitle>
          <CardDescription>Performance by traffic source and campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <UTMDashboard events={events} />
        </CardContent>
      </Card>
    </div>
  );
}
