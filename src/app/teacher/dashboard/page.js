"use client";

import { useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherContent } from "../../../hooks/useContent";
import { SkeletonStatCard } from "../../../components/SkeletonCard";
import { ScheduleBadge } from "../../../components/StatusBadge";
import { motion } from "framer-motion";
import { Plus, FileText, Clock, CheckCircle, XCircle, ArrowRight, TrendingUp, Radio } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function StatCard({ title, value, icon: Icon, colorClass, loading }) {
  if (loading) return <SkeletonStatCard />;
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
      <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${colorClass.replace("bg-", "text-")}`} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: content, loading } = useTeacherContent(user?.id);

  const stats = useMemo(() => ({
    total: content.length,
    pending: content.filter((c) => c.status === "pending").length,
    approved: content.filter((c) => c.status === "approved").length,
    rejected: content.filter((c) => c.status === "rejected").length,
  }), [content]);

  const recentContent = useMemo(() => [...content].reverse().slice(0, 3), [content]);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Welcome, {user?.name}</h1>
            <p className="text-slate-500 mt-1 font-medium">Ready to broadcast your next lesson?</p>
          </div>
          <button
            onClick={() => router.push("/teacher/upload")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-200 group w-fit"
          >
            <Plus className="w-5 h-5" /> Upload New Content
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Uploads" value={stats.total} icon={FileText} colorClass="bg-blue-500" loading={loading} />
          <StatCard title="Pending" value={stats.pending} icon={Clock} colorClass="bg-amber-500" loading={loading} />
          <StatCard title="Approved" value={stats.approved} icon={CheckCircle} colorClass="bg-emerald-500" loading={loading} />
          <StatCard title="Rejected" value={stats.rejected} icon={XCircle} colorClass="bg-red-500" loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-200 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700" />
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Radio className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black leading-tight max-w-md">Your Live Room is Ready for Broadcast.</h2>
                <p className="text-blue-100 max-w-sm text-lg font-medium">Connect with your students in real-time.</p>
                <div className="pt-4 flex gap-4 flex-wrap">
                  <button
                    onClick={() => router.push(`/live/${user?.id}`)}
                    className="px-8 py-3.5 rounded-2xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition-all flex items-center gap-2"
                  >
                    Go to Live Room <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => router.push("/teacher/content")}
                    className="px-8 py-3.5 rounded-2xl bg-blue-500/30 backdrop-blur-md text-white font-bold border border-white/10 hover:bg-white/10 transition-all"
                  >
                    View Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Recent Activity
            </h3>
            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 animate-pulse flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                      <div className="h-3 bg-slate-100 rounded-full w-1/3" />
                    </div>
                  </div>
                ))
              ) : recentContent.length > 0 ? (
                recentContent.map((item) => (
                  <Link
                    key={item.id}
                    href="/teacher/content"
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-all cursor-pointer group block"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                      <img src={item.fileUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate text-sm">{item.title}</h4>
                      <div className="mt-1">
                        <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="bg-slate-50 p-10 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400 font-medium">
                  No activity yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
