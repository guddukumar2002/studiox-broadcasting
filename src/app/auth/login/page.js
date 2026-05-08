"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Radio, Loader2, AlertCircle, Eye, EyeOff, Wifi } from "lucide-react";

const schema = z.object({
  email:    z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { login }  = useAuth();
  const router     = useRouter();
  const [serverError, setServerError] = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [demoLoading, setDemoLoading] = useState("");

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const busy = isSubmitting || !!demoLoading;

  const onSubmit = async ({ email, password }) => {
    setServerError("");
    try {
      const user = await login(email, password);
      router.push(user.role === "teacher" ? "/teacher/dashboard" : "/principal/dashboard");
    } catch (err) {
      setServerError(err.message);
    }
  };

  const demoLogin = async (role) => {
    const email = role === "teacher" ? "teacher@school.com" : "principal@school.com";
    setValue("email", email);
    setValue("password", "password");
    setServerError("");
    setDemoLoading(role);
    try {
      const user = await login(email, "password");
      router.push(user.role === "teacher" ? "/teacher/dashboard" : "/principal/dashboard");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setDemoLoading("");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 50%, #F0F9FF 100%)" }}>

      {/* ── LEFT PANEL — branding (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 left-1/4 w-64 h-64 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center border border-white/20">
            <Radio size={20} className="text-white" />
          </div>
          <span className="text-[22px] font-extrabold text-white tracking-tight">StudioX</span>
        </div>

        {/* Center content */}
        <div className="relative space-y-8">
          <div>
            <h1 className="text-[36px] font-extrabold text-white leading-tight">
              Content Broadcasting<br />Made Simple
            </h1>
            <p className="text-blue-200 text-[15px] mt-4 leading-relaxed max-w-sm">
              Teachers upload, principals approve, students learn — all in one seamless platform.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {[
              { icon: "📡", text: "Live broadcast to students instantly" },
              { icon: "✅", text: "Principal approval workflow" },
              { icon: "📚", text: "Subject-based content management" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3 border border-white/10">
                <span className="text-[18px]">{f.icon}</span>
                <span className="text-[13px] text-blue-100 font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative">
          <p className="text-blue-300 text-[12px]">© 2026 StudioX · Educational Broadcasting Platform</p>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="flex-1 flex items-center justify-center bg-transparent px-5 py-10">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo + tagline */}
          <div className="flex lg:hidden flex-col items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-300/40">
              <Radio size={22} className="text-white" />
            </div>
            <span className="text-[24px] font-extrabold text-gray-900 tracking-tight">StudioX</span>
            <p className="text-[13px] text-gray-500 text-center max-w-[260px] leading-relaxed">
              Educational content broadcasting for teachers &amp; principals
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 p-8">

            <div className="mb-7">
              <h2 className="text-[22px] font-bold text-gray-900 leading-tight">Welcome back</h2>
              <p className="text-[13px] text-gray-500 mt-1.5">Sign in to your account to continue</p>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-200 rounded-xl mb-5">
                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <span className="text-[13px] text-red-600 leading-snug">{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="field-label">Email address</label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@school.com"
                  className={`field-input ${errors.email ? "error" : ""}`}
                />
                {errors.email && <p className="field-error">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="field-label">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className={`field-input pr-10 ${errors.password ? "error" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="field-error">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="btn-primary w-full py-2.5 mt-1 text-[14px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Sign in"}
              </button>
            </form>

            {/* Demo access */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Wifi size={13} className="text-gray-400" />
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">Quick Demo Access</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => demoLogin("teacher")}
                  disabled={busy}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-blue-100 bg-blue-50 text-blue-700 text-[13px] font-semibold hover:bg-blue-100 hover:border-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {demoLoading === "teacher"
                    ? <Loader2 size={13} className="animate-spin" />
                    : <><span>👨🏫</span> Teacher</>
                  }
                </button>
                <button
                  onClick={() => demoLogin("principal")}
                  disabled={busy}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-indigo-100 bg-indigo-50 text-indigo-700 text-[13px] font-semibold hover:bg-indigo-100 hover:border-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {demoLoading === "principal"
                    ? <Loader2 size={13} className="animate-spin" />
                    : <><span>🏫</span> Principal</>
                  }
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-[12px] text-gray-400 mt-5 lg:hidden">
            StudioX · Educational Broadcasting Platform
          </p>
        </div>
      </div>
    </div>
  );
}
