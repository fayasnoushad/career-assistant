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
      <Link href="/" className="text-3xl font-bold md:w-[50%] my-2">
        Career Assistant
      </Link>
      <div className="flex flex-row justify-center items-center md:ml-auto gap-7 font-bold my-2">
        <Link
          className="btn btn-outline rounded font-bold text-lg"
          href="/courses/"
        >
          Courses
        </Link>
        {!loginStatus && (
          <Link
            className="btn btn-outline rounded font-bold text-lg"
            href="/login/"
          >
            Login
          </Link>
        )}
        <ThemeMode />
        {loginStatus && (
          <Link href="/settings">
            <div className="avatar">
              <div className="ring-primary ring-offset-base-100 rounded-full ring-2 ring-offset-2 flex items-center h-10">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                  className="h-8 w-8 bg-white rounded-full object-cover"
                  alt="Profile"
                />
              </div>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
