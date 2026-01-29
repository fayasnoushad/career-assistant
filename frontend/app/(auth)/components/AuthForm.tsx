"use client";
import Cookies from "js-cookie";
import { useState } from "react";
import Link from "next/link";
import api from "@/app/helpers/api";
import { useRouter } from "next/navigation";
import handleError from "../helpers/handle-error";
import AuthModal from "./AuthModal";
import modalAlert from "../helpers/modal-alert";
import Loading from "@/app/components/Loading/Loading";

interface AuthFormProps {
  registerStatus: boolean;
}

export default function AuthForm({ registerStatus }: AuthFormProps) {
  const router = useRouter();
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);
  const [modalText, setModalText] = useState("");

  const [loading, setLoading] = useState(false);

  const raise = (text: string) => modalAlert(text, setModalText);
  const register = async () => {
    if (password !== confirmPassword) return setIsPasswordWrong(true);
    if (!(fName && email && password)) return raise("Enter required fields");

    setLoading(true);
    const data = {
      first_name: fName,
      last_name: lName,
      email: email,
      password: password,
    };
    try {
      const response = await api.post("/auth/register/", data);
      if (response.status === 200) {
        router.push("/pending");
      }
    } catch (error: unknown) {
      handleError(error, setModalText);
    }
    setLoading(false);
  };

  const login = async () => {
    if (!(email && password)) return raise("Enter required fields");
    setLoading(true);
    try {
      const response = await api.post("/auth/login/", {
        email,
        password,
      });
      if (response.status === 200) {
        Cookies.set("token", response.data.access_token);
        Cookies.set("admin", response.data.admin);
        // router.push("/");
        window.location.href = "/"; // to reload
      }
    } catch (error) {
      handleError(error, setModalText);
    }
    setLoading(false);
  };

  const submit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (registerStatus) return register();
    else return login();
  };

  return (
    <>
      {" "}
      {loading ? (
        <Loading />
      ) : (
        <form className="border-2 border-base-300 bg-base-100 shadow-2xl rounded-3xl max-w-md p-8 md:p-10 animate-scaleIn">
          <h2 className="text-center mb-8 text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {registerStatus ? "Create Account" : "Welcome Back"}
          </h2>
          {registerStatus && (
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="floating_first_name"
                  id="floating_first_name"
                  className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-base-300 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer transition-colors duration-300"
                  placeholder=" "
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  required
                />
                <label
                  htmlFor="floating_first_name"
                  className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  First name
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="floating_last_name"
                  id="floating_last_name"
                  className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-base-300 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer transition-colors duration-300"
                  placeholder=" "
                  value={lName}
                  onChange={(e) => setLName(e.target.value)}
                  required
                />
                <label
                  htmlFor="floating_last_name"
                  className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Last name
                </label>
              </div>
            </div>
          )}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="floating_email"
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-base-300 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer transition-colors duration-300"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label
              htmlFor="floating_email"
              className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="floating_password"
              id="floating_password"
              className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-base-300 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer transition-colors duration-300"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
          </div>
          {registerStatus && (
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="password"
                name="repeat_password"
                id="floating_repeat_password"
                className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-base-300 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer transition-colors duration-300"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => {
                  if (password === e.target.value) {
                    setIsPasswordWrong(false);
                  }
                  setConfirmPassword(e.target.value);
                }}
                required
              />
              <label
                htmlFor="floating_repeat_password"
                className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Confirm password
              </label>

              {isPasswordWrong && (
                <small className="text-red-500 block">
                  * Confirm password is wrong
                </small>
              )}
            </div>
          )}
          <div className="mt-8 py-2 text-center flex flex-col justify-center gap-4">
            <button
              type="submit"
              className="btn btn-lg bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full"
              onClick={(e) => submit(e)}
            >
              {registerStatus ? "Create Account" : "Sign In"}
            </button>
            <Link
              className="text-sm text-base-content/70 hover:text-purple-600 transition-colors duration-300"
              href={`/${registerStatus ? "login" : "register"}`}
            >
              {registerStatus ? (
                <>
                  Already have an account?{" "}
                  <span className="font-semibold underline">Login</span>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <span className="font-semibold underline">Register</span>
                </>
              )}
            </Link>
          </div>
        </form>
      )}
      <AuthModal modalText={modalText} />
    </>
  );
}
