"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getLoginStatus } from "@/app/helpers/auth";
import Cards from "../components/Cards/Cards";
import Loading from "@/app/components/Loading";
import api from "@/app/helpers/api";

export default function SavedJobs() {
  const [job, setjob] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const loggedIn = await getLoginStatus();
      setLoginStatus(loggedIn);
      if (!loggedIn) {
        setLoading(false);
        return;
      }
      const response = await api.get("/jobs/saved_jobs/");
      setjob(response.data.jobs);
      setTimeout(() => setLoading(false), 500);
    };
    fetchJobs();
  }, []);

  return (
    <main className="flex flex-col items-center pb-10">
      <h3 className="font-bold text-2xl my-10">Saved Jobs</h3>
      {loading && <Loading />}
      {!loading && !loginStatus && (
        <div className="text-center text-base-content/70">
          <p className="mb-4">
            Login to save roadmaps, courses, jobs, and resumes.
          </p>
          <Link
            href="/login"
            className="btn btn-md bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-full"
          >
            Login
          </Link>
        </div>
      )}
      {!loading && loginStatus && job && job.length > 0 && (
        <Cards type="job" content={job} saved={true} />
      )}
      {!loading && loginStatus && job.length === 0 && "No job saved!"}
    </main>
  );
}
