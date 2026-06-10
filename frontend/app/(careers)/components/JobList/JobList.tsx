import api from "@/app/helpers/api";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { JobType } from "../Cards/types";

export default function JobList({
    names,
    setJobs,
    setLoading,
}: {
    names: string[];
    setJobs: Dispatch<SetStateAction<object[]>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
}) {
    const [activeIndex, setActiveIndex] = useState(-1);
    const queryClient = useQueryClient();

    useEffect(() => setActiveIndex(-1), [names]);

    const scrapeData = async (name: string, index: number) => {
        setLoading(true);
        setActiveIndex(index);
        const jobs = await queryClient.fetchQuery({
            queryKey: ["job", name],
            queryFn: async () => {
                const response = await api.post("/jobs/category/", {
                    name: name,
                });
                return response.data.jobs as JobType[];
            },
            staleTime: Infinity,
            gcTime: Infinity,
        });
        setJobs(jobs);
        setLoading(false);
    };

    return (
        <>
            <div className="flex flex-row flex-wrap justify-center items-center gap-2 mx-10 md:mx-20 lg:mx-30 my-5 bg-base-100 p-5 rounded-2xl">
                {names.map((name, index) => (
                    <button
                        key={index}
                        onClick={() => scrapeData(name, index)}
                        className={`rounded-lg btn ${
                            activeIndex !== index
                                ? " btn-outline"
                                : "btn-primary"
                        }`}
                    >
                        {name}
                    </button>
                ))}
            </div>
        </>
    );
}
