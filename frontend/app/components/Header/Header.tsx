"use client";
import Link from "next/link";
import ThemeDropdown from "./ThemeDropdown";
import { useEffect, useState } from "react";
import UserDetails from "./UserDetails";
import { getLoginStatus } from "@/app/helpers/auth";

export default function Header() {
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    const runCheck = async () => {
      const loggedIn = await getLoginStatus();
      setLoginStatus(loggedIn);
    };
    runCheck();
  }, []);

  return (
    <header className="navbar min-h-[10vh] bg-base-100/80 backdrop-blur-md shadow-lg border-b border-base-300 px-3 md:px-7 py-3 sticky top-0 z-50 transition-all duration-300">
      <Link
        href="/"
        className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
      >
        Career Assistant
      </Link>
      <div className="flex flex-row justify-center items-center ml-auto gap-2 md:gap-4">
        {!loginStatus && (
          <Link
            className="btn btn-sm md:btn-md bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            href="/login/"
          >
            Login
          </Link>
        )}
        <ThemeDropdown />
        {loginStatus && <UserDetails />}
      </div>
    </header>
  );
}
