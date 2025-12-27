import { configureStore } from "@reduxjs/toolkit";
import apiKeyReducer from "./slices/apiKeySlice";

export default configureStore({
  reducer: {
    apiKey: apiKeyReducer,
  },
});
