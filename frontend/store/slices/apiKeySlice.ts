import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ApiKeyState = {
  hasApiKey: boolean;
};

const initialState: ApiKeyState = {
  hasApiKey: false,
};

const apiKeySlice = createSlice({
  name: "apiKey",
  initialState,
  reducers: {
    setHasApiKey(state, action: PayloadAction<boolean>) {
      state.hasApiKey = action.payload;
    },
  },
});

export const { setHasApiKey } = apiKeySlice.actions;
export default apiKeySlice.reducer;
