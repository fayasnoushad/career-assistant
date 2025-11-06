import React, { useState } from "react";

type Props = {
  submitForm: (data: { name: string }) => void;
};

export default function SelectForm({ submitForm }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!input) {
      const modal = document.getElementById("select-something-modal");
      if (modal) {
        (modal as HTMLDialogElement).showModal();
      }
      return;
    }
    submitForm({ name: input });
    setInput("");
  };

  return (
    <>
      <div className="my-4 flex flex-col items-start justify-start">
        <label htmlFor="courseInput" className="mb-2 block">
          Enter a course name
        </label>
        <input
          type="text"
          id="courseInput"
          className={"bg-base-100 border border-base-content rounded p-2"}
          placeholder={"Enter a course name"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <button
        className="btn btn-outline rounded-lg"
        onClick={(e) => handleSubmit(e)}
      >
        Get Courses
      </button>
    </>
  );
}
