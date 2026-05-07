"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { SUBJECTS } from "../../../utils/mockData";
import { useCreateContent } from "../../../hooks/useContent";
import { toast } from "sonner";
import { Upload, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const ALLOWED = ["image/jpeg", "image/png", "image/gif"];
const MAX_MB  = 10 * 1024 * 1024;

const schema = z.object({
  title:            z.string().min(1, "Title is required"),
  subject:          z.string().min(1, "Subject is required"),
  description:      z.string().min(1, "Description is required"),
  startTime:        z.string().min(1, "Start time is required"),
  endTime:          z.string().min(1, "End time is required"),
  rotationDuration: z.coerce.number().min(10, "Minimum 10 seconds"),
}).refine(d => new Date(d.endTime) > new Date(d.startTime), {
  message: "End time must be after start time",
  path: ["endTime"],
});

const inputStyle = (hasError) => ({
  width: "100%", padding: "8px 12px", border: `1px solid ${hasError ? "#EF4444" : "#E5E7EB"}`,
  borderRadius: "7px", fontSize: "13px", color: "#111827", outline: "none",
  background: "#fff", boxSizing: "border-box", fontFamily: "inherit",
  boxShadow: hasError ? "0 0 0 3px rgba(239,68,68,0.1)" : "none",
});

const labelStyle = {
  display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px",
};

const errorStyle = { fontSize: "12px", color: "#EF4444", marginTop: "4px" };

export default function UploadContentPage() {
  const router = useRouter();
  const { create, loading: uploading } = useCreateContent();
  const [preview, setPreview] = useState(null);
  const [fileData, setFileData] = useState("");
  const [fileError, setFileError] = useState("");
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { rotationDuration: 30 },
  });

  const onFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileError("");
    if (!ALLOWED.includes(file.type)) { setFileError("Only JPG, PNG, GIF allowed."); return; }
    if (file.size > MAX_MB) { setFileError("File must be under 10MB."); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setPreview(reader.result); setFileData(reader.result); };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values) => {
    if (!fileData) { setFileError("Please upload an image."); return; }
    try {
      await create({ ...values, fileUrl: fileData });
      toast.success("Submitted for approval!");
      setDone(true);
      setTimeout(() => router.push("/teacher/content"), 1500);
    } catch (err) {
      toast.error(err.message || "Upload failed.");
    }
  };

  if (done) return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
        <div style={{ width: "56px", height: "56px", background: "#ECFDF5", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", border: "1px solid #D1FAE5" }}>
          <CheckCircle2 size={28} color="#059669" />
        </div>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>Submitted successfully!</h2>
        <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "6px" }}>Redirecting to your content...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "900px" }}>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>Upload Content</h1>
          <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>Create a new broadcast for your students</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} id="upload-grid">
            <style>{`
              @media (min-width: 768px) {
                #upload-grid { grid-template-columns: 3fr 2fr !important; }
              }
            `}</style>

            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* File upload */}
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "20px" }}>
                <label style={labelStyle}>Preview Image <span style={{ color: "#EF4444" }}>*</span></label>
                {preview ? (
                  <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E7EB" }}>
                    <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => { setPreview(null); setFileData(""); }}
                      style={{ position: "absolute", top: "10px", right: "10px", padding: "5px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
                    >
                      <X size={13} color="#6B7280" />
                    </button>
                  </div>
                ) : (
                  <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: "16/9", borderRadius: "8px", border: "2px dashed #E5E7EB", cursor: "pointer", background: "#FAFAFA", transition: "border-color 0.15s" }}>
                    <div style={{ width: "44px", height: "44px", background: "#F3F4F6", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                      <Upload size={20} color="#9CA3AF" />
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>Click to upload</p>
                    <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>JPG, PNG, GIF · Max 10MB</p>
                    <input type="file" style={{ display: "none" }} accept=".jpg,.jpeg,.png,.gif" onChange={onFile} />
                  </label>
                )}
                {fileError && (
                  <p style={{ ...errorStyle, display: "flex", alignItems: "center", gap: "5px", marginTop: "8px" }}>
                    <AlertCircle size={12} /> {fileError}
                  </p>
                )}
              </div>

              {/* Title + Subject */}
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Title <span style={{ color: "#EF4444" }}>*</span></label>
                  <input {...register("title")} placeholder="e.g. Introduction to Calculus" style={inputStyle(errors.title)} />
                  {errors.title && <p style={errorStyle}>{errors.title.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Subject <span style={{ color: "#EF4444" }}>*</span></label>
                  <select {...register("subject")} style={{ ...inputStyle(errors.subject), cursor: "pointer" }}>
                    <option value="">Select subject</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.subject && <p style={errorStyle}>{errors.subject.message}</p>}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Description <span style={{ color: "#EF4444" }}>*</span></label>
                <textarea rows={4} {...register("description")} placeholder="Brief summary of the lesson..." style={{ ...inputStyle(errors.description), resize: "none" }} />
                {errors.description && <p style={errorStyle}>{errors.description.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Start Time <span style={{ color: "#EF4444" }}>*</span></label>
                <input type="datetime-local" {...register("startTime")} style={inputStyle(errors.startTime)} />
                {errors.startTime && <p style={errorStyle}>{errors.startTime.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>End Time <span style={{ color: "#EF4444" }}>*</span></label>
                <input type="datetime-local" {...register("endTime")} style={inputStyle(errors.endTime)} />
                {errors.endTime && <p style={errorStyle}>{errors.endTime.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Rotation Duration (seconds)</label>
                <input type="number" min="10" {...register("rotationDuration")} style={inputStyle(errors.rotationDuration)} />
                {errors.rotationDuration && <p style={errorStyle}>{errors.rotationDuration.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", background: (isSubmitting || uploading) ? "#93C5FD" : "#2563EB", color: "#fff", fontSize: "13px", fontWeight: 600, borderRadius: "7px", border: "none", cursor: (isSubmitting || uploading) ? "not-allowed" : "pointer", marginTop: "auto" }}
              >
                {(isSubmitting || uploading) ? <><Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> Submitting...</> : "Submit for Approval"}
              </button>
            </div>
          </div>
        </form>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </DashboardLayout>
  );
}
