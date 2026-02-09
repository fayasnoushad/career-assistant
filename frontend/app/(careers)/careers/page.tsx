"use client";
import { Suspense, useState } from "react";
import Form from "../components/Form/Form";
import Cards from "../components/Cards/Cards";
import Loading from "../../components/Loading";
import Roadmap from "../components/Roadmap/Roadmap";
import JobList from "../components/JobList/JobList";
import Jobs from "../components/Jobs/Jobs";

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [jobNames, setJobNames] = useState([]);
  const [jobName, setJobName] = useState("");
  const [picked, setPicked] = useState(-1);
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex flex-col items-center pb-10">
      <Suspense fallback={<Loading />}>
        <Form
          setRoadmaps={setRoadmaps}
          setJobNames={setJobNames}
          setJobName={setJobName}
          setJobs={setJobs}
          setCourses={setCourses}
          setLoading={setLoading}
          setPicked={setPicked}
        />
      </Suspense>
      {picked === -1 ? (
        roadmaps &&
        roadmaps.length > 0 && (
          <div className="my-8 p-6 bg-linear-to-br from-base-100 to-base-200 rounded-3xl shadow-xl border border-base-300 md:mx-30 max-w-4xl animate-fadeIn">
            <h3 className="text-2xl font-bold text-center mb-6 bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Pick one roadmap to continue
            </h3>
            <div className="space-y-3">
              {roadmaps.map((roadmap, index: number) => (
                <Roadmap
                  key={index}
                  roadmap={roadmap}
                  setContent={setCourses}
                  setLoading={setLoading}
                  disabled={true}
                  setPicked={setPicked}
                  index={index}
                />
              ))}
            </div>
          </div>
        )
      ) : (
        <Roadmap
          roadmap={roadmaps[picked]}
          setContent={setCourses}
          setLoading={setLoading}
          setPicked={setPicked}
          index={picked}
        />
      )}
      {jobNames.length > 0 && (
        <JobList
          names={jobNames}
          setJobs={setJobs as any}
          setLoading={setLoading}
        />
      )}
      {loading && <Loading />}
      {jobs.length > 1 && <Jobs jobs={jobs} jobName={jobName} />}
      {courses && <Cards content={courses} type={"course"} />}
    </main>
  );
}
