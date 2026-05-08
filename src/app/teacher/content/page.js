"use client";

import { useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherContent } from "../../../hooks/useContent";
import { ApprovalBadge, ScheduleBadge } from "../../../components/StatusBadge";
import { SkeletonCard } from "../../../components/SkeletonCard";
import { EmptyState, ErrorState } from "../../../components/EmptyState";
import Img from "../../../components/Img";
import { Search, Plus, Calendar, Clock, AlertCircle, ExternalLink, Inbox } from "lucide-react";
import Link from "next/link";

export default function MyContentPage() {
  const { user } = useAuth();
  const { data: content, loading, error, refetch } = useTeacherContent(user?.id);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => content.filter((item) => {
    const matchFilter = filter === "all" || item.status === filter;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  }), [content, filter, search]);

  const filters = ["all", "approved", "pending", "rejected"];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Content</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">{content.length} total uploads</p>
          </div>
          <Link href="/teacher/upload" className="btn-primary">
            <Plus size={14} /> Upload New
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-900 outline-none bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-600 capitalize border transition-colors ${
                  filter === f
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
                style={{ fontWeight: 600 }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && <ErrorState message={error} onRetry={refetch} />}

        {/* Grid */}
        {!error && (
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No content found"
              message={search || filter !== "all" ? "Try a different filter or search term." : "Upload your first content to get started."}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <div key={item.id} className="card overflow-hidden flex flex-col">

                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <Img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 right-2.5">
                      <ApprovalBadge status={item.status} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">{item.subject}</p>
                        <h3 className="text-[14px] font-bold text-gray-900 mt-0.5 truncate">{item.title}</h3>
                      </div>
                      <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
                    </div>

                    <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 flex-1">{item.description}</p>

                    <div className="flex flex-col gap-1 pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Calendar size={11} />
                        <span>Start: {new Date(item.startTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Clock size={11} />
                        <span>End: {new Date(item.endTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                      </div>
                    </div>

                    {item.status === "approved" && (
                      <Link href={`/live/${user?.id}`} className="flex items-center justify-center gap-1.5 py-2 bg-blue-50 text-blue-600 text-[12px] font-semibold rounded-lg hover:bg-blue-100 transition-colors mt-auto">
                        View Live <ExternalLink size={11} />
                      </Link>
                    )}

                    {item.status === "rejected" && item.rejectionReason && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-lg mt-auto">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600 mb-1">
                          <AlertCircle size={11} /> Rejection reason
                        </div>
                        <p className="text-[11px] text-red-500 italic">"{item.rejectionReason}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
}
