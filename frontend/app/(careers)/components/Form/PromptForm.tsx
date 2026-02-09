import React, { useState } from "react";

type Props = {
  submitForm: (
    input: string,
    formType: "job" | "course",
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => Promise<void>;
};

export default function PromptForm({ submitForm }: Props) {
  const [prompt, setPrompt] = useState("");

  return (
    <>
      <textarea
        name="content"
        rows={5}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Write your interests"
        value={prompt}
        className="bg-base-100 border border-base-content my-5 w-[90%] md:w-[80%] rounded p-3"
      ></textarea>
      <br />
      <div className="flex flex-row gap-2">
        <button
          className="btn btn-outline rounded-lg"
          onClick={(e) => {
            submitForm(prompt, "job", e);
            setPrompt("");
          }}
        >
          Suggest Jobs
        </button>
        <button
          className="btn btn-outline rounded-lg"
          onClick={(e) => {
            submitForm(prompt, "course", e);
            setPrompt("");
          }}
        >
          Get Courses
        </button>
      </div>
    </>
  );
}
