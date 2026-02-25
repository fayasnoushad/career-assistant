"use client";
import api from "../helpers/api";
import { useDispatch } from "react-redux";
import { setHasApiKey } from "@/store/slices/apiKeySlice";
import React, { useEffect, useState } from "react";
import { showModal } from "@/app/helpers/modal-manager";

export default function Settings() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.post("/auth/details/");
      const user = response.data;
      setFName(user.first_name ?? "");
      setLName(user.last_name ?? "");
      setApiKey(user.gemini_api ?? "");
      setCareerGoal(user.career_goal ?? "");
    };
    fetchData();
  }, []);

  const submit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const data = {
      first_name: fName,
      last_name: lName,
      career_goal: careerGoal,
      gemini_api: apiKey,
    };
    await api.patch("/auth/update/", data);
    dispatch(setHasApiKey(apiKey.length > 0));
    showModal({
      title: "Success",
      message: "Settings updated successfully!",
      type: "success",
      onConfirm: () => {},
    });
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center animate-fadeIn">
      <form className="border-2 border-base-300 bg-linear-to-br from-base-100 to-base-200 shadow-2xl rounded-3xl max-w-md p-8 md:p-10 mx-auto flex flex-col items-center justify-center w-full">
        <div className="text-4xl mb-4">⚙️</div>
        <h2 className="text-center mb-8 text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Settings
        </h2>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="floating_first_name"
            id="floating_first_name"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-base-300 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer transition-colors duration-300"
            placeholder=" "
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            required
          />
          <label
            htmlFor="floating_first_name"
            className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:inset-s-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            First name
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="floating_last_name"
            id="floating_last_name"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-base-300 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer transition-colors duration-300"
            placeholder=" "
            value={lName}
            onChange={(e) => {
              setLName(e.target.value);
            }}
            required
          />
          <label
            htmlFor="floating_last_name"
            className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:inset-s-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Last name
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="floating_career_goal"
            id="floating_career_goal"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-base-300 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer transition-colors duration-300"
            placeholder=" "
            value={careerGoal}
            onChange={(e) => setCareerGoal(e.target.value)}
            required={false}
          />
          <label
            htmlFor="floating_career_goal"
            className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:inset-s-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Career Goal (e.g., Software Engineer)
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="floating_api"
            id="floating_api"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-base-300 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer transition-colors duration-300"
            placeholder=" "
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
            }}
            required={false}
          />
          <label
            htmlFor="floating_api"
            className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:inset-s-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Gemini API Key
          </label>
        </div>
        <div className="mt-8 py-2 text-center flex flex-col justify-center w-full">
          <button
            type="submit"
            className="btn btn-lg bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full"
            onClick={(e) => submit(e)}
          >
            Save Changes
          </button>
        </div>
      </form>
    </main>
  );
}
