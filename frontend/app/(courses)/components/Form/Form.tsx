"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "@/app/helpers/api";
import PromptDialog from "./PromptForm/PromptDialog";
import PromptForm from "./PromptForm/PromptForm";
import SelectForm from "./SelectForm/SelectForm";
import SelectDialog from "./SelectForm/SelectDialog";
import Link from "next/link";

type Props = {
  setContent: Dispatch<SetStateAction<never[]>>;
  setCourses: Dispatch<SetStateAction<never[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Form({ setContent, setCourses, setLoading }: Props) {
  const [promptForm, setPromptForm] = useState(false);
  const [login, setLogin] = useState(false);
  const [haveApi, setHaveApi] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) setLogin(true);
    else return;
    const fetchApiDetails = async () => {
      const response = await api.post("auth/details/");
      const user = response.data;
      setHaveApi(user.gemini_api && true);
    };
    fetchApiDetails();
  }, []);

  const handleSubmit = async (
    formData: { prompt: string } | { name: string }
  ) => {
    setContent([]);
    setCourses([]);
    setLoading(true);
    const endpoint = "courses/" + (promptForm ? "prompt/" : "category/");
    const response = await api.post(endpoint, { ...formData });

    if (promptForm) setContent(response.data.roadmaps);
    else setCourses(response.data.courses);

    setLoading(false);
  };

  return (
    <>
      <form className="w-[90%] md:w-[80%] p-5 md:p-10 flex flex-col items-center text-center my-10 bg-base-200 rounded-2xl shadow-base-100">
        <h3 className="text-xl md:text-2xl">
          Which courses are you looking for?
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
            setContent([]);
            setCourses([]);
            setLoading(false);
          }}
        >
          Switch to {promptForm ? "Normal" : "Prompt"} form
        </span>
      </form>
      {promptForm ? <PromptDialog /> : <SelectDialog />}
    </>
  );
}
