import { useEffect, useState } from "react";
import Cards from "../Cards/Cards";
import { JobType } from "../Cards/types";
import AboutJob from "./AboutJob";
import JobMenu from "./JobMenu";
import api from "@/app/helpers/api";
import { JobDetails } from "./types";

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
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    description: "",
    responsibilities: [],
    minimum_skills_required: [],
    career_scope: "",
    resources: [],
  });

  useEffect(() => {
    // used to make effect effect StrictMode-safe.
    // It prevents api calling twice in development mode.
    const abortController = new AbortController();
    const fetchJobDetails = async () => {
      try {
        const response = await api.post("/jobs/details/", { name: jobName });
        if (!abortController.signal.aborted) {
          setJobDetails(response.data);
        }
      } catch (error) {
        if (error instanceof Error && error.message !== "canceled") {
          console.error("Failed to fetch job details:", error);
        }
      }
    };
    if (jobName.length > 0) fetchJobDetails();
    return () => abortController.abort();
  }, [jobName]);

  return (
    <>
      <JobMenu menuSelected={menuSelected} setMenuSelected={setMenuSelected} />
      {menuSelected === "jobList" ? (
        <Cards content={jobs} type={"job"} />
      ) : (
        <AboutJob jobDetails={jobDetails} />
      )}
    </>
  );
}
