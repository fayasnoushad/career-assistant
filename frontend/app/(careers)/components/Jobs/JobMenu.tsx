import React from "react";

export default function JobMenu({
  menuSelected,
  setMenuSelected,
}: {
  menuSelected: "jobList" | "about";
  setMenuSelected: React.Dispatch<React.SetStateAction<"jobList" | "about">>;
}) {
  return (
    <div className="flex flex-row justify-center items-center gap-2 my-5">
      <button
        className={`btn btn-secondary ${menuSelected === "jobList" ? "" : "btn-outline"} rounded`}
        onClick={() => setMenuSelected("jobList")}
      >
        List of Jobs
      </button>
      <button
        className={`btn btn-secondary ${menuSelected === "about" ? "" : "btn-outline"} rounded`}
        onClick={() => setMenuSelected("about")}
      >
        More about the Job
      </button>
    </div>
  );
}
