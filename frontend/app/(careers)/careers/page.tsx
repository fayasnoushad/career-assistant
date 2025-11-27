"use client";
import { useState } from "react";
import Form from "../components/Form/Form";
import Cards from "../components/Cards/Cards";
import Loading from "../../components/Loading/Loading";
import Roadmap from "../components/Roadmap/Roadmap";
import JobList from "../components/JobList/JobList";

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [jobNames, setJobNames] = useState([]);
  const [picked, setPicked] = useState(-1);
  const [loading, setLoading] = useState(false);
  return (
    <main className="flex flex-col items-center pb-10">
      <Form
        setRoadmaps={setRoadmaps}
        setJobNames={setJobNames}
        setJobs={setJobs}
        setCourses={setCourses}
        setLoading={setLoading}
        setPicked={setPicked}
      />
      {picked === -1 ? (
        roadmaps &&
        roadmaps.length > 0 && (
          <div className="my-5 p-2 bg-base-200 rounded md:mx-30">
            <span className="text-xl text-center block my-2">
              Pick one roadmap
            </span>
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
      {jobNames && (
        <JobList
          names={jobNames}
          setJobs={setJobs as any}
          setLoading={setLoading}
        />
      )}
      {loading && <Loading />}
      {jobs && <Cards content={jobs} type={"job"} />}
      {courses && <Cards content={courses} type={"course"} />}
    </main>
  );
}
