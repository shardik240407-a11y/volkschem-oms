import { Loader2 } from 'lucide-react';

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={40} className="text-primary animate-spin" />
        <p className="text-text-secondary text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

export function InlineLoader({ size = 20, text }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Loader2 size={size} className="text-primary animate-spin" />
      {text && <span className="text-text-secondary text-sm">{text}</span>}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="space-y-3 p-4">
      {/* Header skeleton */}
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton h-4 flex-1 rounded" />
        ))}
      </div>
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="skeleton h-3 flex-1 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default FullPageLoader;
