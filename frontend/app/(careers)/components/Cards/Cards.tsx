import Cookies from "js-cookie";
import api from "@/app/helpers/api";
import { useEffect, useState } from "react";
import { JobType, CourseType } from "./types";
import JobCard from "./JobCard";
import CourseCard from "./CourseCard";

export default function Cards({
  content,
  saved = false,
  type,
}: {
  content: JobType[] | CourseType[];
  saved?: boolean;
  type: "job" | "course";
}) {
  const [savedCareers, setSavedCareers] = useState(new Set());
  useEffect(() => {
    if (!Cookies.get("token")) return;
    const fetchSaved = async () => {
      const response = await api.get(`/${type}s/saved_${type}s/`);
      const savedSet = new Set();
      type === "job"
        ? response.data.jobs.map((savedJob: JobType) =>
            savedSet.add(savedJob.id),
          )
        : response.data.courses.map((savedCourse: CourseType) =>
            savedSet.add(savedCourse.id),
          );
      setSavedCareers(savedSet);
    };
    if (!saved) fetchSaved();
  }, []);

  return (
    <>
      <div className="mt-10 m-5 md:mx-20 lg:mx-30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center items-stretch animate-fadeIn">
        {content.map((career, index) => (
          <div
            className="card bg-base-100 shadow-xl hover:shadow-2xl w-full border border-base-300 rounded-2xl modern-card overflow-hidden"
            key={index}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {type === "job" ? (
              <JobCard
                job={career as JobType}
                saveStatus={saved || savedCareers.has(career.id)}
              />
            ) : (
              <CourseCard
                course={career as CourseType}
                saveStatus={saved || savedCareers.has(career.id)}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
