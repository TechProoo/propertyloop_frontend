const Skeleton = ({
  className = "",
  count = 1,
}: {
  className?: string;
  count?: number;
}) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`animate-pulse rounded-2xl bg-white/60 border border-white/40 ${className}`}
      />
    ))}
  </>
);

/* ─── Preset skeletons ─── */

export const CardSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="animate-pulse bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden"
      >
        <div className="h-52 bg-border-light/60" />
        <div className="p-5 space-y-3">
          <div className="h-5 bg-border-light/60 rounded-full w-1/3" />
          <div className="h-4 bg-border-light/60 rounded-full w-3/4" />
          <div className="h-3 bg-border-light/60 rounded-full w-1/2" />
          <div className="h-px bg-border-light my-2" />
          <div className="flex gap-4">
            <div className="h-3 bg-border-light/60 rounded-full w-16" />
            <div className="h-3 bg-border-light/60 rounded-full w-16" />
            <div className="h-3 bg-border-light/60 rounded-full w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ListRowSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="divide-y divide-white/30">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-border-light/60 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-border-light/60 rounded-full w-1/3" />
          <div className="h-3 bg-border-light/60 rounded-full w-1/4" />
        </div>
        <div className="h-5 bg-border-light/60 rounded-full w-16" />
      </div>
    ))}
  </div>
);

export const StatSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="animate-pulse bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-5 space-y-3"
      >
        <div className="w-10 h-10 rounded-2xl bg-border-light/60" />
        <div className="h-6 bg-border-light/60 rounded-full w-1/3" />
        <div className="h-3 bg-border-light/60 rounded-full w-2/3" />
      </div>
    ))}
  </div>
);

export const DetailSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-80 bg-border-light/60 rounded-3xl" />
    <div className="space-y-3">
      <div className="h-8 bg-border-light/60 rounded-full w-1/3" />
      <div className="h-5 bg-border-light/60 rounded-full w-2/3" />
      <div className="h-4 bg-border-light/60 rounded-full w-1/2" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="h-16 bg-border-light/60 rounded-2xl" />
      <div className="h-16 bg-border-light/60 rounded-2xl" />
      <div className="h-16 bg-border-light/60 rounded-2xl" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-border-light/60 rounded-full w-full" />
      <div className="h-4 bg-border-light/60 rounded-full w-5/6" />
      <div className="h-4 bg-border-light/60 rounded-full w-4/6" />
    </div>
  </div>
);

export default Skeleton;
