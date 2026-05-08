"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Img from "../../../components/Img";
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
}).refine((d) => new Date(d.endTime) > new Date(d.startTime), {
  message: "End time must be after start time",
  path: ["endTime"],
});

export default function UploadContentPage() {
  const router = useRouter();
  const { create, loading: uploading } = useCreateContent();
  const [preview, setPreview]   = useState(null);
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 border border-emerald-200">
          <CheckCircle2 size={28} className="text-emerald-600" />
        </div>
        <h2 className="text-[16px] font-bold text-gray-900">Submitted successfully!</h2>
        <p className="text-[13px] text-gray-500 mt-1.5">Redirecting to your content...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-[900px]">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Upload Content</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Create a new broadcast for your students</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            {/* Left column — 3 cols */}
            <div className="md:col-span-3 flex flex-col gap-4">

              {/* File upload */}
              <div className="card p-5">
                <label className="field-label">
                  Preview Image <span className="text-red-500">*</span>
                </label>
                {preview ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                    <Img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPreview(null); setFileData(""); }}
                      className="absolute top-2.5 right-2.5 p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <X size={13} className="text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-gray-200 cursor-pointer bg-gray-50 hover:border-gray-300 transition-colors">
                    <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                      <Upload size={20} className="text-gray-400" />
                    </div>
                    <p className="text-[13px] font-medium text-gray-700">Click to upload</p>
                    <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, GIF · Max 10MB</p>
                    <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.gif" onChange={onFile} />
                  </label>
                )}
                {fileError && (
                  <p className="flex items-center gap-1.5 text-[12px] text-red-500 mt-2">
                    <AlertCircle size={12} /> {fileError}
                  </p>
                )}
              </div>

              {/* Title + Subject */}
              <div className="card p-5 flex flex-col gap-4">
                <div>
                  <label className="field-label">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("title")}
                    placeholder="e.g. Introduction to Calculus"
                    className={`field-input ${errors.title ? "error" : ""}`}
                  />
                  {errors.title && <p className="field-error">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="field-label">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select {...register("subject")} className={`field-input cursor-pointer ${errors.subject ? "error" : ""}`}>
                    <option value="">Select subject</option>
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.subject && <p className="field-error">{errors.subject.message}</p>}
                </div>
              </div>
            </div>

            {/* Right column — 2 cols */}
            <div className="md:col-span-2 card p-5 flex flex-col gap-4">
              <div>
                <label className="field-label">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  {...register("description")}
                  placeholder="Brief summary of the lesson..."
                  className={`field-input resize-none ${errors.description ? "error" : ""}`}
                />
                {errors.description && <p className="field-error">{errors.description.message}</p>}
              </div>
              <div>
                <label className="field-label">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  {...register("startTime")}
                  className={`field-input ${errors.startTime ? "error" : ""}`}
                />
                {errors.startTime && <p className="field-error">{errors.startTime.message}</p>}
              </div>
              <div>
                <label className="field-label">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  {...register("endTime")}
                  className={`field-input ${errors.endTime ? "error" : ""}`}
                />
                {errors.endTime && <p className="field-error">{errors.endTime.message}</p>}
              </div>
              <div>
                <label className="field-label">Rotation Duration (seconds)</label>
                <input
                  type="number"
                  min="10"
                  {...register("rotationDuration")}
                  className={`field-input ${errors.rotationDuration ? "error" : ""}`}
                />
                {errors.rotationDuration && <p className="field-error">{errors.rotationDuration.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="btn-primary w-full py-2.5 mt-auto disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting || uploading
                  ? <><Loader2 size={14} className="animate-spin" /> Submitting...</>
                  : "Submit for Approval"
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
