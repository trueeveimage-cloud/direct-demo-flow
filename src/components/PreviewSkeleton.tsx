import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export function PreviewSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full rounded-lg overflow-hidden shadow-2xl border border-border/50"
    >
      {/* Browser Chrome */}
      <div className="bg-muted/50 px-3 py-2 flex items-center gap-2 border-b border-border/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/50 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/50 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-green-400/50 animate-pulse" />
        </div>
        <div className="flex-1 mx-4">
          <Skeleton className="h-6 w-full rounded-md" />
        </div>
      </div>

      {/* Website Preview Skeleton */}
      <div className="bg-background h-[500px] p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-12 hidden sm:block" />
            <Skeleton className="h-4 w-12 hidden sm:block" />
            <Skeleton className="h-4 w-12 hidden sm:block" />
          </div>
        </div>

        {/* Hero */}
        <div className="text-center space-y-4 py-6">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-10 w-32 mx-auto rounded-md" />
          <div className="flex justify-center gap-1 pt-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-3 h-3 rounded-full" />
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-20" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-8 rounded" />
            <Skeleton className="h-8 rounded" />
            <Skeleton className="h-8 rounded" />
            <Skeleton className="h-8 rounded" />
          </div>
        </div>

        {/* Booking */}
        <div className="space-y-3 p-4 border rounded-xl">
          <Skeleton className="h-5 w-28" />
          <div className="grid grid-cols-7 gap-1">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-6 rounded" />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 rounded" />
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-4 pt-4 border-t">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </motion.div>
  );
}
