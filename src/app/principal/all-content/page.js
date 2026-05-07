"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAllContent } from "../../../hooks/useContent";
import { SkeletonRow } from "../../../components/SkeletonCard";
import { ApprovalBadge, ScheduleBadge } from "../../../components/StatusBadge";
import { EmptyState, ErrorState } from "../../../components/EmptyState";
import { Search, Calendar, User, ArrowUpDown, MoreVertical } from "lucide-react";

export default function AllContentPage() {
  const { data: content, loading, error, refetch } = useAllContent();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.teacherName.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q);
      const matchesStatus = filterStatus === "all" || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [content, searchQuery, filterStatus]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Content Inventory</h1>
            <p className="text-slate-500 mt-1 font-medium">History of all uploads and their current statuses.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, teacher or subject..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all appearance-none min-w-[160px] shadow-sm cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {error && <ErrorState message={error} onRetry={refetch} />}

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                      Content Details <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Teacher</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Approval</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timing</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
                ) : (
                  filteredContent.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 shadow-inner">
                            <img src={item.fileUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">{item.subject}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                            <User className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <span className="text-sm text-slate-600 font-medium">{item.teacherName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 font-bold flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                            {new Date(item.startTime).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium ml-5">
                            {new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                            {new Date(item.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <ApprovalBadge status={item.status} />
                      </td>
                      <td className="px-8 py-5">
                        <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredContent.length === 0 && !error && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No records found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
