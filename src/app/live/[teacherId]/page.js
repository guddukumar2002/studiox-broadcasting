"use client";

import { useLiveContent } from "../../../hooks/useContent";
import { EmptyState, ErrorState } from "../../../components/EmptyState";
import Img from "../../../components/Img";
import { Radio, Clock, BookOpen, ArrowLeft, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";

export default function PublicLivePage({ params }) {
  const { teacherId } = params;
  const { data: liveItems, loading, error } = useLiveContent(teacherId);
  const active = liveItems[0] ?? null;

  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading broadcast...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC]">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Radio size={14} className="text-white" />
              </div>
              <span className="font-bold text-gray-900 text-sm">StudioX Live</span>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"
          }`}>
            {active
              ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Now</>
              : <><WifiOff size={12} /> Offline</>
            }
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 sm:py-8">

        {error && <ErrorState message={error} />}

        {!error && active && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            {/* Media */}
            <div className="lg:col-span-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-100">
                <Img src={active.fileUrl} alt={active.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <span className="badge-scheduled">{active.subject}</span>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-2 leading-snug">{active.title}</h1>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{active.description}</p>
              </div>
              <div className="card p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Broadcast Details</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{active.teacherName}</p>
                    <p className="text-xs text-gray-400">Instructor</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Ends at {new Date(active.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-xs text-gray-400">Refreshes every {active.rotationDuration}s</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-center gap-2">
                <Wifi size={13} className="flex-shrink-0" />
                This page auto-refreshes every 5 seconds
              </div>
            </div>
          </div>
        )}

        {!error && !active && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <EmptyState icon={Radio} title="No content available" message="No live content is scheduled right now. Please check back later." />
            <Link href="/auth/login" className="mt-2 btn-secondary text-sm">Sign in to manage Studio</Link>
          </div>
        )}
      </main>
    </div>
  );
}
