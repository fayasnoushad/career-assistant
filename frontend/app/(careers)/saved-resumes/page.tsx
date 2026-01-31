"use client";
import { useEffect, useState } from "react";
import api from "@/app/helpers/api";
import Loading from "@/app/components/Loading/Loading";
import { useRouter } from "next/navigation";
import { showModal } from "@/app/helpers/modal-manager";

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

export default function SavedResumes() {
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await api.get("/resumes/");
        setAnalyses(response.data.analyses);
      } catch (error) {
        showModal({
          title: "Error",
          message: "Failed to fetch analyses",
          type: "error",
          onConfirm: () => {},
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    try {
      await api.delete(`/resumes/${id}`);
      setAnalyses(analyses.filter((a) => a.id !== id));
    } catch (error) {
      showModal({
        title: "Error",
        message: "Failed to delete analysis",
        type: "error",
        onConfirm: () => {},
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="flex flex-col items-center pb-10 px-4">
      <h3 className="font-bold text-2xl my-10 flex items-center gap-2">
        <span className="text-3xl">📄</span>
        Saved Resume Analyses
      </h3>

      {loading && <Loading />}

      {!loading && analyses.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="mb-4">No resume analyses saved yet!</p>
          <button
            onClick={() => router.push("/resume")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            Analyze Your First Resume
          </button>
        </div>
      )}

      {!loading && analyses.length > 0 && (
        <div className="w-full max-w-4xl space-y-4">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <span>📄</span>
                    {analysis.filename}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Uploaded: {formatDate(analysis.upload_date)}
                  </p>
                  {analysis.target_role && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Target Role: {analysis.target_role}
                    </p>
                  )}
                  {analysis.experience_level && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Experience: {analysis.experience_level}
                    </p>
                  )}
                </div>

                <div className="text-center ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Score
                  </p>
                  <p
                    className={`text-3xl font-bold ${getScoreColor(
                      analysis.feedback.overall_score,
                    )}`}
                  >
                    {analysis.feedback.overall_score}
                  </p>
                </div>
              </div>

              {/* Quick Summary */}
              <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <p className="font-semibold text-green-800 dark:text-green-400 mb-1">
                    ✅ Strengths
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {analysis.feedback.strengths.length} identified
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                  <p className="font-semibold text-red-800 dark:text-red-400 mb-1">
                    ❌ Weaknesses
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {analysis.feedback.weaknesses.length} to address
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-400 mb-1">
                    ⚠️ Skill Gaps
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {analysis.feedback.skill_gaps.length} missing
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(analysis.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
