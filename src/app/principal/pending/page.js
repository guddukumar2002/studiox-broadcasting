"use client";

import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useApprovals } from "../../../hooks/useApprovals";
import { SkeletonCard } from "../../../components/SkeletonCard";
import { EmptyState, ErrorState } from "../../../components/EmptyState";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Calendar, User, Clock, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PendingApprovals() {
  const { data: items, loading, error, actionLoading, approve, reject } = useApprovals();
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApprove = async (id) => {
    try {
      await approve(id);
      toast.success("Content approved successfully!");
    } catch (err) {
      toast.error(err.message || "Approval failed.");
    }
  };

  const openRejectModal = (item) => {
    setSelectedItem(item);
    setRejectionReason("");
    setIsModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    try {
      await reject(selectedItem.id, rejectionReason);
      toast.success("Content rejected with feedback.");
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (err) {
      toast.error(err.message || "Rejection failed.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Pending Approvals</h1>
          <p className="text-slate-500 mt-1 font-medium">Review submitted content before it goes live.</p>
        </div>

        {error && <ErrorState message={error} />}

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 animate-pulse flex gap-8">
                <div className="w-56 aspect-video rounded-3xl bg-slate-100 flex-shrink-0" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-3 bg-slate-100 rounded-full w-1/4" />
                  <div className="h-6 bg-slate-100 rounded-full w-3/4" />
                  <div className="h-4 bg-slate-100 rounded-full w-full" />
                  <div className="h-4 bg-slate-100 rounded-full w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 && !error ? (
          <div className="bg-white p-20 rounded-[4rem] border border-slate-100 text-center flex flex-col items-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
              <Check className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">All Caught Up!</h2>
            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
              There are no pending requests. You've cleared the entire queue!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center group hover:border-blue-200 transition-all"
                >
                  <div className="w-full md:w-56 aspect-video rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 shadow-inner">
                    <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>

                  <div className="flex-1 space-y-4 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        {item.subject}
                      </span>
                      <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> {item.teacherName}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 truncate">{item.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-6 pt-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.startTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                        <Clock className="w-4 h-4" />
                        {new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                        {new Date(item.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleApprove(item.id)}
                      disabled={actionLoading}
                      className="flex-1 md:w-36 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Approve</>}
                    </button>
                    <button
                      onClick={() => openRejectModal(item)}
                      disabled={actionLoading}
                      className="flex-1 md:w-36 py-3 rounded-2xl bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-100 hover:border-red-100 font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Rejection Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">Rejection Feedback</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-amber-900">Why are you rejecting this?</p>
                      <p className="text-xs text-amber-700 mt-1">
                        This feedback will be sent directly to the teacher so they can correct it.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                      <MessageSquare className="w-4 h-4 text-blue-600" /> Rejection Reason
                    </label>
                    <textarea
                      rows="5"
                      className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-5 px-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all resize-none"
                      placeholder="e.g. Please use a higher resolution image for the preview..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="flex-1 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Feedback"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
