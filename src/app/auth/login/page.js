"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ShieldCheck, User, Loader2, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

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
    try {
      const user = await login(email, "password");
      router.push(user.role === "teacher" ? "/teacher/dashboard" : "/principal/dashboard");
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-60" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-blue-900/5">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200 rotate-3 transition-transform hover:rotate-0">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Sign in to your StudioX account</p>
          </div>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-semibold"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400 ${errors.email ? "border-red-300 bg-red-50" : "border-slate-200"}`}
                  placeholder="name@school.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-semibold ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  {...register("password")}
                  className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400 ${errors.password ? "border-red-300 bg-red-50" : "border-slate-200"}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-semibold ml-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Sign In <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">
            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Access Demo</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => demoLogin("teacher")}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all text-xs font-bold text-slate-700 disabled:opacity-50"
              >
                <User className="w-4 h-4 text-blue-600" /> Teacher
              </button>
              <button
                onClick={() => demoLogin("principal")}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all text-xs font-bold text-slate-700 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" /> Principal
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
