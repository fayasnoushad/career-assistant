"use client";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Pending() {
  const [loginStatus, setLoginStatus] = useState(false);
  const router = useRouter();

  const check = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          setLoginStatus(true);
          return;
        } else Cookies.remove("token");
      } catch {}
      setLoginStatus(false);
    }
  };

  useEffect(() => {
    check();
  }, []);

  useEffect(() => {
    if (loginStatus) {
      // Show success message for 3 seconds then close/redirect
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [loginStatus, router]);

  return (
    <div className="py-[25vh] text-2xl text-center animate-fadeIn">
      {loginStatus ? (
        <>
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Verification Successful!
          </h2>
          <p className="text-base-content/70">Redirecting...</p>
        </>
      ) : (
        <>
          Account verification is pending. <br />
          Please verify your email by clicking the link in the email we sent.
          <br />
          <br />
          <span className="loading loading-bars loading-xl"></span>
        </>
      )}
    </div>
  );
}
