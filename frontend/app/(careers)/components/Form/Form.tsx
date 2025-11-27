"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "@/app/helpers/api";
import FormDialog from "./FormDialog";
import PromptForm from "./PromptForm/PromptForm";
import SelectForm from "./SelectForm/SelectForm";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Props = {
  setJobNames: Dispatch<SetStateAction<never[]>>;
  setRoadmaps: Dispatch<SetStateAction<never[]>>;
  setJobs: any;
  setCourses: any;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setPicked: Dispatch<SetStateAction<number>>;
};

export default function Form({
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
  const [haveApi, setHaveApi] = useState(false);

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
    else return;
    const fetchApiDetails = async () => {
      const response = await api.post("/auth/details/");
      const user = response.data;
      setHaveApi(user.gemini_api && true);
    };
    fetchApiDetails();
  }, []);

  const handleSubmit = async (
    input: string,
    formType: "job" | "course",
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (event) event.preventDefault();
    if (!input) {
      const modal = document.getElementById("form-dialog-modal");
      if (modal) (modal as HTMLDialogElement).showModal();
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
      if (formType === "job") setJobs(response.data.jobs);
      else setCourses(response.data.courses);
    }
    setLoading(false);
  };

  return (
    <>
      <form className="w-[90%] md:w-[80%] p-5 md:p-10 flex flex-col items-center text-center my-10 bg-base-200 rounded-2xl shadow-base-100">
        <h3 className="text-xl md:text-2xl">
          Find jobs or courses for your career!
        </h3>
        {promptForm ? (
          !login ? (
            <span className="my-5">
              You must need to{" "}
              <Link href="/login" className="text-blue-500">
                login
              </Link>{" "}
              to use prompt box
            </span>
          ) : !haveApi ? (
            <span className="my-5">
              You must need to add api key in{" "}
              <Link href="/settings" className="text-blue-500">
                settings
              </Link>{" "}
              to use prompt box
            </span>
          ) : (
            <PromptForm submitForm={handleSubmit} />
          )
        ) : (
          <SelectForm submitForm={handleSubmit} />
        )}
        <span
          className="mt-4 mb-2 text-blue-500 cursor-pointer"
          onClick={() => {
            setPromptForm((prevPromptForm) => !prevPromptForm);
            setJobNames([]);
            setRoadmaps([]);
            setJobs([]);
            setCourses([]);
            setLoading(false);
          }}
        >
          Switch to {promptForm ? "Normal" : "Prompt"} form
        </span>
      </form>
      <FormDialog />
    </>
  );
}
