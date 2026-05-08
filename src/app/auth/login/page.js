"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Radio, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[380px]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-7">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Radio size={18} className="text-white" />
          </div>
          <span className="text-[22px] font-extrabold text-gray-900 tracking-tight">StudioX</span>
        </div>

        {/* Card */}
        <div className="card p-7">
          <div className="mb-6">
            <h1 className="text-[18px] font-bold text-gray-900">Sign in to your account</h1>
            <p className="text-[13px] text-gray-500 mt-1">Enter your credentials to continue</p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="flex items-start gap-2.5 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg mb-5">
              <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
              <span className="text-[13px] text-red-600">{serverError}</span>
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
              className="btn-primary w-full py-2.5 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : "Sign in"}
            </button>
          </form>

          {/* Demo access */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-[11px] text-gray-400 text-center font-semibold uppercase tracking-widest mb-3">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => demoLogin("teacher")}
                disabled={busy}
                className="btn-secondary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {demoLoading === "teacher"
                  ? <Loader2 size={13} className="animate-spin" />
                  : <><span>👨🏫</span> Teacher</>
                }
              </button>
              <button
                onClick={() => demoLogin("principal")}
                disabled={busy}
                className="btn-secondary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {demoLoading === "principal"
                  ? <Loader2 size={13} className="animate-spin" />
                  : <><span>🏫</span> Principal</>
                }
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-5">
          StudioX · Educational Broadcasting Platform
        </p>
      </div>
    </div>
  );
}
