import PropTypes from "prop-types";

export function ApprovalBadge({ status }) {
  const map = {
    approved: "badge-approved",
    rejected: "badge-rejected",
    pending:  "badge-pending",
  };
  const dots = { approved: "#059669", rejected: "#DC2626", pending: "#D97706" };
  return (
    <span className={map[status] || "badge-pending"}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: dots[status] || dots.pending, flexShrink: 0 }} />
      {status}
    </span>
  );
}

ApprovalBadge.propTypes = {
  status: PropTypes.oneOf(["approved", "rejected", "pending"]).isRequired,
};

export function ScheduleBadge({ startTime, endTime }) {
  const now   = new Date();
  const start = new Date(startTime);
  const end   = new Date(endTime);
  if (now < start) return <span className="badge-scheduled">Scheduled</span>;
  if (now <= end)  return <span className="badge-active"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Active</span>;
  return <span className="badge-expired">Expired</span>;
}

ScheduleBadge.propTypes = {
  startTime: PropTypes.string.isRequired,
  endTime:   PropTypes.string.isRequired,
};
