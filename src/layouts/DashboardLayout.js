"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, Upload, FileText, CheckCircle,
  LogOut, User, Radio, Menu, X, ChevronRight,
} from "lucide-react";
import Link from "next/link";

function NavItem({ href, label, icon: Icon, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      <Icon size={15} className="shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

function Sidebar({ links, pathname, user, logout }) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-gray-100 shrink-0">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <Radio size={14} className="text-white" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-gray-900 leading-tight">StudioX</p>
          <p className="text-[10px] text-gray-400 leading-tight">Broadcasting System</p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2.5 mb-2">
          {user?.role === "teacher" ? "Teacher" : "Principal"}
        </p>
        <div className="flex flex-col gap-0.5">
          {links.map(link => (
            <NavItem key={link.href} {...link} active={pathname === link.href} />
          ))}
        </div>
      </div>

      {/* User + logout */}
      <div className="px-2 py-3 border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5 px-2.5 py-2 bg-gray-50 rounded-lg mb-1">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <User size={13} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-[11px] text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  // Role guard
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "teacher" && pathname.startsWith("/principal")) router.replace("/teacher/dashboard");
      if (user.role === "principal" && pathname.startsWith("/teacher")) router.replace("/principal/dashboard");
    }
  }, [user, loading, pathname, router]);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const teacherLinks = [
    { href: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/teacher/upload",    icon: Upload,          label: "Upload Content" },
    { href: "/teacher/content",   icon: FileText,        label: "My Content" },
  ];
  const principalLinks = [
    { href: "/principal/dashboard",   icon: LayoutDashboard, label: "Dashboard" },
    { href: "/principal/pending",     icon: CheckCircle,     label: "Pending Approvals" },
    { href: "/principal/all-content", icon: FileText,        label: "All Content" },
  ];
  const links = user?.role === "teacher" ? teacherLinks : principalLinks;
  const currentLabel = links.find(l => l.href === pathname)?.label ?? "Dashboard";

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest">Loading...</p>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex md:w-[220px] md:shrink-0 h-full">
        <Sidebar links={links} pathname={pathname} user={user} logout={logout} />
      </aside>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer panel */}
          <div className="absolute left-0 top-0 w-64 h-full shadow-2xl z-10">
            <Sidebar links={links} pathname={pathname} user={user} logout={logout} />
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN AREA ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0 z-30">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Menu size={18} />
          </button>

          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <Radio size={12} className="text-white" />
            </div>
            <span className="text-[14px] font-bold text-gray-900">StudioX</span>
          </div>

          {/* Desktop breadcrumb */}
          <div className="hidden md:flex items-center gap-1.5 text-[13px] text-gray-400">
            <span className="capitalize">{user?.role}</span>
            <ChevronRight size={13} />
            <span className="font-semibold text-gray-900">{currentLabel}</span>
          </div>

          <div className="flex-1" />

          {/* User chip */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:block text-right">
              <p className="text-[13px] font-semibold text-gray-900 leading-tight">{user?.name}</p>
              <p className="text-[11px] text-gray-400 capitalize leading-tight">{user?.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <User size={14} className="text-white" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
            {children}
          </div>
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center z-40 shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
        {links.map(link => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                active ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={19} />
              <span>{link.label.split(" ")[0]}</span>
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={19} />
          <span>Exit</span>
        </button>
      </nav>
    </div>
  );
}
