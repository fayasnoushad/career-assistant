import api from "@/app/helpers/api";
import { useEffect, useState } from "react";

type JobDetails = {
  description: string;
  responsibilities: string[];
  minimum_skills_required: string[];
  career_scope: string;
  resources: { title: string; url: string }[];
};

export default function AboutJob({ jobName }: { jobName: string }) {
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    description: "",
    responsibilities: [],
    minimum_skills_required: [],
    career_scope: "",
    resources: [],
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      const response = await api.post("/jobs/details/", { name: jobName });
      setJobDetails(response.data);
    };
    fetchJobDetails();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-1/2 my-5">
      <div className="collapse bg-base-200 border-base-200 border shadow-xl">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">What is this job?</div>
        <div className="collapse-content text-sm">{jobDetails.description}</div>
      </div>

      <div className="collapse bg-base-200 border-base-200 border shadow-xl">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">Key Responsibilities</div>
        <div className="collapse-content">
          <ul className="list-disc list-inside space-y-2 text-base-content/70">
            {jobDetails.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="collapse bg-base-200 border-base-200 border shadow-xl">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">Required Skills</div>
        <div className="collapse-content">
          <div className="flex flex-wrap gap-2">
            {jobDetails.minimum_skills_required.map((skill) => (
              <span key={skill} className="badge badge-primary">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="collapse bg-base-200 border-base-200 border shadow-xl">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">
          Career Scope & Future
        </div>
        <div className="collapse-content text-base-content/70">
          {jobDetails.career_scope}
        </div>
      </div>

      <div className="collapse bg-base-200 border-base-200 border shadow-xl">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">Learning Resources</div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobDetails.resources.map((resource) => (
              <iframe
                key={resource.url}
                width="100%"
                height="315"
                src={resource.url}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
