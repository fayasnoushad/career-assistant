"use client";
import api from "@/app/helpers/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import Roadmap from "./components/Roadmap";
import Loading from "@/app/loading";
import { showModal } from "@/app/helpers/modal-manager";
import { useAuthStore } from "@/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Roadmap = {
    id: string;
    roadmap: string[];
};

export default function SavedRoadmaps() {
    const loginStatus = useAuthStore((state) => state.loginStatus);
    const queryClient = useQueryClient();

    const fetchRoadmaps = async () => {
        const response = await api.get("/courses/saved_roadmaps/");
        return response.data.roadmaps as Roadmap[];
    };

    const {
        data: roadmaps,
        isPending,
        isSuccess,
    } = useQuery({
        queryKey: ["saved-roadmaps"],
        queryFn: fetchRoadmaps,
        staleTime: 5 * 60 * 1000,
    });

    const deleteRoadmap = useMutation({
        mutationFn: async (id: string) =>
            await api.post("/courses/remove_roadmap/", { id }),
        onMutate: (roadmapId) =>
            queryClient.setQueryData<Roadmap[]>(
                ["saved-roadmaps"],
                (prevRoadmaps) =>
                    prevRoadmaps?.filter(
                        (roadmap) => roadmap.id !== roadmapId,
                    ) ?? [],
            ),
        onSuccess: () =>
            showModal({
                title: "Deleted",
                message: "Roadmap removed successfully!",
                type: "success",
                onConfirm: () => {},
            }),
        onError: () =>
            showModal({
                title: "Error",
                message: "Failed to delete roadmap",
                type: "error",
                onConfirm: () => {},
            }),
    });

    const [learnedCourses, setLearnedCourses] = useState<Set<string>>(
        new Set(),
    );

    useEffect(() => {
        const fetchData = async () => {
            const courseResponse = await api.get("/courses/learned_courses/");
            setLearnedCourses(new Set(courseResponse.data.courses as string[]));
        };
        if (loginStatus) fetchData();
    }, []);

    const removeRoadmap = async (roadmapId: string) => {
        showModal({
            title: "Delete Roadmap",
            message:
                "Are you sure you want to remove this roadmap? This action cannot be undone.",
            type: "confirm",
            onConfirm: () => deleteRoadmap.mutate(roadmapId),
        });
    };

    return (
        <main className="flex flex-col items-center pb-10">
            <h3 className="font-bold text-2xl my-10">Saved Roadmaps</h3>
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
            {isSuccess &&
                loginStatus &&
                roadmaps.map((roadmap) => (
                    <Roadmap
                        key={roadmap.id}
                        id={roadmap.id}
                        roadmap={roadmap.roadmap}
                        learnedCourses={learnedCourses}
                        setLearnedCourses={setLearnedCourses}
                        removeRoadmap={removeRoadmap}
                    />
                ))}
        </main>
    );
}
