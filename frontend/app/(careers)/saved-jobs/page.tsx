"use client";

import Link from "next/link";
import Cards from "../components/Cards/Cards";
import Loading from "@/app/loading";
import api from "@/app/helpers/api";
import { useAuthStore } from "@/store";
import { JobType } from "../components/Cards/types";
import { useQuery } from "@tanstack/react-query";

export default function SavedJobs() {
    const loginStatus = useAuthStore((state) => state.loginStatus);

    const fetchJobs = async () => {
        const response = await api.get("/courses/saved_jobs/");
        return response.data.jobs as JobType[];
    };

    const {
        data: jobs,
        isPending,
        isSuccess,
    } = useQuery({
        queryKey: ["saved-jobs"],
        queryFn: fetchJobs,
        staleTime: 5 * 60 * 1000,
    });

    return (
        <main className="flex flex-col items-center pb-10">
            <h3 className="font-bold text-2xl my-10">Saved Jobs</h3>
            {isPending && <Loading />}
            {isSuccess && !loginStatus && (
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
            {isSuccess && loginStatus && jobs && jobs.length > 0 && (
                <Cards type="job" content={jobs} saved={true} />
            )}
            {isSuccess && loginStatus && jobs.length === 0 && "No job saved!"}
        </main>
    );
}
