import { motion, AnimatePresence } from 'framer-motion';
import { Users, Monitor, Smartphone, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LiveVisitorCounterProps {
  visitorCount: number;
  visitorsByPage: Record<string, number>;
  visitorsByDevice: Record<string, number>;
}

export function LiveVisitorCounter({ 
  visitorCount, 
  visitorsByPage, 
  visitorsByDevice 
}: LiveVisitorCounterProps) {
  const sortedPages = Object.entries(visitorsByPage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <div className="relative">
            <Users className="w-5 h-5 text-accent" />
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
          Live Visitors
          <Badge variant="outline" className="ml-auto bg-green-500/20 text-green-400 border-green-500/50">
            <motion.span
              key={visitorCount}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {visitorCount}
            </motion.span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main counter */}
        <div className="text-center py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={visitorCount}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-5xl font-bold text-accent"
            >
              {visitorCount}
            </motion.div>
          </AnimatePresence>
          <p className="text-sm text-muted-foreground mt-1">
            {visitorCount === 1 ? 'person' : 'people'} on site right now
          </p>
        </div>

        {/* Device breakdown */}
        {Object.keys(visitorsByDevice).length > 0 && (
          <div className="flex justify-center gap-6 py-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm">
              <Monitor className="w-4 h-4 text-muted-foreground" />
              <span>{visitorsByDevice.desktop || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <span>{(visitorsByDevice.mobile || 0) + (visitorsByDevice.tablet || 0)}</span>
            </div>
          </div>
        )}

        {/* Current pages */}
        {sortedPages.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Currently viewing
            </p>
            <div className="space-y-1">
              {sortedPages.map(([page, count]) => (
                <motion.div
                  key={page}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center justify-between text-sm bg-secondary/30 rounded px-2 py-1"
                >
                  <span className="truncate text-muted-foreground">
                    {page === '/' ? 'Home' : page}
                  </span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {count}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {visitorCount === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            No active visitors at the moment
          </p>
        )}
      </CardContent>
    </Card>
  );
}
