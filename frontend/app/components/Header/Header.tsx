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
    <header className="navbar min-h-[10vh] bg-base-300 shadow-sm px-3 md:px-7 py-2">
      <Link href="/" className="text-2xl font-bold">
        Career Assistant
      </Link>
      <div className="flex flex-row justify-center items-center ml-auto gap-1 md:gap-3">
        {!loginStatus && (
          <Link
            className="btn btn-ghost btn-sm md:btn-md rounded-lg font-bold text-lg"
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
