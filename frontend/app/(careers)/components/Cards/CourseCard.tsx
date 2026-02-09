import Link from "next/link";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import api from "@/app/helpers/api";
import { useSelector } from "react-redux";
import { CourseType } from "./types";

export default function CourseCard({
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
