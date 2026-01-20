import { Skeleton } from '@/components/ui/skeleton';

export function WizardSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="container-narrow section-padding">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="h-6 w-32 mx-auto mb-3" />
          <Skeleton className="h-10 w-64 mx-auto mb-2" />
          <Skeleton className="h-5 w-80 mx-auto" />
        </div>

        {/* Stepper skeleton */}
        <div className="flex justify-center gap-2 mb-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-full" />
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr,360px] gap-8">
          {/* Form skeleton */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid gap-4">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <Skeleton className="h-6 w-36 mb-4" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Order summary skeleton */}
          <div className="hidden lg:block">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4 sticky top-24">
              <Skeleton className="h-6 w-28 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="pt-4 border-t border-border">
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
