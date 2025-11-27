import React, { useState } from "react";

type Props = {
  submitForm: (
    input: string,
    formType: "job" | "course",
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => Promise<void>;
};

export default function SelectForm({ submitForm }: Props) {
  const [input, setInput] = useState("");

  return (
    <>
      <div className="my-4 flex flex-col items-start justify-start">
        <label htmlFor="formInput" className="mb-2 block">
          Enter a name
        </label>
        <input
          type="text"
          id="formInput"
          className={"bg-base-100 border border-base-content rounded p-2"}
          placeholder={"Enter a name..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="flex flex-row gap-2">
        <button
          className="btn btn-outline rounded-lg"
          onClick={(e) => {
            submitForm(input, "job", e);
            setInput("");
          }}
        >
          Get Jobs
        </button>
        <button
          className="btn btn-outline rounded-lg"
          onClick={(e) => {
            submitForm(input, "course", e);
            setInput("");
          }}
        >
          Get Courses
        </button>
      </div>
    </>
  );
}
