"use client";
import api from "@/app/helpers/api";
import { useEffect, useState } from "react";
import Roadmap from "./components/Roadmap/Roadmap";
import Loading from "@/app/components/Loading/Loading";

export default function SavedRoadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchRoadmaps = async () => {
      const response = await api.get("/courses/saved_roadmaps");
      setRoadmaps(response.data.roadmaps);
    };
    fetchRoadmaps();
    setTimeout(() => setLoading(false), 500);
  }, []);
  return (
    <main className="flex flex-col items-center pb-10">
      <h3 className="font-bold text-2xl my-10">Saved Roadmaps</h3>
      {loading && <Loading />}
      {roadmaps.map((roadmap, index) => (
        <Roadmap key={index} roadmap={roadmap} />
      ))}
    </main>
  );
}
