"use client";
import { useEffect, useState } from "react";
import api from "../../helpers/api";
import Loading from "../../components/Loading";

interface DashboardData {
  career_goal: string | null;
  resume_score: number | null;
  score_trend: number | null;
  resume_scores_history: number[];
  saved_jobs_count: number;
  roadmap_progress: number;
  total_roadmap_steps: number;
  learned_courses_count: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard/");
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-error/10 text-error p-6 rounded-2xl border border-error/20 max-w-md">
          <h3 className="text-lg font-bold mb-2">Error Loading Dashboard</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-base-content/60">No data available</p>
      </div>
    );
  }

  const getTrendIcon = (trend: number | null) => {
    if (trend === null) return null;
    if (trend > 0) return "📈";
    if (trend < 0) return "📉";
    return "➡️";
  };

  const getTrendColor = (trend: number | null) => {
    if (trend === null) return "text-base-content/60";
    if (trend > 0) return "text-success";
    if (trend < 0) return "text-error";
    return "text-base-content/60";
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Career Progress Dashboard
        </h1>
        <p className="text-base-content/60">
          Track your journey to career success
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Career Goal Card */}
        <div className="bg-linear-to-br from-purple-500/10 to-purple-600/10 p-6 rounded-2xl border border-purple-500/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🎯</span>
            <h3 className="text-lg font-semibold text-purple-600">
              Career Goal
            </h3>
          </div>
          <p className="text-2xl font-bold text-base-content">
            {data.career_goal || "Not set"}
          </p>
          <p className="text-sm text-base-content/60 mt-2">
            {data.career_goal
              ? "Your target role"
              : "Set a goal to get started"}
          </p>
        </div>

        {/* Resume Score Card */}
        <div className="bg-linear-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-2xl border border-blue-500/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">📄</span>
            <h3 className="text-lg font-semibold text-blue-600">
              Resume Score
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-base-content">
              {data.resume_score !== null ? `${data.resume_score}/100` : "N/A"}
            </p>
            {data.score_trend !== null && (
              <span className={`text-lg ${getTrendColor(data.score_trend)}`}>
                {getTrendIcon(data.score_trend)}{" "}
                {data.score_trend > 0 ? "+" : ""}
                {data.score_trend}
              </span>
            )}
          </div>
          <p className="text-sm text-base-content/60 mt-2">
            {data.resume_scores_history.length > 0
              ? `${data.resume_scores_history.length} analysis${
                  data.resume_scores_history.length !== 1 ? "es" : ""
                }`
              : "Upload resume to analyze"}
          </p>
        </div>

        {/* Saved Jobs Card */}
        <div className="bg-linear-to-br from-green-500/10 to-green-600/10 p-6 rounded-2xl border border-green-500/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">💼</span>
            <h3 className="text-lg font-semibold text-green-600">Saved Jobs</h3>
          </div>
          <p className="text-2xl font-bold text-base-content">
            {data.saved_jobs_count}
          </p>
          <p className="text-sm text-base-content/60 mt-2">
            {data.saved_jobs_count === 0
              ? "Start saving jobs"
              : "Jobs bookmarked"}
          </p>
        </div>

        {/* Roadmap Progress Card */}
        <div className="bg-linear-to-br from-orange-500/10 to-orange-600/10 p-6 rounded-2xl border border-orange-500/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🗺️</span>
            <h3 className="text-lg font-semibold text-orange-600">
              Roadmap Progress
            </h3>
          </div>
          <p className="text-2xl font-bold text-base-content">
            {data.roadmap_progress.toFixed(0)}%
          </p>
          <div className="w-full bg-base-300 rounded-full h-2 mt-3">
            <div
              className="bg-linear-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.roadmap_progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-base-content/60 mt-2">
            {data.learned_courses_count} of {data.total_roadmap_steps} steps
            completed
          </p>
        </div>
      </div>

      {/* Resume Score Trend Chart */}
      {data.resume_scores_history.length > 0 && (
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📊</span> Resume Score Trend
          </h2>
          <div className="flex items-end justify-around h-64 gap-2">
            {data.resume_scores_history
              .slice()
              .reverse()
              .map((score, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  <div className="relative flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-linear-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-700"
                      style={{ height: `${score}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-bold bg-base-100 px-2 py-1 rounded shadow-md">
                        {score}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-base-content/60">
                    #{data.resume_scores_history.length - index}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/resume"
            className="btn btn-outline border-2 hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-300"
          >
            📄 Analyze Resume
          </a>
          <a
            href="/careers"
            className="btn btn-outline border-2 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-300"
          >
            🎯 Find Jobs
          </a>
          <a
            href="/saved-roadmaps"
            className="btn btn-outline border-2 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300"
          >
            🗺️ View Roadmaps
          </a>
          <a
            href="/saved-jobs"
            className="btn btn-outline border-2 hover:bg-green-500/10 hover:border-green-500 transition-all duration-300"
          >
            💼 Saved Jobs
          </a>
        </div>
      </div>
    </main>
  );
}
