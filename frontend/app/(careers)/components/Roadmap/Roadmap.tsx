import api from "@/app/helpers/api";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  roadmap: string[];
  setContent: any;
  setLoading: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
  setPicked?: Dispatch<SetStateAction<number>>;
  index?: number;
}

export default function Roadmap({
  roadmap,
  setContent,
  setLoading,
  disabled = false,
  setPicked = () => {},
  index = 0,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [cache, setCache] = useState<{ [key: string]: object[] }>({});

  useEffect(() => {
    setActiveIndex(-1);
  }, [roadmap]);

  const scrapeData = async (name: string, index: number) => {
    setLoading(true);
    setActiveIndex(index);
    if (name in cache) {
      setContent(cache[name]);
    } else {
      const response = await api.post("/courses/category/", { name: name });
      setContent(response.data.courses);
      setCache((prevCache) => ({
        ...prevCache,
        [name]: response.data.courses,
      }));
    }
    setLoading(false);
  };

  const save = async () => {
    await api.post("/courses/save_roadmap/", { roadmap });
    alert("Roadmap saved");
  };

  return (
    <>
      <div
        className={`flex flex-row flex-wrap justify-center items-center gap-2 ${
          disabled
            ? "border-2 border-transparent hover:border-green-400 hover:bg-base-300 mx-5"
            : "mx-10 md:mx-20 lg:mx-30"
        } my-5 bg-base-100 p-5 rounded-2xl`}
        onClick={() => disabled && setPicked(index)}
      >
        {roadmap.map((name, index) => (
          <React.Fragment key={index}>
            <button
              className={`rounded-lg btn ${
                activeIndex !== index ? " btn-outline" : "btn-primary"
              }`}
              onClick={() => scrapeData(name, index)}
              disabled={disabled}
            >
              {name}
            </button>
            {index < roadmap.length - 1 && <span>-&gt;</span>}
          </React.Fragment>
        ))}
      </div>
      {!disabled && (
        <div className="flex flex-row justify-end items-center gap-2 w-[80%] mx-10 md:mx-20 lg:mx-30 px-5">
          <button className="btn btn-soft btn-sm rounded-lg" onClick={save}>
            Save Roadmap
          </button>
          <button
            className="btn btn-soft btn-sm rounded-lg"
            onClick={() => setPicked(-1)}
          >
            Other Roadmaps
          </button>
        </div>
      )}
    </>
  );
}
