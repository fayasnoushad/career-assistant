import React, { useState } from "react";

type Props = {
  submitForm: (
    input: string,
    formType: "job" | "course",
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined,
  ) => Promise<void>;
};

export default function SelectForm({ submitForm }: Props) {
  const [input, setInput] = useState("");

  return (
    <>
      <div className="form-control flex flex-col items-center w-[90%] md:w-[80%] my-6">
        <label htmlFor="formInput" className="label">
          <span className="label-text font-semibold text-base mb-2">
            Search by job/course name:
          </span>
        </label>
        <input
          type="text"
          id="formInput"
          className="input input-bordered focus:input-primary input-lg w-full"
          placeholder="E.g., Software Engineer, Data Scientist, Product Manager..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
      </div>
      <div className="flex flex-row gap-3 justify-center flex-wrap">
        <button
          className="btn btn-primary gap-2 rounded-lg"
          onClick={(e) => {
            submitForm(input, "job", e);
            setInput("");
          }}
        >
          💼 Get Jobs
        </button>
        <button
          className="btn btn-secondary gap-2 rounded-lg"
          onClick={(e) => {
            submitForm(input, "course", e);
            setInput("");
          }}
        >
          🎓 Get Courses
        </button>
      </div>
    </>
  );
}
