"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import api from "@/app/helpers/api";
import { useSearchParams } from "next/navigation";
import handleError from "../helpers/handle-error";
import modalAlert from "../helpers/modal-alert";

export default function VerifyAccount() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const verify = async () => {
    const params = { token };
    try {
      const response = await api.get("/auth/verify/", { params });
      if (response.status === 201) {
        Cookies.set("token", response.data.access_token);
        Cookies.set("admin", response.data.admin);
        modalAlert("Account Created Successfully");
        setTimeout(() => (window.location.href = "/"), 3000);
      }
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const abort = () => {
    modalAlert("Account Creation Aborted");
    setTimeout(() => (window.location.href = "/"), 3000);
  };

  return (
    <div className="my-[25vh]">
      <span className="block font-semibold text-2xl">
        Are you sure you want to create an account?
      </span>
      <div className="mt-10 flex flex-row gap-2 justify-center">
        <button className="btn btn-outline btn-success px-15" onClick={verify}>
          Yes
        </button>
        <button className="btn btn-outline btn-error px-15" onClick={abort}>
          No
        </button>
      </div>
    </div>
  );
}
