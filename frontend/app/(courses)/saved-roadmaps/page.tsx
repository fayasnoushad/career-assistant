"use client";
import api from "@/app/helpers/api";
import { useEffect, useState } from "react";
import Roadmap from "./components/Roadmap/Roadmap";
import Loading from "@/app/components/Loading/Loading";

export default function SavedRoadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [learnedCourses, setLearnedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const roadmapResponse = await api.get("/courses/saved_roadmaps/");
      setRoadmaps(roadmapResponse.data.roadmaps);
      const courseResponse = await api.get("/courses/learned_courses/");
      setLearnedCourses(courseResponse.data.courses);
    };
    fetchData();
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <main className="flex flex-col items-center pb-10">
      <h3 className="font-bold text-2xl my-10">Saved Roadmaps</h3>
      {loading && <Loading />}
      {!loading &&
        roadmaps.map((roadmap, index) => (
          <Roadmap
            key={index}
            roadmap={roadmap}
            learnedCourses={learnedCourses}
            setLearnedCourses={setLearnedCourses}
          />
        ))}
    </main>
  );
}
