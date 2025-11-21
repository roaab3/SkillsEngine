/**
 * Loading Skeleton Component
 * Beautiful loading states with shimmer effect
 */

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-fade-in">
      {/* Header Skeleton */}
      <div className="h-20 glass dark:glass-dark border-b border-gray-200 dark:border-slate-700" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section Skeleton */}
        <div className="space-y-4 mb-8 animate-pulse">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded shimmer animate-shimmer" />
          <div className="h-10 w-96 bg-slate-200 dark:bg-slate-700 rounded shimmer animate-shimmer" />
          <div className="h-6 w-full max-w-2xl bg-slate-200 dark:bg-slate-700 rounded shimmer animate-shimmer" />
        </div>

        {/* Stats Overview Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse"
            >
              <div className="p-6 space-y-3">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded shimmer animate-shimmer" />
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded shimmer animate-shimmer" />
                <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded shimmer animate-shimmer" />
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar Skeleton */}
        <div className="h-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8 animate-pulse" />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Competency Cards Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="h-1 bg-slate-200 dark:bg-slate-700 shimmer animate-shimmer" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full shimmer animate-shimmer" />
                      <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full shimmer animate-shimmer" />
                    </div>
                    <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded shimmer animate-shimmer" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full shimmer animate-shimmer" />
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded shimmer animate-shimmer" />
                      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded shimmer animate-shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Gap Sidebar Skeleton */}
          <div className="w-full lg:w-96 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded shimmer animate-shimmer" />
                <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl shimmer animate-shimmer" />
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full shimmer animate-shimmer flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded shimmer animate-shimmer" />
                    <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded shimmer animate-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
