"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { API_URL } from "@/app/config";
import { showModal } from "@/app/helpers/modal-manager";
import { CSSProperties } from "react";

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

interface ResumeAnalysisDisplayProps {
  analysis: ResumeAnalysis;
  onReset: () => void;
}

export default function ResumeAnalysisDisplay({
  analysis,
  onReset,
}: ResumeAnalysisDisplayProps) {
  const { feedback } = analysis;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getImportanceBadge = (importance: string) => {
    const colors: Record<string, string> = {
      Critical: "bg-error/10 text-error",
      Important: "bg-warning/10 text-warning",
      "Nice to have": "bg-primary/10 text-primary",
    };
    return colors[importance] || colors["Nice to have"];
  };

  const handleExport = async (format: "pdf" | "docx") => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${API_URL}/resumes/${analysis.id}/export?format=${format}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume_analysis_${analysis.filename.split(".")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      showModal({
        title: "Export Failed",
        message: "Failed to export analysis. Please try again.",
        type: "error",
        onConfirm: () => {},
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-base-300 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
            <p className="text-sm">{analysis.filename}</p>
            {analysis.target_role && (
              <p className="text-sm">Target Role: {analysis.target_role}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onReset} className="btn btn-soft rounded-lg">
              <span>🔄</span>
              Analyze Another
            </button>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => handleExport("pdf")}
            className="btn btn-sm btn-primary rounded-lg"
          >
            <span>📄</span>
            Export as PDF
          </button>
          <button
            onClick={() => handleExport("docx")}
            className="btn btn-sm btn-secondary rounded-lg"
          >
            <span>📝</span>
            Export as DOCX
          </button>
        </div>

        {/* Overall Score */}
        <div className="text-center py-6 bg-base-200 rounded-lg">
          <p className="text-sm mb-2 font-bold">Overall Score</p>
          <div
            className={
              "radial-progress " + getScoreColor(feedback.overall_score)
            }
            style={{ "--value": feedback.overall_score } as CSSProperties}
            aria-valuenow={feedback.overall_score}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          >
            {feedback.overall_score}%
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div className="bg-base-300 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">✅</span>
          Strengths
        </h3>
        <ul className="space-y-2">
          {feedback.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">•</span>
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="bg-base-300 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">❌</span>
          Areas for Improvement
        </h3>
        <ul className="space-y-2">
          {feedback.weaknesses.map((weakness, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-red-600 dark:text-red-400 mt-1">•</span>
              {weakness}
            </li>
          ))}
        </ul>
      </div>

      {/* Skill Gaps */}
      <div className="bg-base-300 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          Skill Gaps
        </h3>
        <div className="space-y-4">
          {feedback.skill_gaps.map((gap, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">{gap.skill}</h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getImportanceBadge(
                    gap.importance,
                  )}`}
                >
                  {gap.importance}
                </span>
              </div>
              <p className="text-sm">{gap.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="bg-base-300 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Improvement Suggestions
        </h3>
        <ul className="space-y-2">
          {feedback.improvement_suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">
                {index + 1}.
              </span>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Courses */}
      <div className="bg-base-300 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📚</span>
          Recommended Courses
        </h3>
        <ul className="space-y-2">
          {feedback.recommended_courses.map((course, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 mt-1">
                •
              </span>
              {course}
            </li>
          ))}
        </ul>
        {analysis.target_role && (
          <Link
            href={`/careers?type=course&name=${encodeURIComponent(analysis.target_role)}`}
            target="_blank"
            className="btn btn-info rounded-lg mt-4"
          >
            <span>🎓</span>
            Explore Courses for {analysis.target_role}
            <span>→</span>
          </Link>
        )}
      </div>

      {/* Formatting Tips */}
      <div className="bg-base-300 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📝</span>
          Formatting Tips
        </h3>
        <ul className="space-y-2">
          {feedback.formatting_tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 mt-1">
                •
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
