import React from "react";

export default function Roadmap({ roadmap }: { roadmap: string[] }) {
  return (
    <div className="flex flex-row flex-wrap justify-center items-center gap-2 mx-10 md:mx-20 lg:mx-30 my-5 bg-base-100 p-5 rounded-2xl border border-green-400">
      {roadmap.map((name, index) => (
        <React.Fragment key={index}>
          <button className="rounded-lg btn btn-outline">{name}</button>
          {index < roadmap.length - 1 && <span>-&gt;</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
