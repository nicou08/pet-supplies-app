import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column — image gallery */}
        <div className="space-y-4">
          <div className="w-full py-6 flex justify-center">
            <Skeleton className="w-full max-w-xs sm:max-w-md md:max-w-lg h-72 sm:h-80 md:h-[550px] rounded-lg" />
          </div>
          <div className="flex gap-2 overflow-x-auto py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="flex-shrink-0 w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Right column — product info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-5 h-5 rounded-sm" />
              ))}
            </div>
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <Skeleton className="h-8 w-28 rounded" />
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Skeleton className="h-4 w-24 rounded flex-shrink-0" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-4/6 rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
          <div className="h-4" />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <Skeleton className="h-10 flex-1 max-w-72 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
