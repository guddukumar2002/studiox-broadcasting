"use client";

import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useApprovals } from "../../../hooks/useApprovals";
import { ApprovalBadge, ScheduleBadge } from "../../../components/StatusBadge";
import { Check, X, Calendar, Clock, User, MessageSquare, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function PendingApprovals() {
  const { data: items, loading, error, actionLoading, approve, reject, refetch } = useApprovals();
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("");
  const [modal, setModal] = useState(false);

  const handleApprove = async (id) => {
    try { await approve(id); toast.success("Content approved!"); }
    catch (err) { toast.error(err.message); }
  };

  const openReject = (item) => { setSelected(item); setReason(""); setModal(true); };

  const handleReject = async () => {
    if (!reason.trim()) { toast.error("Reason is required."); return; }
    try {
      await reject(selected.id, reason);
      toast.success("Rejected with feedback.");
      setModal(false);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>Pending Approvals</h1>
          <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>Review and action submitted content</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={15} color="#EF4444" />
            <span style={{ fontSize: "13px", color: "#DC2626" }}>{error}</span>
            <button onClick={refetch} style={{ marginLeft: "auto", fontSize: "12px", color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "20px", display: "flex", gap: "20px" }}>
                <div style={{ width: "160px", aspectRatio: "16/9", background: "#F3F4F6", borderRadius: "8px", flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}>
                  <div style={{ height: "10px", background: "#F3F4F6", borderRadius: "4px", width: "25%" }} />
                  <div style={{ height: "16px", background: "#F3F4F6", borderRadius: "4px", width: "70%" }} />
                  <div style={{ height: "10px", background: "#F3F4F6", borderRadius: "4px", width: "100%" }} />
                  <div style={{ height: "10px", background: "#F3F4F6", borderRadius: "4px", width: "50%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 && !error ? (
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", background: "#ECFDF5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
              <CheckCircle size={24} color="#059669" />
            </div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#111827" }}>All caught up!</p>
            <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "4px" }}>No pending content to review</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {items.map(item => (
              <div key={item.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "20px", display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

                {/* Thumbnail */}
                <div style={{ width: "160px", aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden", background: "#F3F4F6", flexShrink: 0, border: "1px solid #E5E7EB" }}>
                  <img src={item.fileUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <ApprovalBadge status="pending" />
                    <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{item.title}</h3>
                  <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "12px", color: "#9CA3AF" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><User size={12} /> {item.teacherName}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Calendar size={12} /> {new Date(item.startTime).toLocaleDateString()}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12} />
                      {new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {new Date(item.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0, width: "120px" }}>
                  <button
                    onClick={() => handleApprove(item.id)}
                    disabled={actionLoading}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px 12px", background: "#059669", color: "#fff", fontSize: "13px", fontWeight: 600, borderRadius: "7px", border: "none", cursor: actionLoading ? "not-allowed" : "pointer", opacity: actionLoading ? 0.6 : 1 }}
                  >
                    {actionLoading ? <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} /> : <><Check size={13} /> Approve</>}
                  </button>
                  <button
                    onClick={() => openReject(item)}
                    disabled={actionLoading}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px 12px", background: "#fff", color: "#374151", fontSize: "13px", fontWeight: 600, borderRadius: "7px", border: "1px solid #E5E7EB", cursor: actionLoading ? "not-allowed" : "pointer", opacity: actionLoading ? 0.6 : 1 }}
                  >
                    <X size={13} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => setModal(false)} />
          <div style={{ position: "relative", width: "100%", maxWidth: "440px", background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>Reject Content</h3>
              <button onClick={() => setModal(false)} style={{ padding: "4px", borderRadius: "6px", border: "none", background: "transparent", cursor: "pointer", color: "#9CA3AF" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "12px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "8px", display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "16px" }}>
              <AlertCircle size={15} color="#D97706" style={{ flexShrink: 0, marginTop: "1px" }} />
              <p style={{ fontSize: "12px", color: "#92400E" }}>This feedback will be visible to the teacher so they can improve their submission.</p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
                <MessageSquare size={13} /> Rejection Reason <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <textarea
                rows={4}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Explain why this content is being rejected..."
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", color: "#111827", resize: "none", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: "9px", background: "#F9FAFB", color: "#374151", fontSize: "13px", fontWeight: 600, borderRadius: "7px", border: "1px solid #E5E7EB", cursor: "pointer" }}>
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px", background: "#DC2626", color: "#fff", fontSize: "13px", fontWeight: 600, borderRadius: "7px", border: "none", cursor: actionLoading ? "not-allowed" : "pointer", opacity: actionLoading ? 0.6 : 1 }}
              >
                {actionLoading ? <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} /> : "Send Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}
