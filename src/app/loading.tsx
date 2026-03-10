
import { Skeleton } from "@/components/ui/skeleton";
import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-start py-12 px-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] opacity-20" />
      </div>

      {/* Header Skeleton */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-muted rounded-xl animate-pulse" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <div className="w-full max-w-5xl space-y-8">
        <Skeleton className="h-[400px] w-full rounded-2xl border border-white/5" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}
