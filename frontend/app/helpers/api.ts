import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../config";

const token = Cookies.get("token");
const headers = token ? { Authorization: `Bearer ${token}` } : {};

const api = axios.create({ baseURL: API_URL, headers });

export default api;
