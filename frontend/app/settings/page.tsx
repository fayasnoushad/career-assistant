"use client";
import React, { useEffect, useState } from "react";
import api from "../helpers/api";

export default function Settings() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.post("/auth/details/");
      const user = response.data;
      setFName(user.first_name ?? "");
      setLName(user.last_name ?? "");
      setApiKey(user.gemini_api ?? "");
    };
    fetchData();
  }, []);

  const submit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const data = {
      first_name: fName,
      last_name: lName,
      gemini_api: apiKey,
    };
    await api.patch("/auth/update/", data);
    alert("Updated Successfully");
  };

  return (
    <>
      <form className="rounded-3xl max-w-md p-7 mx-auto flex flex-col items-center justify-center">
        <h2 className="text-center my-5 text-2xl font-semibold">Settings</h2>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="floating_first_name"
            id="floating_first_name"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            required
          />
          <label
            htmlFor="floating_first_name"
            className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            First name
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="floating_last_name"
            id="floating_last_name"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={lName}
            onChange={(e) => {
              setLName(e.target.value);
            }}
            required
          />
          <label
            htmlFor="floating_last_name"
            className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Last name
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="floating_api"
            id="floating_api"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
            }}
            required={false}
          />
          <label
            htmlFor="floating_api"
            className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Gemini API Key
          </label>
        </div>
        <div className="mt-5 py-2 text-center flex flex-col justify-center">
          <button
            type="submit"
            className="text-white mx-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2"
            onClick={(e) => submit(e)}
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
