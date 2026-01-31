"use client";
import api from "@/app/helpers/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getLoginStatus } from "@/app/helpers/auth";
import Roadmap from "./components/Roadmap/Roadmap";
import Loading from "@/app/components/Loading/Loading";
import { showModal } from "@/app/helpers/modal-manager";

type Roadmap = {
  id: string;
  roadmap: string[];
};

export default function SavedRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [learnedCourses, setLearnedCourses] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const loggedIn = await getLoginStatus();
      setLoginStatus(loggedIn);
      if (!loggedIn) {
        setLoading(false);
        return;
      }
      const roadmapResponse = await api.get("/courses/saved_roadmaps/");
      setRoadmaps(roadmapResponse.data.roadmaps);
      const courseResponse = await api.get("/courses/learned_courses/");
      setLearnedCourses(new Set(courseResponse.data.courses as string[]));
      setTimeout(() => setLoading(false), 500);
    };
    fetchData();
  }, []);

  const removeRoadmap = async (roadmapId: string) => {
    showModal({
      title: "Delete Roadmap",
      message:
        "Are you sure you want to remove this roadmap? This action cannot be undone.",
      type: "confirm",
      onConfirm: async () => {
        await api.post("/courses/remove_roadmap/", { id: roadmapId });
        setRoadmaps((prevRoadmaps) =>
          prevRoadmaps.filter((roadmap) => roadmap.id !== roadmapId),
        );
        showModal({
          title: "Deleted",
          message: "Roadmap removed successfully!",
          type: "success",
          onConfirm: () => {},
        });
      },
    });
  };

  return (
    <main className="flex flex-col items-center pb-10">
      <h3 className="font-bold text-2xl my-10">Saved Roadmaps</h3>
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
      {!loading &&
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
