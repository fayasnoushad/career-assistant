import api from "@/app/helpers/api";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";

export default function Roadmap({
  roadmap,
  learnedCourses,
  setLearnedCourses,
}: {
  roadmap: string[];
  learnedCourses: string[];
  setLearnedCourses: Dispatch<SetStateAction<string[]>>;
}) {
  const markAsLearned = async (name: string) => {
    await api.post("/courses/add_learned_course/", { name });
    setLearnedCourses((prevLearnedCourses) => [...prevLearnedCourses, name]);
  };

  const removeFromLearned = async (name: string) => {
    await api.post("/courses/remove_learned_course/", { name });
    setLearnedCourses((prevLearnedCourses) =>
      prevLearnedCourses.filter((course) => course !== name)
    );
  };

  return (
    <div className="flex flex-row flex-wrap justify-center items-center gap-2 mx-10 p-10 md:mx-20 lg:mx-30 my-5  rounded-2xl bg-base-200 w-[80%]">
      {roadmap.map((name, index) => (
        <React.Fragment key={index}>
          <div className="dropdown dropdown-center cursor-pointer">
            <button
              className={`rounded-lg btn btn-outline ${
                learnedCourses.includes(name) && "btn-info"
              }`}
              tabIndex={0}
              role="button"
            >
              {name}
            </button>
            <ul
              tabIndex={-1}
              className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
            >
              <Link
                href={"/courses?name=" + name}
                target="_blank"
                className="btn btn-ghost rounded-lg"
              >
                Get Courses
              </Link>
              {learnedCourses.includes(name) ? (
                <div
                  className="btn btn-ghost rounded-lg"
                  onClick={() => removeFromLearned(name)}
                >
                  Remove from learned
                </div>
              ) : (
                <div
                  className="btn btn-ghost rounded-lg"
                  onClick={() => markAsLearned(name)}
                >
                  Mark as learned
                </div>
              )}
            </ul>
          </div>
          {index < roadmap.length - 1 && <span>-&gt;</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
