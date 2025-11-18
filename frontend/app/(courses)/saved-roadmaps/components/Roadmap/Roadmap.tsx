import api from "@/app/helpers/api";
import Link from "next/link";
import React, {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export default function Roadmap({
  id,
  roadmap,
  learnedCourses,
  setLearnedCourses,
  removeRoadmap,
}: {
  id: string;
  roadmap: string[];
  learnedCourses: Set<string>;
  setLearnedCourses: Dispatch<SetStateAction<Set<string>>>;
  removeRoadmap: Dispatch<string>;
}) {
  const [progress, setProgress] = useState(0);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    setProgress(
      Math.round(
        (roadmap.filter((course) => learnedCourses.has(course)).length /
          roadmap.length) *
          100
      )
    );
  }, []);
  const markAsLearned = async (name: string) => {
    await api.post("/courses/add_learned_course/", { name });
    setLearnedCourses(
      (prevLearnedCourses) => new Set(prevLearnedCourses.add(name))
    );
  };

  const removeFromLearned = async (name: string) => {
    await api.post("/courses/remove_learned_course/", { name });
    setLearnedCourses((prevLearnedCourses) => {
      prevLearnedCourses.delete(name);
      return new Set(prevLearnedCourses);
    });
  };

  return (
    <div className="flex flex-col gap-5 p-10 mx-10 md:mx-20 lg:mx-30 my-5 rounded-2xl bg-base-200 w-[80%]">
      <div className="flex flex-row flex-wrap gap-2 justify-center items-center">
        {roadmap.map((name, index) => (
          <React.Fragment key={index}>
            <div className="dropdown dropdown-center cursor-pointer">
              <button
                className={`rounded-lg btn btn-outline ${
                  learnedCourses.has(name) && "btn-info"
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
                {learnedCourses.has(name) ? (
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
      <div className="text-center py-2">
        <button
          className="btn btn-soft btn-primary btn-sm rounded-4xl"
          onClick={() => setCollapsed((prevState) => !prevState)}
        >
          {collapsed ? "Show" : "Hide"} progress
        </button>
        {"  "}
        <button
          className="btn btn-soft btn-error btn-sm rounded-4xl"
          onClick={() => removeRoadmap(id)}
        >
          Remove Roadmap
        </button>
        {!collapsed && (
          <div className="mx-auto flex flex-row flex-wrap gap-10 justify-center items-center font-semibold pt-5">
            <div>
              Completed:{"  "}
              <div
                className="radial-progress text-success"
                style={{ "--value": progress } as CSSProperties}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              >
                {progress}%
              </div>
            </div>
            <div>
              Remaining:{"  "}
              <div
                className="radial-progress text-error"
                style={{ "--value": 100 - progress } as CSSProperties}
                aria-valuenow={100 - progress}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              >
                {100 - progress}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
