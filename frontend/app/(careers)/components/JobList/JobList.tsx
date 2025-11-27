import Link from "next/link";
import React, { useState } from "react";

export default function JobList({ names }: { names: string[] }) {
  return (
    <>
      <div className="flex flex-row flex-wrap justify-center items-center gap-2 mx-10 md:mx-20 lg:mx-30 my-5 bg-base-100 p-5 rounded-2xl">
        {names.map((name, index) => (
          <React.Fragment key={index}>
            <Link href={"/careers?type=job&name=" + name} target="_blank">
              <button className="rounded-lg btn btn-outline">{name}</button>
            </Link>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
