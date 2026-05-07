"use client";

import { useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherContent } from "../../../hooks/useContent";
import { SkeletonCard } from "../../../components/SkeletonCard";
import { ApprovalBadge, ScheduleBadge } from "../../../components/StatusBadge";
import { EmptyState, ErrorState } from "../../../components/EmptyState";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function MyContentPage() {
  const { user } = useAuth();
  const { data: content, loading, error, refetch } = useTeacherContent(user?.id);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      const matchesFilter = filter === "all" || item.status === filter;
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [content, filter, search]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">My Broadcasts</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage and monitor your uploaded lessons.</p>
          </div>
          <Link
            href="/teacher/upload"
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-center w-fit"
          >
            Upload New
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search your lessons..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "approved", "pending", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                  filter === s
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && <ErrorState message={error} onRetry={refetch} />}

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredContent.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={item.fileUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-4 right-4">
                        <ApprovalBadge status={item.status} />
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            {item.subject}
                          </span>
                          <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>

                        <div className="pt-2 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            Starts: {new Date(item.startTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <Clock className="w-4 h-4 text-slate-400" />
                            Ends: {new Date(item.endTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                          </div>
                        </div>
                      </div>

                      {item.status === "approved" && (
                        <div className="mt-6 pt-6 border-t border-slate-50">
                          <Link
                            href={`/live/${user?.id}`}
                            className="w-full py-3 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all group/btn"
                          >
                            View in Live Room
                            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                          </Link>
                        </div>
                      )}

                      {item.status === "rejected" && (
                        <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-100">
                          <div className="flex items-center gap-2 text-red-600 font-bold text-xs mb-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Rejection Feedback:
                          </div>
                          <p className="text-xs text-red-500 italic">"{item.rejectionReason}"</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {!loading && filteredContent.length === 0 && (
              <EmptyState
                title="No content found"
                message="Try adjusting your filters or upload new content."
                icon={Search}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
