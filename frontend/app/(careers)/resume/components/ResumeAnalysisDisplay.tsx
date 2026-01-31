"use client";

import Link from "next/link";

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
      Critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      Important:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      "Nice to have":
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    };
    return colors[importance] || colors["Nice to have"];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {analysis.filename}
            </p>
            {analysis.target_role && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Target Role: {analysis.target_role}
              </p>
            )}
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <span>🔄</span>
            Analyze Another
          </button>
        </div>

        {/* Overall Score */}
        <div className="text-center py-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Overall Score
          </p>
          <p
            className={`text-6xl font-bold ${getScoreColor(feedback.overall_score)}`}
          >
            {feedback.overall_score}
            <span className="text-2xl">/100</span>
          </p>
        </div>
      </div>

      {/* Strengths */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">✅</span>
          Strengths
        </h3>
        <ul className="space-y-2">
          {feedback.strengths.map((strength, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
            >
              <span className="text-green-600 dark:text-green-400 mt-1">•</span>
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">❌</span>
          Areas for Improvement
        </h3>
        <ul className="space-y-2">
          {feedback.weaknesses.map((weakness, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
            >
              <span className="text-red-600 dark:text-red-400 mt-1">•</span>
              {weakness}
            </li>
          ))}
        </ul>
      </div>

      {/* Skill Gaps */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
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
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {gap.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Improvement Suggestions
        </h3>
        <ul className="space-y-2">
          {feedback.improvement_suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
            >
              <span className="text-blue-600 dark:text-blue-400 mt-1">
                {index + 1}.
              </span>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Courses */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📚</span>
          Recommended Courses
        </h3>
        <ul className="space-y-2">
          {feedback.recommended_courses.map((course, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
            >
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
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg"
          >
            <span>🎓</span>
            Explore Courses for {analysis.target_role}
            <span>→</span>
          </Link>
        )}
      </div>

      {/* Formatting Tips */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📝</span>
          Formatting Tips
        </h3>
        <ul className="space-y-2">
          {feedback.formatting_tips.map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
            >
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
