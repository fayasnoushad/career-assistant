"use client";
import Link from "next/link";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ThemeDropdown from "./ThemeDropdown";
import { useEffect, useState } from "react";
import UserDetails from "./UserDetails";

export default function Header() {
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    const check = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp && decoded.exp * 1000 > Date.now()) {
            setLoginStatus(true);
          } else {
            Cookies.remove("token");
          }
        } catch {
          setLoginStatus(false);
        }
      }
    };
    check();
  }, []);

  return (
    <header className="min-h-[10vh] py-4 px-2 md:px-7 w-auto bg-base-300 flex flex-col md:flex md:flex-row justify-center items-center">
      <Link href="/" className="text-2xl font-bold md:w-[50%] my-2">
        Career Assistant
      </Link>
      <div className="flex flex-row justify-center items-center md:ml-auto gap-3 my-2">
        {!loginStatus && (
          <Link
            className="btn btn-ghost rounded-lg font-bold text-lg"
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
