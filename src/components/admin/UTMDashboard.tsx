import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, MousePointerClick, Target } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface StoredEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
}

interface UTMData {
  source: string;
  medium: string;
  campaign: string;
  visits: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
}

interface UTMDashboardProps {
  events: StoredEvent[];
}

export function UTMDashboard({ events }: UTMDashboardProps) {
  const utmData = useMemo(() => {
    const campaignMap = new Map<string, {
      visits: Set<string>;
      conversions: number;
      revenue: number;
      source: string;
      medium: string;
    }>();

    events.forEach(e => {
      const props = e.properties;
      const utmSource = (props.utm_source as string) || '';
      const utmMedium = (props.utm_medium as string) || '';
      const utmCampaign = (props.utm_campaign as string) || '';
      const sessionId = (props.session_id as string) || 'unknown';
      
      // Skip if no UTM data
      if (!utmSource && !utmMedium && !utmCampaign) return;
      
      const key = `${utmSource}|${utmMedium}|${utmCampaign}`;
      
      if (!campaignMap.has(key)) {
        campaignMap.set(key, {
          visits: new Set(),
          conversions: 0,
          revenue: 0,
          source: utmSource || 'direct',
          medium: utmMedium || 'none',
        });
      }
      
      const data = campaignMap.get(key)!;
      
      // Count unique visits
      if (e.event === '$pageview' || e.event === 'page_view' || e.event === 'LANDING_VIEW') {
        data.visits.add(sessionId);
      }
      
      // Count conversions (payment success or wizard complete)
      if (e.event === 'PAYMENT_SUCCESS' || e.event === 'CHECKOUT_COMPLETE') {
        data.conversions++;
        // Estimate revenue from payment amount if available
        const amount = (props.amount as number) || 0;
        data.revenue += amount;
      }
      
      // Also count campaign CTA clicks
      if (e.event === 'campaign_cta_click') {
        data.visits.add(sessionId);
      }
    });

    const result: UTMData[] = Array.from(campaignMap.entries())
      .map(([key, data]) => {
        const [source, medium, campaign] = key.split('|');
        const visits = data.visits.size;
        return {
          source: source || 'direct',
          medium: medium || 'none',
          campaign: campaign || '(not set)',
          visits,
          conversions: data.conversions,
          conversionRate: visits > 0 ? (data.conversions / visits) * 100 : 0,
          revenue: data.revenue,
        };
      })
      .filter(d => d.visits > 0)
      .sort((a, b) => b.visits - a.visits);

    return result;
  }, [events]);

  // Calculate totals
  const totals = useMemo(() => {
    return utmData.reduce(
      (acc, d) => ({
        visits: acc.visits + d.visits,
        conversions: acc.conversions + d.conversions,
        revenue: acc.revenue + d.revenue,
      }),
      { visits: 0, conversions: 0, revenue: 0 }
    );
  }, [utmData]);

  const overallConversionRate = totals.visits > 0 
    ? ((totals.conversions / totals.visits) * 100).toFixed(2) 
    : '0';

  if (utmData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No UTM-tagged traffic yet</p>
        <p className="text-sm mt-2">
          Add utm_source, utm_medium, utm_campaign to your ad URLs to track campaigns
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-accent/10 border border-accent/20"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <MousePointerClick className="w-4 h-4" />
            Campaign Visits
          </div>
          <p className="text-2xl font-bold">{totals.visits}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 rounded-lg bg-green-500/10 border border-green-500/20"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
            Conversions
          </div>
          <p className="text-2xl font-bold text-green-500">{totals.conversions}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Target className="w-4 h-4" />
            Conversion Rate
          </div>
          <p className="text-2xl font-bold text-amber-500">{overallConversionRate}%</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-lg bg-primary/10 border border-primary/20"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <ExternalLink className="w-4 h-4" />
            Active Campaigns
          </div>
          <p className="text-2xl font-bold">{utmData.length}</p>
        </motion.div>
      </div>

      {/* Campaign Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Medium</TableHead>
              <TableHead className="text-right">Visits</TableHead>
              <TableHead className="text-right">Conversions</TableHead>
              <TableHead className="text-right">Conv. Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {utmData.slice(0, 10).map((row, index) => (
              <motion.tr
                key={`${row.source}-${row.medium}-${row.campaign}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <TableCell className="font-medium">
                  {row.campaign === '(not set)' ? (
                    <span className="text-muted-foreground italic">(not set)</span>
                  ) : (
                    row.campaign
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {row.source}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {row.medium}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{row.visits}</TableCell>
                <TableCell className="text-right">
                  <span className={row.conversions > 0 ? 'text-green-500 font-medium' : ''}>
                    {row.conversions}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={row.conversionRate > 5 ? 'text-amber-500 font-medium' : ''}>
                    {row.conversionRate.toFixed(1)}%
                  </span>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {utmData.length > 10 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing top 10 of {utmData.length} campaigns
        </p>
      )}
    </div>
  );
}
