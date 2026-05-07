"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  CheckCircle, 
  LogOut, 
  Bell, 
  Search, 
  User, 
  Radio 
} from "lucide-react";

function NavLink({ href, icon: Icon, label, active, isBottom = false }) {
  const router = useRouter();
  
  if (isBottom) {
    const shortLabel = label.split(' ')[0];
    return (
      <button
        onClick={() => router.push(href)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          flex: 1,
          padding: '8px 0',
          color: active ? '#2563eb' : '#94a3b8',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <Icon size={20} fill={active ? 'rgba(37, 99, 235, 0.1)' : 'none'} />
        <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>{shortLabel}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => router.push(href)}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
        active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
        : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
      }`}
    >
      <Icon size={20} className={active ? "text-white" : "text-slate-400 group-hover:text-blue-600 transition-colors"} />
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
}

export default function DashboardLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const teacherLinks = [
    { href: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/teacher/upload", icon: Upload, label: "Upload Content" },
    { href: "/teacher/content", icon: FileText, label: "My Content" },
  ];

  const principalLinks = [
    { href: "/principal/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/principal/pending", icon: CheckCircle, label: "Pending Approvals" },
    { href: "/principal/all-content", icon: FileText, label: "All Content" },
  ];

  const links = user?.role === "teacher" ? teacherLinks : principalLinks;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden">
      <style jsx global>{`
        @media (min-width: 768px) {
          .pc-sidebar { display: flex !important; }
          .mobile-nav { display: none !important; }
          .main-content { padding-bottom: 0 !important; }
        }
        @media (max-width: 767px) {
          .pc-sidebar { display: none !important; }
          .mobile-nav { display: flex !important; }
          .main-content { padding-bottom: 80px !important; }
        }
      `}</style>

      {/* PC Sidebar - Forced to left with CSS */}
      <aside className="pc-sidebar w-72 lg:w-80 bg-white border-r border-slate-200 flex-shrink-0 h-screen sticky top-0 flex-col p-8 shadow-sm z-30">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <Radio size={28} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">StudioX</span>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-6">Main Menu</p>
          {links.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              active={pathname === link.href}
            />
          ))}
        </div>

        <div className="mt-auto pt-8 border-t border-slate-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm">Logout Session</span>
          </button>
          
          <div className="mt-8 p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm">
              <User size={24} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate text-slate-900">{user?.name || "User"}</p>
              <p className="text-[10px] text-blue-600 uppercase font-black tracking-widest leading-none mt-1">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen main-content">
        <header className="h-24 flex-shrink-0 flex items-center justify-between px-6 lg:px-12 border-b border-slate-200 bg-white/80 backdrop-blur-md z-20 sticky top-0">
          {/* Logo only on Mobile */}
          {!isMobile ? null : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Radio size={20} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter">STUDIOX</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-2xl px-5 py-3 w-64 lg:w-96 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all shadow-inner">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-slate-500 text-slate-700 font-medium"
            />
          </div>

          <div className="flex-1 md:flex-none" />

          <div className="flex items-center gap-4">
            <button className="relative p-3 rounded-2xl bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-white hover:shadow-md transition-all border border-transparent">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
            </button>
            <div className="h-10 w-px bg-slate-200 mx-1 md:mx-2" />
            <div className="flex items-center gap-3">
              <div className="hidden xs:block text-right">
                <p className="text-sm font-black text-slate-900 truncate max-w-[100px] lg:max-w-[150px]">{user?.name}</p>
                <p className="text-[10px] text-blue-600 uppercase font-black tracking-widest mt-1">{user?.role}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 border border-blue-500">
                <User size={24} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Only for screens < 768px */}
      <nav className="mobile-nav fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-xl border-t border-slate-200 items-center px-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] rounded-t-[2.5rem]">
        {links.map((link) => (
          <NavLink
            key={link.href}
            {...link}
            active={pathname === link.href}
            isBottom={true}
          />
        ))}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 flex-1 py-2 text-slate-400 bg-none border-none cursor-pointer"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Exit</span>
        </button>
      </nav>
    </div>
  );
}
