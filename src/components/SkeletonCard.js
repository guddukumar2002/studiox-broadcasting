import PropTypes from "prop-types";

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-100" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

// Matches the 5-column All Content table: Content | Teacher | Schedule | Status | Timing
export function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex-shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-2.5 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-24" /></td>
      <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-20" /></td>
      <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-20" /></td>
      <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-16" /></td>
    </tr>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="card p-5 animate-pulse flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-6 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  );
}

// PropTypes — optional per doc but listed as good practice
SkeletonCard.propTypes = {};
SkeletonRow.propTypes = {};
SkeletonStatCard.propTypes = {};
