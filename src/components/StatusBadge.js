/**
 * StatusBadge.js
 * Shows approval status (pending/approved/rejected) AND scheduling status (scheduled/active/expired).
 */

export function ApprovalBadge({ status }) {
  const styles = {
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-red-50 text-red-600 border-red-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
  };
  const dots = {
    approved: "bg-emerald-600",
    rejected: "bg-red-600",
    pending: "bg-amber-600",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status] || styles.pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || dots.pending}`} />
      {status}
    </span>
  );
}

export function ScheduleBadge({ startTime, endTime }) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  let label, style;
  if (now < start) {
    label = "Scheduled";
    style = "bg-blue-50 text-blue-600 border-blue-100";
  } else if (now >= start && now <= end) {
    label = "Active";
    style = "bg-emerald-50 text-emerald-600 border-emerald-100";
  } else {
    label = "Expired";
    style = "bg-slate-100 text-slate-500 border-slate-200";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${style}`}>
      {label === "Active" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
      {label}
    </span>
  );
}
