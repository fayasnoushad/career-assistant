import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const getLoginStatus = async (): Promise<boolean> => {
  const token = Cookies.get("token");
  if (token) {
    try {
      const decoded: { exp?: number } = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 > Date.now()) {
        return true;
      }
      Cookies.remove("token");
    } catch {}
  }
  return false;
};
