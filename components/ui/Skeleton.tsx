type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-stone-200 ${className}`}
      aria-hidden="true"
    />
  );
}

export function RecipeCardSkeleton() {
  return (
    <article className="flex h-full flex-col rounded-lg border border-stone-200 bg-white p-4">
      <Skeleton className="mb-4 h-28 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="mt-2 h-4 w-2/3" />
      <Skeleton className="mt-3 h-5 w-16 rounded-full" />
      <Skeleton className="mt-4 h-8 w-24" />
    </article>
  );
}

export function RecipeGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <RecipeCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

export function DashboardPageSkeleton() {
  return (
    <main
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading dashboard</span>
      <section className="flex max-w-xl flex-col gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </section>
      <DashboardFiltersSkeleton />
      <DashboardFeedSkeleton />
    </main>
  );
}

export function DashboardFiltersSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-end">
      <Skeleton className="h-10 min-w-0 flex-1" />
      <Skeleton className="h-10 w-full lg:w-44" />
      <Skeleton className="h-10 w-full lg:w-40" />
      <Skeleton className="h-10 w-24" />
    </div>
  );
}

export function DashboardFeedSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <Skeleton className="h-6 w-32" />
        <RecipeGridSkeleton />
      </section>
      <section className="flex flex-col gap-4">
        <Skeleton className="h-6 w-40" />
        <RecipeGridSkeleton />
      </section>
    </div>
  );
}

export function RecipeDetailSkeleton() {
  return (
    <main
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading recipe</span>
      <header className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-4 w-56" />
      </header>
      <Skeleton className="h-56 w-full rounded-lg" />
      <section className="flex flex-col gap-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </section>
      <section className="flex flex-col gap-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </section>
      <section className="flex flex-col gap-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </section>
    </main>
  );
}

export function RecipeListSkeleton() {
  return (
    <main
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading recipes</span>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
        {Array.from({ length: 4 }, (_, index) => (
          <li
            key={index}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-48 max-w-full" />
              <Skeleton className="h-4 w-40 max-w-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export function FormPageSkeleton({
  label = "Loading form",
}: {
  label?: string;
}) {
  return (
    <main
      className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">{label}</span>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    </main>
  );
}

export function AuthPageSkeleton() {
  return (
    <main
      className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading</span>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </main>
  );
}

export function SiteHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-20" />
      <Skeleton className="h-9 w-28" />
    </div>
  );
}
