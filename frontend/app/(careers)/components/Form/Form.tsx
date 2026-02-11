"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import api from "@/app/helpers/api";
import PromptForm from "./PromptForm";
import SelectForm from "./SelectForm";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { showModal } from "@/app/helpers/modal-manager";

type Props = {
  setJobName: Dispatch<SetStateAction<string>>;
  setJobNames: Dispatch<SetStateAction<never[]>>;
  setRoadmaps: Dispatch<SetStateAction<never[]>>;
  setJobs: any;
  setCourses: any;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setPicked: Dispatch<SetStateAction<number>>;
};

export default function Form({
  setJobName,
  setJobNames,
  setRoadmaps,
  setJobs,
  setCourses,
  setLoading,
  setPicked,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [promptForm, setPromptForm] = useState(false);
  const [login, setLogin] = useState(false);
  const hasApiKey = useSelector((state: any) => state.apiKey.hasApiKey);

  useEffect(() => {
    const name = searchParams.get("name");
    if (name && name.length > 0) {
      handleSubmit(name, searchParams.get("type") === "job" ? "job" : "course");
      router.replace(pathname);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) setLogin(true);
  }, []);

  useEffect(() => {
    setJobName("");
  }, []);

  const handleSubmit = async (
    input: string,
    formType: "job" | "course",
    event?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (event) event.preventDefault();
    if (!input) {
      showModal({
        title: "Input Required",
        message: "Please write something before clicking the button.",
        type: "info",
      });
      return;
    }
    setPicked(-1);
    setJobNames([]);
    setRoadmaps([]);
    setJobs([]);
    setCourses([]);
    setLoading(true);
    const endpoint =
      (formType === "job" ? "/jobs/" : "/courses/") +
      (promptForm ? "prompt/" : "category/");
    const formData = promptForm ? { prompt: input } : { name: input };
    const response = await api.post(endpoint, { ...formData });

    if (promptForm) {
      if (formType === "job") setJobNames(response.data.jobs);
      else setRoadmaps(response.data.roadmaps);
    } else {
      if (formType === "job") {
        setJobs(response.data.jobs);
        setJobName(input);
      } else setCourses(response.data.courses);
    }
    setLoading(false);
  };

  return (
    <>
      <form className="w-[90%] md:w-[80%] max-w-4xl p-8 md:p-12 flex flex-col items-center text-center my-10 bg-base-100 rounded-2xl shadow-lg border border-base-300 animate-scaleIn">
        <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
          Find Jobs & Courses
        </h3>
        <p>Discover jobs and courses tailored to your interests</p>
        <div className="divider my-2"></div>
        {promptForm ? (
          hasApiKey ? (
            <PromptForm submitForm={handleSubmit} />
          ) : login ? (
            <div className="my-6 p-6 bg-base-200 rounded-2xl border border-purple-500/20">
              <span className="text-base-content/80">
                You need to add an API key in{" "}
                <Link
                  href="/settings"
                  className="text-purple-600 hover:text-purple-700 font-semibold underline"
                >
                  settings
                </Link>{" "}
                to use the AI prompt box
              </span>
            </div>
          ) : (
            <div className="my-6 p-6 bg-base-200 rounded-2xl border border-purple-500/20">
              <span className="text-base-content/80">
                You need to{" "}
                <Link
                  href="/login"
                  className="text-purple-600 hover:text-purple-700 font-semibold underline"
                >
                  login
                </Link>{" "}
                to use the AI prompt box
              </span>
            </div>
          )
        ) : (
          <SelectForm submitForm={handleSubmit} />
        )}
        <div className="divider my-6"></div>
        <button
          type="button"
          className="btn btn-ghost gap-2 text-sm font-semibold"
          onClick={() => {
            setPromptForm((prevPromptForm) => !prevPromptForm);
            setJobNames([]);
            setRoadmaps([]);
            setJobs([]);
            setCourses([]);
            setLoading(false);
          }}
        >
          {promptForm ? "🔄 Normal Form" : "✨ AI Prompt"}
        </button>
      </form>
    </>
  );
}
