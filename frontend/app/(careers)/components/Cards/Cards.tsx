import Link from "next/link";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import api from "@/app/helpers/api";

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

function JobCard({ job }: { job: JobType }) {
  return (
    <div className="card-body">
      <h2 className="card-title mb-2">{job.name}</h2>
      <span>
        <b>Company:</b> {job.company}
      </span>
      <span>
        <b>Location:</b> {job.location ? job.location : "Not found"}
      </span>
      <span>
        <b>Salary:</b>{" "}
        {job.salary && job.salary !== 0
          ? job.salary + " per month"
          : "Not disclosed"}
      </span>
      <span>
        <b>Description: </b>
        <span
          className="cursor-pointer text-blue-600"
          onClick={() => {
            const modal = document.getElementById(
              `description-modal-${job.id}`
            );
            if (modal) {
              (modal as HTMLDialogElement).showModal();
            }
          }}
        >
          show description
        </span>
      </span>
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
      <div className="flex justify-center card-actions pt-4">
        <Link
          href={job.link}
          target="_blank"
          className="btn btn-soft rounded-lg btn-sm md:btn-md"
        >
          Open in Job Website
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
      <h3 className="card-title mb-2">{course.title}</h3>
      <span>
        <b>Channel:</b>{" "}
        <Link href={course.channel_link} target="_blank">
          {course.channel}
        </Link>
      </span>
      <span>
        <b>Duration:</b> {course.duration ? course.duration : "Not specified"}
      </span>
      <span>
        <b>Level:</b> {course.level ? course.level : "Not specified"}
      </span>
      <div className="flex justify-center md:justify-end card-actions pt-4">
        {isLogin && (
          <button
            className="btn btn-soft btn-sm md:btn-md rounded-lg"
            onClick={toggleSaved}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={saved ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-[1.2em]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            {saved ? "Unsave" : "Save"}
          </button>
        )}
        <Link
          href={course.link}
          target="_blank"
          className="btn btn-soft btn-sm md:btn-md rounded-lg"
        >
          Open in Course Website
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
  const [savedCourses, setSavedCourses] = useState(new Set());
  useEffect(() => {
    if (!Cookies.get("token")) return;
    const fetchCourses = async () => {
      const response = await api.get("/courses/saved_courses/");
      const savedCourseSet = new Set();
      response.data.courses.map((savedCourse: CourseType) =>
        savedCourseSet.add(savedCourse.id)
      );
      setSavedCourses(savedCourseSet);
    };
    if (!saved) fetchCourses();
  }, []);

  return (
    <div className="m-5 md:mx-20 lg:mx-30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center items-center">
      {content.map((career, index) => (
        <div className="card card-md bg-base-200 shadow-sm w-full" key={index}>
          {type === "job" ? (
            <JobCard job={career as JobType} />
          ) : (
            <CourseCard
              course={career as CourseType}
              saveStatus={saved || savedCourses.has(career.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
