"use client";
import { useState } from "react";
import Form from "./components/Form/Form";
import Cards from "./components/Cards/Cards";
import Loading from "./../components/Loading/Loading";
import Roadmap from "./components/Roadmap/Roadmap";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [picked, setPicked] = useState(-1);
  const [loading, setLoading] = useState(false);
  return (
    <main className="flex flex-col items-center pb-10">
      <Form
        setContent={setRoadmaps}
        setCourses={setCourses}
        setLoading={setLoading}
      />
      {picked === -1 ? (
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
          index={picked}
        />
      )}
      {loading && <Loading />}
      {courses && <Cards content={courses} />}
    </main>
  );
}
