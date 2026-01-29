import Link from "next/link";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import api from "@/app/helpers/api";
import { useSelector } from "react-redux";

type JobType = {
  id: string;
  name: string;
  company?: string;
  location?: string;
  salary?: number;
  link: string;
  description: string;
  time: string;
};

type CourseType = {
  id: string;
  title: string;
  channel: string;
  channel_link: string;
  duration: string | null;
  level: string | null;
  link: string;
};

function JobCard({ job, saveStatus }: { job: JobType; saveStatus: boolean }) {
  const hasApiKey = useSelector((state: any) => state.apiKey.hasApiKey);
  const isLogin = Boolean(Cookies.get("token"));
  const [saved, isSaved] = useState(false);

  const [salary, setSalary] = useState<string | number | null>(null);
  useEffect(() => {
    isSaved(saveStatus);
    setSalary(job.salary || null);
  }, []);

  const toggleSaved = async () => {
    isSaved((prevSaved) => !prevSaved);
    await api.post(`/jobs/${saved ? "unsave" : "save"}/`, { id: job.id });
  };

  const predictSalary = async (e: React.MouseEvent) => {
    e.preventDefault();
    const response = await api.post("/jobs/predict_salary/", { id: job.id });
    setSalary(response.data.salary);
  };

  return (
    <div className="card-body">
      <h2 className="card-title mb-3 text-xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        {job.name}
      </h2>
      <div className="space-y-2 text-base-content/80">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏢</span>
          <span>
            <b>Company:</b> {job.company}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">📍</span>
          <span>
            <b>Location:</b> {job.location ? job.location : "Not found"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">💰</span>
          <span>
            <b>Salary:</b>{" "}
            {salary ? (
              <span className="text-green-600 font-semibold">
                {salary} per month
              </span>
            ) : (
              <>
                Not disclosed
                {hasApiKey && (
                  <>
                    {", "}
                    <span
                      onClick={(e) => predictSalary(e)}
                      className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium underline"
                    >
                      predict salary
                    </span>
                  </>
                )}
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">📄</span>
          <span>
            <b>Description: </b>
            <span
              className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium underline"
              onClick={() => {
                const modal = document.getElementById(
                  `description-modal-${job.id}`,
                );
                if (modal) {
                  (modal as HTMLDialogElement).showModal();
                }
              }}
            >
              show description
            </span>
          </span>
        </div>
      </div>
      <dialog id={`description-modal-${job.id}`} className="modal">
        <div className="modal-box md:min-w-3/5 h-[60%]">
          <h3 className="font-bold text-lg m-2 md:mx-4 lg:mx-6">{job.name}</h3>
          <p className="m-2 mt-4 md:m-4 lg:mx-6">
            {job.description.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
          <div className="modal-action flex justify-center md:justify-end">
            <form method="dialog">
              <button className="btn btn-soft rounded-lg">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <div className="flex justify-center md:justify-end card-actions pt-5 gap-2">
        {isLogin && (
          <button
            className={`btn btn-sm md:btn-md rounded-full transition-all duration-300 transform hover:scale-105 ${
              saved
                ? "bg-linear-to-r from-pink-500 to-rose-500 text-white border-0 hover:from-pink-600 hover:to-rose-600"
                : "btn-outline border-2"
            }`}
            onClick={toggleSaved}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={saved ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            {saved ? "Saved" : "Save"}
          </button>
        )}
        <Link
          href={job.link}
          target="_blank"
          className="btn btn-sm md:btn-md bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          View Job
        </Link>
      </div>
    </div>
  );
}

function CourseCard({
  course,
  saveStatus,
}: {
  course: CourseType;
  saveStatus: boolean;
}) {
  const isLogin = Boolean(Cookies.get("token"));
  const [saved, isSaved] = useState(false);

  useEffect(() => {
    isSaved(saveStatus);
  }, []);

  const toggleSaved = async () => {
    isSaved((prevSaved) => !prevSaved);
    await api.post(`/courses/${saved ? "unsave" : "save"}/`, { id: course.id });
  };

  return (
    <div className="card-body">
      <h3 className="card-title mb-3 text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
        {course.title}
      </h3>
      <div className="space-y-2 text-base-content/80">
        <div className="flex items-center gap-2">
          <span className="text-lg">📺</span>
          <span>
            <b>Channel:</b>{" "}
            <Link
              href={course.channel_link}
              target="_blank"
              className="text-purple-600 hover:text-purple-700 font-medium underline"
            >
              {course.channel}
            </Link>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">⏱️</span>
          <span>
            <b>Duration:</b>{" "}
            {course.duration ? course.duration : "Not specified"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <span>
            <b>Level:</b> {course.level ? course.level : "Not specified"}
          </span>
        </div>
      </div>
      <div className="flex justify-center md:justify-end card-actions pt-5 gap-2">
        {isLogin && (
          <button
            className={`btn btn-sm md:btn-md rounded-full transition-all duration-300 transform hover:scale-105 ${
              saved
                ? "bg-linear-to-r from-pink-500 to-rose-500 text-white border-0 hover:from-pink-600 hover:to-rose-600"
                : "btn-outline border-2"
            }`}
            onClick={toggleSaved}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={saved ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            {saved ? "Saved" : "Save"}
          </button>
        )}
        <Link
          href={course.link}
          target="_blank"
          className="btn btn-sm md:btn-md bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          View Course
        </Link>
      </div>
    </div>
  );
}

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
    <div className="m-5 md:mx-20 lg:mx-30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center items-stretch animate-fadeIn">
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
  );
}
