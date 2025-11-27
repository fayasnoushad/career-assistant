"use client";
import { useEffect, useState } from "react";
import Cards from "../components/Cards/Cards";
import Loading from "@/app/components/Loading/Loading";
import api from "@/app/helpers/api";

export default function SavedJobs() {
  const [job, setjob] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchJobs = async () => {
      const response = await api.get("/jobs/saved_jobs/");
      setjob(response.data.jobs);
    };
    fetchJobs();
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <main className="flex flex-col items-center pb-10">
      <h3 className="font-bold text-2xl my-10">Saved Jobs</h3>
      {loading && <Loading />}
      {!loading && job && job.length > 0 && (
        <Cards type="job" content={job} saved={true} />
      )}
      {!loading && job.length === 0 && "No job saved!"}
    </main>
  );
}
