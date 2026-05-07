"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAllContent } from "../../../hooks/useContent";
import { ApprovalBadge, ScheduleBadge } from "../../../components/StatusBadge";
import { SkeletonRow } from "../../../components/SkeletonCard";
import { Search, User, Calendar, Inbox, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 20;

export default function AllContentPage() {
  const { data: content, loading, error, refetch } = useAllContent();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    setPage(1); // reset to page 1 on filter change — handled via key below
    const q = search.toLowerCase();
    return content.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(q) || item.teacherName.toLowerCase().includes(q) || item.subject.toLowerCase().includes(q);
      const matchStatus = status === "all" || item.status === status;
      return matchSearch && matchStatus;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE), [filtered, safePage]);

  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleStatus = (val) => { setStatus(val); setPage(1); };

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>All Content</h1>
          <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>
            {loading ? "Loading..." : `${filtered.length} of ${content.length} submissions`}
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
            <input
              type="text"
              placeholder="Search by title, teacher or subject..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1px solid #E5E7EB", borderRadius: "7px", fontSize: "13px", color: "#111827", outline: "none", background: "#fff", boxSizing: "border-box" }}
            />
          </div>
          <select
            value={status}
            onChange={e => handleStatus(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: "7px", fontSize: "13px", color: "#374151", background: "#fff", outline: "none", cursor: "pointer", minWidth: "140px" }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={15} color="#EF4444" />
            <span style={{ fontSize: "13px", color: "#DC2626" }}>{error}</span>
            <button onClick={refetch} style={{ marginLeft: "auto", fontSize: "12px", color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Retry</button>
          </div>
        )}

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "650px" }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  {["Content", "Teacher", "Schedule", "Status", "Timing"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1,2,3,4,5].map(i => <SkeletonRow key={i} />)
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "60px 20px", textAlign: "center" }}>
                      <Inbox size={28} color="#D1D5DB" style={{ margin: "0 auto 10px" }} />
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>No records found</p>
                      <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>Try adjusting your search or filter</p>
                    </td>
                  </tr>
                ) : paginated.map((item, i) => (
                  <tr key={item.id} style={{ borderBottom: i < paginated.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "7px", background: "#F3F4F6", overflow: "hidden", flexShrink: 0, border: "1px solid #E5E7EB" }}>
                          <img src={item.fileUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>{item.title}</p>
                          <p style={{ fontSize: "11px", color: "#2563EB", fontWeight: 500, marginTop: "2px" }}>{item.subject}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#374151" }}>
                        <User size={12} color="#9CA3AF" /> {item.teacherName}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#6B7280" }}>
                        <Calendar size={11} /> {new Date(item.startTime).toLocaleDateString()}
                      </div>
                      <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px", paddingLeft: "16px" }}>
                        {new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {new Date(item.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>
                    <td style={{ padding: "12px 16px" }}><ApprovalBadge status={item.status} /></td>
                    <td style={{ padding: "12px 16px" }}><ScheduleBadge startTime={item.startTime} endTime={item.endTime} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filtered.length > PAGE_SIZE && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #F3F4F6" }}>
              <span style={{ fontSize: "12px", color: "#6B7280" }}>
                Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "12px", fontWeight: 500, background: "#fff", color: safePage === 1 ? "#D1D5DB" : "#374151", cursor: safePage === 1 ? "not-allowed" : "pointer" }}
                >
                  <ChevronLeft size={13} /> Prev
                </button>
                <span style={{ display: "flex", alignItems: "center", padding: "5px 10px", fontSize: "12px", color: "#374151", fontWeight: 600 }}>
                  {safePage} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "12px", fontWeight: 500, background: "#fff", color: safePage === totalPages ? "#D1D5DB" : "#374151", cursor: safePage === totalPages ? "not-allowed" : "pointer" }}
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
