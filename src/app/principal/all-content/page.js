"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAllContent } from "../../../hooks/useContent";
import { ApprovalBadge, ScheduleBadge } from "../../../components/StatusBadge";
import { SkeletonRow } from "../../../components/SkeletonCard";
import { EmptyState, ErrorState } from "../../../components/EmptyState";
import Img from "../../../components/Img";
import { Search, User, Calendar, Clock, Inbox, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";

const PAGE_SIZE = 20;

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
          <div className="p-4 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <ApprovalBadge status={item.status} />
                <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
              </div>
              <p className="font-bold text-gray-900 text-[15px]">{item.title}</p>
              <p className="text-[13px] text-gray-500 mt-0.5">{item.subject} · {item.teacherName}</p>
              <p className="text-[12px] text-gray-400 mt-2 leading-relaxed">{item.description}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors shrink-0">
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Thumbnail({ item, onPreview }) {
  return (
    <div
      className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer group shrink-0"
      onClick={() => onPreview(item)}
    >
      <Img src={item.fileUrl} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        <Eye size={12} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

export default function AllContentPage() {
  const { data: content, loading, error, refetch } = useAllContent();
  const [search, setSearch]   = useState("");
  const [status, setStatus]   = useState("all");
  const [page, setPage]       = useState(1);
  const [preview, setPreview] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return content.filter((item) => {
      const matchSearch = item.title.toLowerCase().includes(q) || item.teacherName.toLowerCase().includes(q) || item.subject.toLowerCase().includes(q);
      const matchStatus = status === "all" || item.status === status;
      return matchSearch && matchStatus;
    });
  }, [content, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = useMemo(() => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE), [filtered, safePage]);

  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleStatus = (val) => { setStatus(val); setPage(1); };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">

        {/* Header */}
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">All Content</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {loading ? "Loading..." : `${filtered.length} of ${content.length} submissions`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, teacher or subject..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-900 outline-none bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <select
            value={status}
            onChange={(e) => handleStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white outline-none cursor-pointer focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {error && <ErrorState message={error} onRetry={refetch} />}

        {!error && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ minWidth: "580px" }}>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Content", "Teacher", "Date", "Status", "Schedule"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <EmptyState icon={Inbox} title="No records found" message="Try adjusting your search or filter." />
                      </td>
                    </tr>
                  ) : paginated.map((item, i) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors"
                      style={{ borderBottom: i < paginated.length - 1 ? "1px solid #F3F4F6" : "none" }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Thumbnail item={item} onPreview={setPreview} />
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-gray-900 truncate max-w-[160px]">{item.title}</p>
                            <p className="text-[11px] text-blue-600 font-medium mt-0.5">{item.subject}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <User size={11} className="text-gray-400" />
                          </div>
                          <span className="text-[13px] text-gray-700 whitespace-nowrap">{item.teacherName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-[12px] text-gray-500 whitespace-nowrap">
                          <Calendar size={11} className="text-gray-400" />
                          {new Date(item.startTime).toLocaleDateString([], { dateStyle: "medium" })}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5 pl-4 whitespace-nowrap">
                          <Clock size={10} />
                          {new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {" – "}
                          {new Date(item.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="px-4 py-3"><ApprovalBadge status={item.status} /></td>
                      <td className="px-4 py-3"><ScheduleBadge startTime={item.startTime} endTime={item.endTime} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && filtered.length > PAGE_SIZE && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 flex-wrap gap-3">
                <span className="text-[12px] text-gray-500">
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] font-medium bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={13} /> Prev
                  </button>
                  <span className="px-3 py-1.5 text-[12px] font-semibold text-gray-700">{safePage} / {totalPages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] font-medium bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <PreviewModal item={preview} onClose={() => setPreview(null)} />
    </DashboardLayout>
  );
}
