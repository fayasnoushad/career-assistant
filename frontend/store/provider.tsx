"use client";

import store from "./index";
import Cookies from "js-cookie";
import { Provider, useDispatch } from "react-redux";
import { ReactNode, useEffect } from "react";
import { setHasApiKey } from "@/store/slices/apiKeySlice";
import api from "@/app/helpers/api";

function StoreInit() {
  const dispatch = useDispatch();

  const fetchApiStatus = async () => {
    try {
      const response = await api.post("/auth/details/");
      const user = response.data;
      dispatch(setHasApiKey(Boolean(user?.gemini_api)));
    } catch (e: any) {
      if (e?.status === 404) Cookies.remove("token");
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;
    fetchApiStatus();
  }, []);
  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <StoreInit />
      {children}
    </Provider>
  );
}
