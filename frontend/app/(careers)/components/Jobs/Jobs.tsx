import { useEffect, useState } from "react";
import Cards from "../Cards/Cards";
import { JobType } from "../Cards/types";
import AboutJob from "./AboutJob";
import JobMenu from "./JobMenu";
import api from "@/app/helpers/api";
import { JobDetails } from "./types";
import Cookies from "js-cookie";
import { getLoginStatus } from "@/app/helpers/auth";

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
  const [loginStatus, setLoginStatus] = useState(false);
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    job_name: "",
    description: "",
    responsibilities: [],
    minimum_skills_required: [],
    career_scope: "",
    resources: [],
  });

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const login = await getLoginStatus();
      setLoginStatus(login);
    };
  }, []);

  useEffect(() => {
    // used to make effect effect StrictMode-safe.
    // It prevents api calling twice in development mode.
    const fetchJobDetails = async () => {
      try {
        const response = await api.post("/jobs/details/", { name: jobName });
        setJobDetails(response.data);
      } catch (error) {
        if (error instanceof Error && error.message !== "canceled")
          console.error("Failed to fetch job details:", error);
      }
    };
    if (jobName.length > 0 && loginStatus) fetchJobDetails();
  }, [jobName]);

  return (
    <>
      {loginStatus && (
        <JobMenu
          menuSelected={menuSelected}
          setMenuSelected={setMenuSelected}
        />
      )}
      {menuSelected === "jobList" ? (
        <Cards content={jobs} type={"job"} />
      ) : (
        <AboutJob jobDetails={jobDetails} />
      )}
    </>
  );
}
