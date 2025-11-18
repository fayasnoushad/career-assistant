"use client";
import { useEffect, useState } from "react";
import Cards from "../components/Cards/Cards";
import Loading from "@/app/components/Loading/Loading";
import api from "@/app/helpers/api";

export default function SavedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchCourses = async () => {
      const response = await api.get("/courses/saved_courses/");
      setCourses(response.data.courses);
    };
    fetchCourses();
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <main className="flex flex-col items-center pb-10">
      <h3 className="font-bold text-2xl my-10">Saved Courses</h3>
      {loading && <Loading />}
      {!loading && courses && courses.length > 0 && (
        <Cards content={courses} saved={true} />
      )}
      {!loading && courses.length === 0 && "No courses saved!"}
    </main>
  );
}
