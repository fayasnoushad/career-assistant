"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/app/helpers/api";
import { getLoginStatus } from "@/app/helpers/auth";
import { showModal } from "@/app/helpers/modal-manager";

export default function Pending() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loginStatus, setLoginStatus] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(decodeURIComponent(emailParam));
    else location.href = "/";
  }, []);

  useEffect(() => {
    const runCheck = async () => {
      const loggedIn = await getLoginStatus();
      setLoginStatus(loggedIn);
    };
    runCheck();
  }, [router]);

  const verifyOtp = async () => {
    if (!otp) {
      showModal({
        title: "Missing Info",
        message: "Please enter the OTP.",
        type: "error",
        onConfirm: () => {},
      });
      return;
    }
    setVerifying(true);
    try {
      const response = await api.post("/auth/verify-otp/", { email, otp });
      if (response.status === 201 || response.status === 200) {
        // Store token and redirect
        const token = response.data.access_token;
        if (token) {
          Cookies.set("token", token);
          Cookies.set("admin", response.data.admin);
        }
        showModal({
          title: "Verified",
          message: "Your account has been verified successfully.",
          type: "success",
          onConfirm: () => {},
        });
        setLoginStatus(true);
        location.href = "/"; // to reload
      }
    } catch (error) {
      showModal({
        title: "Verification Failed",
        message: "Invalid or expired OTP. Please try again.",
        type: "error",
        onConfirm: () => {},
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="py-[10vh] text-2xl text-center animate-fadeIn">
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
          Please verify your email using the OTP we sent.
          <br />
          <br />
          <div className="max-w-md mx-auto mt-6 space-y-4 text-left">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
              onChange={(e) => setOtp(e.target.value)}
              className="input input-bordered w-full"
            />
            <button
              className="btn btn-primary w-full"
              onClick={verifyOtp}
              disabled={verifying}
            >
              {verifying ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="text-center text-sm text-base-content/70">
              Check your inbox for the 6-digit code.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
