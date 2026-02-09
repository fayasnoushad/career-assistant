import React, { useState } from "react";
import Cards from "../Cards/Cards";
import { JobType } from "../Cards/types";
import AboutJob from "../AboutJob/AboutJob";
import JobMenu from "../JobMenu/JobMenu";

export default function Jobs({
  jobName,
  jobs,
}: {
  jobName: string;
  jobs: JobType[];
}) {
  const [menuSelected, setMenuSelected] = useState<"jobList" | "about">(
    "jobList",
  );
  return (
    <>
      <JobMenu menuSelected={menuSelected} setMenuSelected={setMenuSelected} />
      {menuSelected === "jobList" ? (
        <Cards content={jobs} type={"job"} />
      ) : (
        <AboutJob jobName={jobName} />
      )}
    </>
  );
}
