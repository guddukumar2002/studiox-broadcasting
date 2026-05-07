"use client";

import { useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAllContent } from "../../../hooks/useContent";
import { SkeletonStatCard } from "../../../components/SkeletonCard";
import { motion } from "framer-motion";
import { Users, Clock, CheckCircle, XCircle, ArrowRight, AlertCircle, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

function StatCard({ title, value, icon: Icon, colorClass, subtitle, loading }) {
  if (loading) return <SkeletonStatCard />;
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden"
    >
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${colorClass} opacity-5 blur-2xl`} />
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${colorClass.replace("bg-", "text-")}`} />
        </div>
        <div className="min-w-0">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest truncate">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold mt-0.5 text-slate-900">{value}</h3>
        </div>
      </div>
      {subtitle && (
        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{subtitle}</span>
          <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
            <TrendingUp className="w-3 h-3" /> Live
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function PrincipalDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: content, loading } = useAllContent();

  const stats = useMemo(() => ({
    total: content.length,
    pending: content.filter((c) => c.status === "pending").length,
    approved: content.filter((c) => c.status === "approved").length,
    rejected: content.filter((c) => c.status === "rejected").length,
  }), [content]);

  const pendingItems = useMemo(() => content.filter((c) => c.status === "pending").slice(0, 3), [content]);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Principal Overview</h1>
            <p className="text-slate-500 mt-1 font-medium">
              {loading ? "Loading..." : `Monitoring ${stats.total} total broadcasting activities.`}
            </p>
          </div>
          <button
            onClick={() => router.push("/principal/pending")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-200 group w-fit"
          >
            Review Pending Queue
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Total Content" value={stats.total} icon={Users} colorClass="bg-blue-500" subtitle="All Uploads" loading={loading} />
          <StatCard title="Pending" value={stats.pending} icon={Clock} colorClass="bg-amber-500" subtitle="Needs Review" loading={loading} />
          <StatCard title="Approved" value={stats.approved} icon={CheckCircle} colorClass="bg-emerald-500" subtitle="Live Ready" loading={loading} />
          <StatCard title="Rejected" value={stats.rejected} icon={XCircle} colorClass="bg-red-500" subtitle="With Feedback" loading={loading} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <AlertCircle className="w-5 h-5 text-amber-500" /> Urgent Approvals
            </h2>
            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 animate-pulse flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-100 rounded-full w-1/4" />
                      <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                      <div className="h-3 bg-slate-100 rounded-full w-1/3" />
                    </div>
                  </div>
                ))
              ) : pendingItems.length > 0 ? (
                pendingItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 10 }}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-blue-200 transition-all"
                    onClick={() => router.push("/principal/pending")}
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                      <img src={item.fileUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{item.subject}</p>
                      <h4 className="font-bold text-slate-900 truncate text-sm md:text-base">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                        <Users className="w-3 h-3" /> {item.teacherName}
                      </p>
                    </div>
                    <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Queue is Empty</h3>
                  <p className="text-sm text-slate-500 mt-1">All reviews completed.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {loading ? "—" : `${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% Approved`}
              </h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                Approval rate across all submitted content.
              </p>
            </div>
            <div className="w-full max-w-xs bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-700"
                style={{ width: `${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%` }}
              />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Approval Rate</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
