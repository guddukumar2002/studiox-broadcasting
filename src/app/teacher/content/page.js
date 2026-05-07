"use client";

import { useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherContent } from "../../../hooks/useContent";
import { ApprovalBadge, ScheduleBadge } from "../../../components/StatusBadge";
import { SkeletonCard } from "../../../components/SkeletonCard";
import { Search, Plus, Calendar, Clock, AlertCircle, ExternalLink, Inbox } from "lucide-react";
import Link from "next/link";

export default function MyContentPage() {
  const { user } = useAuth();
  const { data: content, loading, error, refetch } = useTeacherContent(user?.id);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => content.filter(item => {
    const matchFilter = filter === "all" || item.status === filter;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  }), [content, filter, search]);

  const filters = ["all", "approved", "pending", "rejected"];

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>My Content</h1>
            <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>{content.length} total uploads</p>
          </div>
          <Link href="/teacher/upload" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", background: "#2563EB", color: "#fff", fontSize: "13px", fontWeight: 600, borderRadius: "7px", textDecoration: "none" }}>
            <Plus size={14} /> Upload New
          </Link>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
            <input
              type="text"
              placeholder="Search content..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1px solid #E5E7EB", borderRadius: "7px", fontSize: "13px", color: "#111827", outline: "none", background: "#fff", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 12px", borderRadius: "7px", fontSize: "12px", fontWeight: 600,
                  cursor: "pointer", textTransform: "capitalize", border: "1px solid",
                  background: filter === f ? "#2563EB" : "#fff",
                  color: filter === f ? "#fff" : "#6B7280",
                  borderColor: filter === f ? "#2563EB" : "#E5E7EB",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={15} color="#EF4444" />
            <span style={{ fontSize: "13px", color: "#DC2626" }}>{error}</span>
            <button onClick={refetch} style={{ marginLeft: "auto", fontSize: "12px", color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Retry</button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", textAlign: "center" }}>
            <Inbox size={32} color="#D1D5DB" style={{ marginBottom: "12px" }} />
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>No content found</p>
            <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "4px" }}>Try a different filter or upload new content</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {filtered.map(item => (
              <div key={item.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                {/* Thumbnail */}
                <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "#F3F4F6" }}>
                  <img src={item.fileUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                    <ApprovalBadge status={item.status} />
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 600, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.subject}</p>
                      <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#111827", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</h3>
                    </div>
                    <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
                  </div>

                  <p style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#9CA3AF" }}>
                      <Calendar size={11} />
                      <span>Start: {new Date(item.startTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#9CA3AF" }}>
                      <Clock size={11} />
                      <span>End: {new Date(item.endTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>
                  </div>

                  {item.status === "approved" && (
                    <Link href={`/live/${user?.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "7px", background: "#EFF6FF", color: "#2563EB", fontSize: "12px", fontWeight: 600, borderRadius: "7px", textDecoration: "none", marginTop: "auto" }}>
                      View Live <ExternalLink size={11} />
                    </Link>
                  )}

                  {item.status === "rejected" && item.rejectionReason && (
                    <div style={{ padding: "10px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "7px", marginTop: "auto" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 600, color: "#DC2626", marginBottom: "4px" }}>
                        <AlertCircle size={11} /> Rejection reason
                      </div>
                      <p style={{ fontSize: "11px", color: "#EF4444", fontStyle: "italic" }}>"{item.rejectionReason}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
