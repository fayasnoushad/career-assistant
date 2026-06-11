"use client";

import Link from "next/link";
import Cards from "../components/Cards/Cards";
import Loading from "@/app/loading";
import api from "@/app/helpers/api";
import { useAuthStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { CourseType } from "../components/Cards/types";

export default function SavedCourses() {
    const loginStatus = useAuthStore((state) => state.loginStatus);

    const fetchCourses = async () => {
        const response = await api.get("/courses/saved_courses/");
        return response.data.courses as CourseType[];
    };

    const {
        data: courses,
        isPending,
        isSuccess,
    } = useQuery({
        queryKey: ["saved-courses"],
        queryFn: fetchCourses,
        staleTime: 5 * 60 * 1000,
    });

    return (
        <main className="flex flex-col items-center pb-10">
            <h3 className="font-bold text-2xl my-10">Saved Courses</h3>
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
            {isSuccess && loginStatus && courses && courses.length > 0 && (
                <Cards type="course" content={courses} saved={true} />
            )}
            {isSuccess &&
                loginStatus &&
                courses.length === 0 &&
                "No courses saved!"}
        </main>
    );
}
