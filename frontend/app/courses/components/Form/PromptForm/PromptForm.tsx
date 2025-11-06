import React, { useState } from "react";

type Props = {
  submitForm: (data: { prompt: string }) => void;
};

export default function PromptForm({ submitForm }: Props) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!prompt) {
      const modal = document.getElementById("write-something-modal");
      if (modal) (modal as HTMLDialogElement).showModal();
      return;
    }
    submitForm({ prompt });
    setPrompt("");
  };

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
      <button
        className="btn btn-outline rounded-lg"
        onClick={(e) => handleSubmit(e)}
      >
        Get Courses
      </button>
    </>
  );
}
