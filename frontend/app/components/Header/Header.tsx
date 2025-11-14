"use client";
import Link from "next/link";
import Cookies from "js-cookie";
import ThemeMode from "./ThemeMode";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

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
      <div className="flex flex-row justify-center items-center md:ml-auto gap-5 font-bold my-2">
        <Link
          className="btn btn-ghost rounded-lg font-bold text-lg"
          href="/courses/"
        >
          Courses
        </Link>
        {!loginStatus && (
          <Link
            className="btn btn-ghost rounded-lg font-bold text-lg"
            href="/login/"
          >
            Login
          </Link>
        )}
        <ThemeMode />
        {loginStatus && (
          <div className="dropdown dropdown-end cursor-pointer">
            <div className="avatar" tabIndex={0} role="button">
              <div className="ring-primary ring-offset-base-100 w-8 rounded-full ring-2 ring-offset-2 hover:opacity-[0.8]">
                <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
            >
              <Link href="/saved" className="btn btn-ghost rounded-lg">
                Saved Courses
              </Link>
              <Link href="/settings" className="btn btn-ghost rounded-lg">
                Settings
              </Link>
              <Link href="/logout" className="btn btn-ghost rounded-lg">
                Logout
              </Link>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
