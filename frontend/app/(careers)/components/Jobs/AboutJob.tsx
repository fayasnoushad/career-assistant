import { JobDetails } from "./types";

export default function AboutJob({ jobDetails }: { jobDetails: JobDetails }) {
  return (
    <div className="flex flex-col gap-4 w-1/2 my-5">
      <div className="bg-base-200 border-base-200 border shadow-xl">
        <div className="text-2xl font-bold text-center p-5">
          {jobDetails.job_name}
        </div>
      </div>

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
              <span
                key={skill}
                className="bg-info text-info-content py-1 px-2 rounded-lg text-sm"
              >
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
          <div className="flex flex-row flex-wrap items-center justify-center gap-4">
            {jobDetails.resources.map((resource_url, index) => (
              <iframe
                key={index}
                className="w-[45%] aspect-video"
                src={resource_url}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
