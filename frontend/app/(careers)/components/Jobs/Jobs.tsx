import { useState } from "react";
import Cards from "../Cards/Cards";
import { JobType } from "../Cards/types";
import AboutJob from "./AboutJob";
import JobMenu from "./JobMenu";
import api from "@/app/helpers/api";
import { showModal } from "@/app/helpers/modal-manager";
import { useApiStore, useAuthStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

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
    const loginStatus = useAuthStore((state) => state.loginStatus);
    const apiKeyStatus = useApiStore((state) => state.apiKeyStatus);

    const {
        data: jobDetails,
        isError,
        error,
    } = useQuery({
        queryKey: ["job-details", jobName],
        queryFn: async () => {
            console.log(jobName, loginStatus, apiKeyStatus);
            const response = await api.post("/jobs/details/", {
                name: jobName,
            });
            return response.data;
        },
        staleTime: Infinity,
        gcTime: Infinity,
    });
    if (isError)
        showModal({
            title: "Failed to fetch job details",
            message:
                (error as any).response?.data?.detail || "Something went wrong",
            type: "error",
            onConfirm: () => {},
        });

    return (
        <>
            {jobDetails && (
                <JobMenu
                    menuSelected={menuSelected}
                    setMenuSelected={setMenuSelected}
                />
            )}
            {menuSelected === "jobList" ? (
                <Cards content={jobs} type={"job"} />
            ) : (
                jobDetails && <AboutJob jobDetails={jobDetails} />
            )}
        </>
    );
}
