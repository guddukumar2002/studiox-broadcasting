export function SkeletonCard() {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-video bg-slate-100" />
      <div className="p-6 space-y-3">
        <div className="h-3 bg-slate-100 rounded-full w-1/3" />
        <div className="h-5 bg-slate-100 rounded-full w-3/4" />
        <div className="h-3 bg-slate-100 rounded-full w-full" />
        <div className="h-3 bg-slate-100 rounded-full w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-100 rounded-full w-3/4" />
            <div className="h-3 bg-slate-100 rounded-full w-1/3" />
          </div>
        </div>
      </td>
      <td className="px-8 py-5"><div className="h-4 bg-slate-100 rounded-full w-24" /></td>
      <td className="px-8 py-5"><div className="h-4 bg-slate-100 rounded-full w-28" /></td>
      <td className="px-8 py-5"><div className="h-6 bg-slate-100 rounded-full w-20" /></td>
      <td className="px-8 py-5"><div className="h-6 bg-slate-100 rounded-full w-8 ml-auto" /></td>
    </tr>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm animate-pulse flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-slate-100 rounded-full w-1/2" />
        <div className="h-7 bg-slate-100 rounded-full w-1/3" />
      </div>
    </div>
  );
}
