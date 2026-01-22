import { useMemo, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface PageData {
  page: string;
  views: number;
  uniqueVisitors: number;
  avgTime: string;
}

interface FunnelData {
  landingView: number;
  startWizard: number;
  completeWizard: number;
  checkoutStarted: number;
  paymentSuccess: number;
  carePlanSelected: number;
}

interface AnalyticsHeatmapProps {
  pageViews: PageData[];
  funnel: FunnelData;
}

export const AnalyticsHeatmap = forwardRef<HTMLDivElement, AnalyticsHeatmapProps>(
  function AnalyticsHeatmap({ pageViews, funnel }, ref) {
  const maxViews = useMemo(() => {
    return Math.max(...pageViews.map(p => p.views), 1);
  }, [pageViews]);

  const getHeatColor = (value: number, max: number) => {
    const intensity = value / max;
    if (intensity > 0.8) return 'bg-red-500/80';
    if (intensity > 0.6) return 'bg-orange-500/70';
    if (intensity > 0.4) return 'bg-amber-500/60';
    if (intensity > 0.2) return 'bg-yellow-500/50';
    return 'bg-green-500/40';
  };

  const funnelSteps = [
    { label: 'Landing', value: funnel.landingView, key: 'landingView' },
    { label: 'Start Wizard', value: funnel.startWizard, key: 'startWizard' },
    { label: 'Complete Wizard', value: funnel.completeWizard, key: 'completeWizard' },
    { label: 'Checkout', value: funnel.checkoutStarted, key: 'checkoutStarted' },
    { label: 'Payment Success', value: funnel.paymentSuccess, key: 'paymentSuccess' },
  ];

  const maxFunnel = Math.max(...funnelSteps.map(s => s.value), 1);

  return (
    <div ref={ref} className="space-y-6">
      {/* Page Traffic Heatmap */}
      <div>
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Page Traffic Intensity</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {pageViews.slice(0, 12).map((page, index) => {
            const intensity = page.views / maxViews;
            return (
              <motion.div
                key={page.page}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-3 rounded-lg ${getHeatColor(page.views, maxViews)} transition-all hover:scale-105`}
              >
                <p className="text-xs font-medium truncate text-foreground">
                  {page.page === '/' ? 'Home' : page.page.replace('/', '')}
                </p>
                <p className="text-lg font-bold text-foreground">{page.views}</p>
                <p className="text-xs text-foreground/70">{page.uniqueVisitors} unique</p>
              </motion.div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Low</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-green-500/40" />
            <div className="w-4 h-4 rounded bg-yellow-500/50" />
            <div className="w-4 h-4 rounded bg-amber-500/60" />
            <div className="w-4 h-4 rounded bg-orange-500/70" />
            <div className="w-4 h-4 rounded bg-red-500/80" />
          </div>
          <span>High</span>
        </div>
      </div>

      {/* Funnel Dropoff Visualization */}
      <div>
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Conversion Funnel Dropoff</h4>
        <div className="relative">
          {/* Funnel visualization */}
          <div className="flex flex-col items-center gap-1">
            {funnelSteps.map((step, index) => {
              const width = Math.max(20, (step.value / maxFunnel) * 100);
              const prevValue = index > 0 ? funnelSteps[index - 1].value : step.value;
              const dropoff = prevValue > 0 ? Math.round(((prevValue - step.value) / prevValue) * 100) : 0;
              
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                  style={{ width: `${width}%` }}
                >
                  <div 
                    className={`h-12 rounded-lg flex items-center justify-between px-3 ${
                      index === 0 ? 'bg-accent/80' : 
                      index === funnelSteps.length - 1 ? 'bg-green-500/80' : 
                      'bg-accent/60'
                    }`}
                  >
                    <span className="text-xs font-medium text-foreground truncate">{step.label}</span>
                    <span className="text-sm font-bold text-foreground">{step.value}</span>
                  </div>
                  
                  {/* Dropoff indicator */}
                  {index > 0 && dropoff > 0 && (
                    <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-xs">
                      <span className="text-destructive font-medium">-{dropoff}%</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {/* Overall conversion rate */}
          <div className="mt-4 p-3 bg-secondary/30 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Overall Conversion Rate</p>
            <p className="text-2xl font-bold text-accent">
              {funnel.landingView > 0 
                ? ((funnel.paymentSuccess / funnel.landingView) * 100).toFixed(2)
                : 0}%
            </p>
            <p className="text-xs text-muted-foreground">
              {funnel.paymentSuccess} of {funnel.landingView} visitors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
