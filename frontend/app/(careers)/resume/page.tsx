"use client";
import { useState } from "react";
import api from "@/app/helpers/api";
import Loading from "@/app/components/Loading/Loading";
import ResumeUploadForm from "./components/ResumeUploadForm";
import ResumeAnalysisDisplay from "./components/ResumeAnalysisDisplay";
import Cookies from "js-cookie";

interface SkillGap {
  skill: string;
  importance: string;
  reason: string;
}

interface ResumeFeedback {
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  skill_gaps: SkillGap[];
  improvement_suggestions: string[];
  recommended_courses: string[];
  formatting_tips: string[];
}

interface ResumeAnalysis {
  id: string;
  filename: string;
  upload_date: string;
  target_role?: string;
  experience_level?: string;
  feedback: ResumeFeedback;
}

export default function ResumePage() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (
    file: File,
    targetRole: string,
    experienceLevel: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (targetRole) formData.append("target_role", targetRole);
      if (experienceLevel) formData.append("experience_level", experienceLevel);

      const token = Cookies.get("token");
      const response = await api.post("/resumes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setAnalysis(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Failed to analyze resume. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <main className="flex flex-col items-center pb-10 px-4 max-w-7xl mx-auto">
      <div className="w-full max-w-4xl">
        <div className="text-center my-10">
          <h1 className="font-bold text-3xl mb-3 flex items-center justify-center gap-2">
            <span className="text-4xl">📄</span>
            Resume Analysis & Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your resume to receive comprehensive skill-gap analysis and
            improvement suggestions
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="my-20">
            <Loading />
            <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
              Analyzing your resume... This may take a moment.
            </p>
          </div>
        )}

        {!loading && !analysis && <ResumeUploadForm onUpload={handleUpload} />}

        {!loading && analysis && (
          <ResumeAnalysisDisplay analysis={analysis} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
