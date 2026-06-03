export default function Loading() {
  return (
    <main className="min-h-screen bg-primary">
      <div className="max-w-7xl mx-auto px-5 pt-6">
        <div className="h-6 w-32 bg-light-100/10 rounded animate-pulse mb-8" />
      </div>

      <div className="max-w-7xl mx-auto px-5 pt-14 pb-10 flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Poster skeleton */}
        <div className="w-52 md:w-64 h-96 bg-light-100/10 rounded-2xl animate-pulse shrink-0 mx-auto md:mx-0" />

        {/* Info skeleton */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-light-100/10 rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-light-100/10 rounded-full animate-pulse" />
          </div>
          <div className="h-12 w-3/4 bg-light-100/10 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-light-100/10 rounded animate-pulse" />
          <div className="h-4 w-full bg-light-100/10 rounded animate-pulse" />
          <div className="h-4 w-full bg-light-100/10 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-light-100/10 rounded animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-light-100/10 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
