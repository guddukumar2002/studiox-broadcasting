"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { SUBJECTS } from "../../../utils/mockData";
import { contentService } from "../../../services/content.service";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Upload, Image as ImageIcon, X, Calendar, Clock,
  Type, BookOpen, ArrowRight, Loader2, AlertCircle, CheckCircle2,
} from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const uploadSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    subject: z.string().min(1, "Subject is required"),
    description: z.string().min(1, "Description is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    rotationDuration: z.coerce.number().min(10, "Minimum 10 seconds"),
  })
  .refine((d) => new Date(d.endTime) > new Date(d.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export default function UploadContentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [filePreview, setFilePreview] = useState(null);
  const [fileData, setFileData] = useState("");
  const [fileError, setFileError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: { rotationDuration: 30 },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError("Only JPG, PNG, and GIF files are allowed.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setFileError("File size must be less than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
      setFileData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setFilePreview(null);
    setFileData("");
    setFileError("");
  };

  const onSubmit = async (values) => {
    if (!fileData) {
      setFileError("Please upload an image file.");
      return;
    }
    try {
      await contentService.create({
        ...values,
        fileUrl: fileData,
        teacherId: user?.id,
        teacherName: user?.name,
      });
      toast.success("Content submitted for approval!");
      setSuccess(true);
      setTimeout(() => router.push("/teacher/content"), 1500);
    } catch (err) {
      toast.error(err.message || "Upload failed. Please try again.");
    }
  };

  if (success) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-lg"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Submitted Successfully!</h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Your content has been sent to the Principal for approval. Redirecting...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Upload Content</h1>
          <p className="text-slate-500 mt-1 font-medium">Create a new broadcast for your students.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="md:col-span-7 space-y-6">
            {/* File Upload */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <label className="block text-xs font-black text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                <ImageIcon className="w-4 h-4 text-blue-600" /> Preview Thumbnail
              </label>
              {filePreview ? (
                <div className="relative rounded-3xl overflow-hidden aspect-video border border-slate-200 shadow-inner">
                  <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white shadow-xl hover:scale-110 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <span className="text-sm font-bold text-slate-600">Click to upload lesson image</span>
                  <span className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-black">JPG, PNG, GIF · Max 10MB</span>
                  <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.gif" onChange={handleFileChange} />
                </label>
              )}
              {fileError && (
                <p className="mt-3 text-xs text-red-500 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {fileError}
                </p>
              )}
            </div>

            {/* Title & Subject */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Type className="w-4 h-4 text-blue-600" /> Lesson Title
                </label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="e.g. Advanced Quantum Mechanics"
                  className={`w-full bg-slate-50 border rounded-2xl py-4 px-5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium ${errors.title ? "border-red-300 bg-red-50" : "border-slate-200"}`}
                />
                {errors.title && <p className="text-xs text-red-500 font-semibold ml-1">{errors.title.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Subject Category
                </label>
                <select
                  {...register("subject")}
                  className={`w-full bg-slate-50 border rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all appearance-none cursor-pointer font-medium ${errors.subject ? "border-red-300 bg-red-50" : "border-slate-200"}`}
                >
                  <option value="">Select a subject</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.subject && <p className="text-xs text-red-500 font-semibold ml-1">{errors.subject.message}</p>}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Lesson Description</label>
                <textarea
                  rows="4"
                  {...register("description")}
                  placeholder="Provide a brief summary..."
                  className={`w-full bg-slate-50 border rounded-2xl py-4 px-5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all resize-none font-medium ${errors.description ? "border-red-300 bg-red-50" : "border-slate-200"}`}
                />
                {errors.description && <p className="text-xs text-red-500 font-semibold ml-1">{errors.description.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" /> Start Time
                </label>
                <input
                  type="datetime-local"
                  {...register("startTime")}
                  className={`w-full bg-slate-50 border rounded-2xl py-4 px-5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all ${errors.startTime ? "border-red-300 bg-red-50" : "border-slate-200"}`}
                />
                {errors.startTime && <p className="text-xs text-red-500 font-semibold ml-1">{errors.startTime.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" /> End Time
                </label>
                <input
                  type="datetime-local"
                  {...register("endTime")}
                  className={`w-full bg-slate-50 border rounded-2xl py-4 px-5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all ${errors.endTime ? "border-red-300 bg-red-50" : "border-slate-200"}`}
                />
                {errors.endTime && <p className="text-xs text-red-500 font-semibold ml-1">{errors.endTime.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Rotation Duration (seconds)</label>
                <input
                  type="number"
                  min="10"
                  {...register("rotationDuration")}
                  className={`w-full bg-slate-50 border rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium ${errors.rotationDuration ? "border-red-300 bg-red-50" : "border-slate-200"}`}
                />
                {errors.rotationDuration && <p className="text-xs text-red-500 font-semibold ml-1">{errors.rotationDuration.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>Submit for Approval <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
