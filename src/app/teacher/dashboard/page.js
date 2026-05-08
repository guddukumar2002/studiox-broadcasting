"use client";

import { useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherContent } from "../../../hooks/useContent";
import { SkeletonStatCard } from "../../../components/SkeletonCard";
import { ApprovalBadge } from "../../../components/StatusBadge";
import { EmptyState } from "../../../components/EmptyState";
import Img from "../../../components/Img";
import { FileText, Clock, CheckCircle, XCircle, Plus, ArrowRight, Radio, TrendingUp, Inbox } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function StatCard({ label, value, icon: Icon, bg, color, loading }) {
  if (loading) return <SkeletonStatCard />;
  return (
    <div className="stat-card group hover:shadow-md transition-shadow duration-200">
      <div className="stat-icon" style={{ background: bg }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: content, loading } = useTeacherContent(user?.id);

  const stats = useMemo(() => ({
    total:    content.length,
    pending:  content.filter((c) => c.status === "pending").length,
    approved: content.filter((c) => c.status === "approved").length,
    rejected: content.filter((c) => c.status === "rejected").length,
  }), [content]);

  const recent = useMemo(() => [...content].reverse().slice(0, 6), [content]);
  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Welcome back, <span className="font-semibold text-gray-700">{user?.name?.split(" ")[0]}</span>
          </p>
        </div>
        <button onClick={() => router.push("/teacher/upload")} className="btn-primary">
          <Plus size={14} /> New Upload
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Uploads" value={stats.total}    icon={FileText}    bg="#EFF6FF" color="#2563EB" loading={loading} />
        <StatCard label="Pending"       value={stats.pending}  icon={Clock}       bg="#FFFBEB" color="#D97706" loading={loading} />
        <StatCard label="Approved"      value={stats.approved} icon={CheckCircle} bg="#ECFDF5" color="#059669" loading={loading} />
        <StatCard label="Rejected"      value={stats.rejected} icon={XCircle}     bg="#FEF2F2" color="#DC2626" loading={loading} />
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Left — 3 cols */}
        <div className="lg:col-span-3 flex flex-col gap-4">

          {/* Live banner */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-700 to-blue-500 p-5 sm:p-6 text-white">
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/5" />
            <div className="absolute right-8 -bottom-8 w-24 h-24 rounded-full bg-white/5" />
            <div className="relative">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                <Radio size={18} className="text-white" />
              </div>
              <h2 className="text-[15px] sm:text-[16px] font-bold mb-1.5">Live Room Ready</h2>
              <p className="text-[13px] text-blue-100 mb-5 leading-relaxed max-w-sm">
                Share your approved content with students in real-time.
              </p>
              <div className="flex gap-2.5 flex-wrap">
                <button
                  onClick={() => router.push(`/live/${user?.id}`)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white text-blue-700 text-[13px] font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Open Live Room <ArrowRight size={13} />
                </button>
                <button
                  onClick={() => router.push("/teacher/content")}
                  className="px-4 py-2 bg-white/15 text-white text-[13px] font-semibold rounded-lg border border-white/20 hover:bg-white/25 transition-colors"
                >
                  My Content
                </button>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="card">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-[13px] font-semibold text-gray-900">Recent Activity</span>
              <Link href="/teacher/content" className="text-[12px] text-blue-600 font-medium hover:underline">
                View all →
              </Link>
            </div>
            <div className="p-2">
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg animate-pulse">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-2.5 bg-gray-100 rounded w-2/5" />
                    </div>
                    <div className="h-5 bg-gray-100 rounded-full w-16" />
                  </div>
                ))
              ) : recent.length === 0 ? (
                <EmptyState icon={Inbox} title="No uploads yet" message="Upload your first content to see activity here." />
              ) : (
                recent.map((item) => (
                  <Link
                    key={item.id}
                    href="/teacher/content"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      <Img src={item.fileUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.subject}</p>
                    </div>
                    <ApprovalBadge status={item.status} />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right — 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Approval rate */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Approval Rate</p>
                <p className="text-[32px] font-bold text-gray-900 leading-none mt-1">{approvalRate}%</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <TrendingUp size={18} className="text-emerald-600" />
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${approvalRate}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Approved", val: stats.approved, bg: "bg-emerald-50", color: "text-emerald-700" },
                { label: "Pending",  val: stats.pending,  bg: "bg-amber-50",   color: "text-amber-700"   },
                { label: "Rejected", val: stats.rejected, bg: "bg-red-50",     color: "text-red-700"     },
              ].map((s) => (
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
                { label: "Upload New Content", href: "/teacher/upload",   icon: Plus,     color: "text-blue-600",    bg: "bg-blue-50"    },
                { label: "View My Content",    href: "/teacher/content",  icon: FileText, color: "text-gray-600",    bg: "bg-gray-50"    },
                { label: "Open Live Room",     href: `/live/${user?.id}`, icon: Radio,    color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <Link key={a.href} href={a.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group">
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

          {/* Schedule legend */}
          <div className="card p-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Schedule Status</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Scheduled", desc: "Broadcast starts in future", cls: "badge-scheduled" },
                { label: "Active",    desc: "Currently broadcasting",     cls: "badge-active"    },
                { label: "Expired",   desc: "Broadcast has ended",        cls: "badge-expired"   },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className={s.cls}>{s.label}</span>
                  <span className="text-[12px] text-gray-400">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
