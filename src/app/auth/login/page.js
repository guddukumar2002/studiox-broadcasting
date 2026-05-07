"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Radio, Loader2, AlertCircle } from "lucide-react";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

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
    <div style={{ minHeight: "100vh", background: "#F4F5F7", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "28px" }}>
          <div style={{ width: "36px", height: "36px", background: "#2563EB", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
            <Radio size={18} color="#fff" />
          </div>
          <span style={{ fontSize: "20px", fontWeight: 800, color: "#111827" }}>StudioX</span>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: "28px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>Sign in to your account</h1>
            <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px" }}>Enter your credentials to continue</p>
          </div>

          {serverError && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", marginBottom: "16px" }}>
              <AlertCircle size={15} color="#EF4444" style={{ flexShrink: 0, marginTop: "1px" }} />
              <span style={{ fontSize: "13px", color: "#DC2626" }}>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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

            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className={`field-input ${errors.password ? "error" : ""}`}
              />
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: "100%", padding: "9px", marginTop: "4px", opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
            >
              {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : "Sign in"}
            </button>
          </form>

          {/* Demo */}
          <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #F3F4F6" }}>
            <p style={{ fontSize: "11px", color: "#9CA3AF", textAlign: "center", marginBottom: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick demo access</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button onClick={() => demoLogin("teacher")} disabled={isSubmitting} className="btn-secondary" style={{ opacity: isSubmitting ? 0.5 : 1 }}>
                👨‍🏫 Teacher
              </button>
              <button onClick={() => demoLogin("principal")} disabled={isSubmitting} className="btn-secondary" style={{ opacity: isSubmitting ? 0.5 : 1 }}>
                🏫 Principal
              </button>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", marginTop: "20px" }}>
          StudioX · Educational Broadcasting Platform
        </p>
      </div>
    </div>
  );
}
