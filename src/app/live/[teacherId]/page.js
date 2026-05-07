"use client";

import { useLiveContent } from "../../../hooks/useContent";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Clock, BookOpen, AlertCircle, ArrowLeft, Maximize2 } from "lucide-react";
import Link from "next/link";

export default function PublicLivePage({ params }) {
  const { teacherId } = params;
  const { data: liveItems, loading, error } = useLiveContent(teacherId);
  const activeContent = liveItems[0] ?? null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">Loading broadcast...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-50 px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-slate-900">StudioX Live</h1>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest -mt-1">
                {activeContent ? `Broadcasting: ${activeContent.teacherName}` : "No Active Broadcast"}
              </p>
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm ${activeContent ? "bg-red-50 border-red-100" : "bg-slate-100 border-slate-200"}`}>
          <div className={`w-2 h-2 rounded-full ${activeContent ? "bg-red-500 animate-pulse" : "bg-slate-400"}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${activeContent ? "text-red-600" : "text-slate-500"}`}>
            {activeContent ? "Live Now" : "Offline"}
          </span>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 lg:px-20 max-w-7xl mx-auto">
        {error && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-red-50 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Failed to Load Broadcast</h2>
            <p className="text-slate-500">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!error && activeContent ? (
            <motion.div
              key={activeContent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* Media */}
              <div className="lg:col-span-7">
                <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl group">
                  <img
                    src={activeContent.fileUrl}
                    alt={activeContent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <button className="absolute bottom-6 right-6 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/40 transition-all text-white opacity-0 group-hover:opacity-100">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest">
                      {activeContent.subject}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                      <Clock className="w-4 h-4" />
                      STARTED {new Date(activeContent.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <h2 className="text-5xl font-black leading-[1.1] tracking-tighter text-slate-900">
                    {activeContent.title}
                  </h2>
                  <p className="text-lg text-slate-500 leading-relaxed font-medium">{activeContent.description}</p>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Broadcast Info</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <BookOpen className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        Ends at {new Date(activeContent.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        Refreshing every {activeContent.rotationDuration}s
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : !error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="w-24 h-24 rounded-[2.5rem] bg-white flex items-center justify-center mb-8 shadow-sm border border-slate-100">
                <AlertCircle className="w-12 h-12 text-slate-300" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">No content available</h2>
              <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed font-medium">
                No live content is scheduled for this time. Please check back later.
              </p>
              <Link
                href="/auth/login"
                className="mt-10 px-10 py-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all text-sm font-bold shadow-sm"
              >
                Sign in to manage Studio
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
