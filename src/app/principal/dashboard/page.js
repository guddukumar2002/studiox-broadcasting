"use client";

import { useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAllContent } from "../../../hooks/useContent";
import { SkeletonStatCard } from "../../../components/SkeletonCard";
import { ApprovalBadge } from "../../../components/StatusBadge";
import { Users, Clock, CheckCircle, XCircle, ArrowRight, TrendingUp, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function StatCard({ label, value, icon: Icon, bg, color, loading }) {
  if (loading) return <SkeletonStatCard />;
  return (
    <div className="stat-card hover:shadow-md transition-shadow duration-200">
      <div className="stat-icon" style={{ background: bg }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

export default function PrincipalDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: content, loading } = useAllContent();

  const stats = useMemo(() => ({
    total:    content.length,
    pending:  content.filter(c => c.status === "pending").length,
    approved: content.filter(c => c.status === "approved").length,
    rejected: content.filter(c => c.status === "rejected").length,
  }), [content]);

  const pendingItems = useMemo(() => content.filter(c => c.status === "pending").slice(0, 6), [content]);
  const rate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900">Dashboard</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Welcome back, <span className="font-semibold text-gray-700">{user?.name?.split(" ")[0]}</span>
          </p>
        </div>
        <button onClick={() => router.push("/principal/pending")} className="btn-primary">
          Review Queue
          {stats.pending > 0 && (
            <span className="bg-white/25 rounded-full px-2 py-0.5 text-[11px] font-bold">
              {stats.pending}
            </span>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total"    value={stats.total}    icon={Users}       bg="#EFF6FF" color="#2563EB" loading={loading} />
        <StatCard label="Pending"  value={stats.pending}  icon={Clock}       bg="#FFFBEB" color="#D97706" loading={loading} />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle} bg="#ECFDF5" color="#059669" loading={loading} />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle}     bg="#FEF2F2" color="#DC2626" loading={loading} />
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Left — 3 cols: pending queue */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-gray-900">Pending Approvals</span>
              {stats.pending > 0 && (
                <span className="badge-pending">{stats.pending}</span>
              )}
            </div>
            <Link href="/principal/pending" className="text-[12px] text-blue-600 font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="p-2">
            {loading ? (
              [1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded w-3/5" />
                    <div className="h-2.5 bg-gray-100 rounded w-2/5" />
                  </div>
                  <div className="w-4 h-4 bg-gray-100 rounded" />
                </div>
              ))
            ) : pendingItems.length > 0 ? pendingItems.map(item => (
              <button
                key={item.id}
                onClick={() => router.push("/principal/pending")}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                  <img src={item.fileUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.subject} · {item.teacherName}</p>
                </div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
              </button>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle size={20} className="text-emerald-500" />
                </div>
                <p className="text-[13px] font-semibold text-gray-700">All caught up!</p>
                <p className="text-[12px] text-gray-400 mt-1">No pending content to review</p>
              </div>
            )}
          </div>
        </div>

        {/* Right — 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Approval rate */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Approval Rate</p>
                <p className="text-[32px] font-bold text-gray-900 leading-none mt-1">{rate}%</p>
                <p className="text-[12px] text-gray-400 mt-1">of all submitted content</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <TrendingUp size={18} className="text-emerald-600" />
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${rate}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Approved", val: stats.approved, bg: "bg-emerald-50", color: "text-emerald-700" },
                { label: "Pending",  val: stats.pending,  bg: "bg-amber-50",   color: "text-amber-700"   },
                { label: "Rejected", val: stats.rejected, bg: "bg-red-50",     color: "text-red-700"     },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-lg p-2.5 text-center`}>
                  <p className={`text-[18px] font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Review Pending",  href: "/principal/pending",     icon: Clock,     color: "text-amber-600",  bg: "bg-amber-50"  },
                { label: "All Content",     href: "/principal/all-content",  icon: FileText,  color: "text-blue-600",   bg: "bg-blue-50"   },
              ].map(a => {
                const Icon = a.icon;
                return (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group"
                  >
                    <div className={`w-8 h-8 ${a.bg} rounded-lg flex items-center justify-center shrink-0`}>
                      <Icon size={15} className={a.color} />
                    </div>
                    <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-900">{a.label}</span>
                    <ArrowRight size={13} className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
