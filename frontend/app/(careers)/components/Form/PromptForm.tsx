import React, { useState } from "react";

type Props = {
  submitForm: (
    input: string,
    formType: "job" | "course",
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined,
  ) => Promise<void>;
};

export default function PromptForm({ submitForm }: Props) {
  const [prompt, setPrompt] = useState("");

  return (
    <>
      <div className="form-control flex flex-col items-center w-[90%] md:w-[80%] my-6">
        <label className="label">
          <span className="label-text font-semibold text-base mb-2">
            Describe your interests:
          </span>
        </label>
        <textarea
          name="content"
          rows={5}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., I'm interested in web development, working with React, and building scalable applications..."
          value={prompt}
          className="textarea textarea-bordered focus:textarea-primary textarea-lg resize-none  w-full"
        ></textarea>
      </div>
      <div className="flex flex-row gap-3 justify-center flex-wrap">
        <button
          className="btn btn-primary text-primary-content rounded-lg"
          onClick={(e) => {
            submitForm(prompt, "job", e);
            setPrompt("");
          }}
        >
          💼 Suggest Jobs
        </button>
        <button
          className="btn btn-secondary text-secondary-content rounded-lg"
          onClick={(e) => {
            submitForm(prompt, "course", e);
            setPrompt("");
          }}
        >
          🎓 Get Courses
        </button>
      </div>
    </>
  );
}
