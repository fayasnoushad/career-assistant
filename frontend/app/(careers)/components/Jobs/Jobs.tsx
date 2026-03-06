import { useEffect, useState } from "react";
import Cards from "../Cards/Cards";
import { JobType } from "../Cards/types";
import AboutJob from "./AboutJob";
import JobMenu from "./JobMenu";
import api from "@/app/helpers/api";
import { JobDetails } from "./types";
import { getLoginStatus } from "@/app/helpers/auth";
import { useSelector } from "react-redux";
import { showModal } from "@/app/helpers/modal-manager";

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

  const hasApiKey = useSelector((state: any) => state.apiKey.hasApiKey);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const login = await getLoginStatus();
      setLoginStatus(login);
    };
    fetchLoginStatus();
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
          showModal({
            title: "Failed to fetch job details",
            message:
              (error as any).response?.data?.detail || "Something went wrong",
            type: "error",
            onConfirm: () => {},
          });
      }
    };
    if (jobName.length > 0 && loginStatus && hasApiKey) fetchJobDetails();
  }, [jobName, loginStatus]);

  return (
    <>
      {loginStatus && hasApiKey && (
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
