"use client";
import Cookies from "js-cookie";
import { useState } from "react";
import Link from "next/link";
import api from "@/app/helpers/api";
// import { useRouter } from "next/navigation";

interface AuthFormProps {
  registerStatus: boolean;
}

export default function AuthForm({ registerStatus }: AuthFormProps) {
  // const router = useRouter();
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);
  const [modalText, setModalText] = useState("");

  const errorAlert = (text: string) => {
    setModalText(text);
    const modal = document.getElementById("auth-modal");
    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
  };

  const register = async () => {
    if (password !== confirmPassword) {
      setIsPasswordWrong(true);
      return;
    }
    if (fName && email && password) {
      const data = {
        first_name: fName,
        last_name: lName,
        email: email,
        password: password,
      };
      try {
        const response = await api.post("auth/register/", data);
        if (response.status === 201) {
          Cookies.set("token", response.data.access_token);
          Cookies.set("admin", response.data.admin);
          // router.push("/");
          window.location.href = "/"; // to reload
        }
      } catch (error: unknown) {
        let response;
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          response = (
            error as {
              response: {
                data?: { detail?: string };
                status?: number;
                statusText?: string;
              };
            }
          ).response;
        } else {
          return errorAlert("Something wrong");
        }
        return errorAlert(
          response?.data?.detail ||
            (response?.statusText
              ? `[${response?.status}] ${response?.statusText}`
              : "Something wrong")
        );
      }
    }
  };

  const login = async () => {
    if (email && password) {
      const response = await api.post("auth/login/", {
        email,
        password,
      });
      if (response.status === 200) {
        Cookies.set("token", response.data.access_token);
        Cookies.set("admin", response.data.admin);
        // router.push("/");
        window.location.href = "/"; // to reload
      }
    }
  };

  const submit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (registerStatus) return register();
    else return login();
  };

  return (
    <>
      <form className="border-2 rounded-3xl max-w-md p-7">
        <h2 className="text-center mb-5 text-2xl font-semibold">
          {registerStatus ? "Register" : "Login"}
        </h2>
        {registerStatus && (
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="floating_first_name"
                id="floating_first_name"
                className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={fName}
                onChange={(e) => setFName(e.target.value)}
                required
              />
              <label
                htmlFor="floating_first_name"
                className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                First name
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="floating_last_name"
                id="floating_last_name"
                className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={lName}
                onChange={(e) => setLName(e.target.value)}
                required
              />
              <label
                htmlFor="floating_last_name"
                className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
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
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="floating_password"
            id="floating_password"
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
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
              className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
              className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
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
        <div className="mt-5 py-2 text-center flex flex-col justify-center">
          <button
            type="submit"
            className="text-white mx-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2"
            onClick={(e) => submit(e)}
          >
            Submit
          </button>
          <Link
            className="text-sm font-light text-gray-600 dark:text-gray-400"
            href={`/${registerStatus ? "login" : "register"}`}
          >
            <b>
              {registerStatus ? (
                <>
                  Already have an account? <u>Login</u>
                </>
              ) : (
                <>
                  Don&apos;t have an account? <u>Register</u>
                </>
              )}
            </b>
          </Link>
        </div>
      </form>

      <dialog id="auth-modal" className="modal">
        <div className="modal-box md:min-w-3/5">
          <p className="m-2 mt-4 md:m-4 lg:mx-6">{modalText}</p>
          <div className="modal-action flex justify-center md:justify-end">
            <form method="dialog">
              <button className="btn btn-soft rounded-lg">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
