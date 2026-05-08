"use client";

import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useApprovals } from "../../../hooks/useApprovals";
import { ApprovalBadge, ScheduleBadge } from "../../../components/StatusBadge";
import { EmptyState, ErrorState } from "../../../components/EmptyState";
import Img from "../../../components/Img";
import { Check, X, User, Clock, Calendar, MessageSquare, AlertCircle, Loader2, CheckCircle, Eye } from "lucide-react";
import { toast } from "sonner";

function PreviewModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative aspect-video bg-gray-900">
            <Img src={item.fileUrl} alt={item.title} className="w-full h-full object-contain" />
          </div>
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{item.title}</p>
              <p className="text-sm text-gray-500">{item.subject} · {item.teacherName}</p>
            </div>
            <button onClick={onClose} className="btn-secondary shrink-0">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RejectModal({ item, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");
  const handleSubmit = () => {
    if (!reason.trim()) { toast.error("Rejection reason is required."); return; }
    onConfirm(reason);
  };
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <X size={16} className="text-red-600" />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900">Reject Content</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
              <Img src={item.fileUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 truncate">{item.title}</p>
              <p className="text-[12px] text-gray-500">{item.subject} · {item.teacherName}</p>
            </div>
          </div>
        </div>
        <div className="px-6 pt-4">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
            <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-800 leading-relaxed">
              This feedback will be sent to the teacher so they can improve their submission.
            </p>
          </div>
          <div className="mb-5">
            <label className="flex items-center gap-2 text-[13px] font-medium text-gray-700 mb-2">
              <MessageSquare size={13} /> Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this content is being rejected..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] text-gray-900 resize-none outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <p className="text-[11px] text-gray-400 mt-1">{reason.length} characters</p>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading || !reason.trim()}
            className="btn-danger flex-1"
            style={{ opacity: loading || !reason.trim() ? 0.6 : 1, cursor: loading || !reason.trim() ? "not-allowed" : "pointer" }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <><X size={14} /> Send Feedback</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentCard({ item, onApprove, onReject, onPreview, actionLoading }) {
  return (
    <div className="card overflow-hidden flex flex-col group hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden cursor-pointer" onClick={() => onPreview(item)}>
        <Img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-gray-800">
            <Eye size={13} /> Preview
          </div>
        </div>
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <ApprovalBadge status="pending" />
        </div>
        <div className="absolute top-2.5 right-2.5">
          <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1">{item.subject}</p>
          <h3 className="text-[14px] font-bold text-gray-900 leading-snug line-clamp-2">{item.title}</h3>
        </div>
        <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 flex-1">{item.description}</p>
        <div className="flex flex-col gap-1.5 pt-1 border-t border-gray-100">
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <User size={11} className="shrink-0" />
            <span className="font-medium text-gray-600">{item.teacherName}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <Calendar size={11} className="shrink-0" />
            <span>{new Date(item.startTime).toLocaleDateString([], { dateStyle: "medium" })}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <Clock size={11} className="shrink-0" />
            <span>
              {new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              {" – "}
              {new Date(item.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onApprove(item.id)}
            disabled={actionLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <><Check size={13} /> Approve</>}
          </button>
          <button
            onClick={() => onReject(item)}
            disabled={actionLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 text-[12px] font-semibold rounded-lg border border-gray-200 hover:border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={13} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonContentCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-2.5 bg-gray-100 rounded w-1/4" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="pt-2 space-y-1.5">
          <div className="h-2.5 bg-gray-100 rounded w-1/2" />
          <div className="h-2.5 bg-gray-100 rounded w-2/5" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="flex-1 h-8 bg-gray-100 rounded-lg" />
          <div className="flex-1 h-8 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function PendingApprovals() {
  const { data: items, loading, error, actionLoading, approve, reject, refetch } = useApprovals();
  const [rejectTarget, setRejectTarget]   = useState(null);
  const [previewTarget, setPreviewTarget] = useState(null);

  const handleApprove = async (id) => {
    try { await approve(id); toast.success("Content approved!"); }
    catch (err) { toast.error(err.message); }
  };

  const handleRejectConfirm = async (reason) => {
    try {
      await reject(rejectTarget.id, reason);
      toast.success("Rejected with feedback.");
      setRejectTarget(null);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Pending Approvals</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              {loading ? "Loading..." : `${items.length} item${items.length !== 1 ? "s" : ""} awaiting review`}
            </p>
          </div>
          {items.length > 0 && <span className="badge-pending text-[13px] px-3 py-1">{items.length} pending</span>}
        </div>

        {error && <ErrorState message={error} onRetry={refetch} />}

        {!error && loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonContentCard key={i} />)}
          </div>
        )}

        {!error && !loading && items.length === 0 && (
          <EmptyState icon={CheckCircle} title="All caught up!" message="No pending content to review right now." />
        )}

        {!error && !loading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onApprove={handleApprove}
                onReject={setRejectTarget}
                onPreview={setPreviewTarget}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>

      <PreviewModal item={previewTarget} onClose={() => setPreviewTarget(null)} />
      <RejectModal item={rejectTarget} onClose={() => setRejectTarget(null)} onConfirm={handleRejectConfirm} loading={actionLoading} />
    </DashboardLayout>
  );
}
