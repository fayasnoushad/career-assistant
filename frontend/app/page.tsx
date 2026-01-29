"use client";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [loginStatus, setLoginStatus] = useState(false);

  const check = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          setLoginStatus(true);
          return;
        } else Cookies.remove("token");
      } catch {}
      setLoginStatus(false);
    }
  };

  useEffect(() => {
    check();
  }, []);

  return (
    <main className="flex flex-col justify-center items-center text-center h-full mx-5 animate-fadeIn">
      <div className="max-w-4xl space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-slideIn">
          Welcome to Career Assistant
        </h1>
        <p className="text-xl md:text-2xl text-base-content/80 font-light max-w-2xl mx-auto">
          Discover your dream career with AI-powered job matching and
          personalized learning paths
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Link
            className="btn btn-lg bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            href="/careers/"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Find Jobs & Courses
          </Link>
          {loginStatus ? (
            <>
              <Link
                className="btn btn-lg btn-outline rounded-full hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-300"
                href="/saved-jobs"
              >
                View Saved Jobs
              </Link>
              <Link
                className="btn btn-lg btn-outline rounded-full hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-300"
                href="/saved-roadmaps"
              >
                View Saved Roadmaps
              </Link>
            </>
          ) : (
            <Link
              className="btn btn-lg btn-outline rounded-full hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-300"
              href="/login"
            >
              Login to Get Started
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="p-6 rounded-2xl bg-linear-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">AI-Powered Matching</h3>
            <p className="text-sm text-base-content/70">
              Get personalized job recommendations based on your skills and
              interests
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-bold text-lg mb-2">Learning Paths</h3>
            <p className="text-sm text-base-content/70">
              Discover courses tailored to your career goals and skill gaps
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-linear-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-sm border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-bold text-lg mb-2">Career Growth</h3>
            <p className="text-sm text-base-content/70">
              Track your progress and visualize your career development roadmap
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
