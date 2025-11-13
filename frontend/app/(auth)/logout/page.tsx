"use client";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    Cookies.remove("token");
    window.location.href = "/";
  }, []);
  return <div></div>;
}
