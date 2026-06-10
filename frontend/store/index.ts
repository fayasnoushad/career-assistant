import { create } from "zustand";

interface AuthStore {
    loginStatus: boolean;
    setLoginStatus: (status: boolean) => void;
}

interface ApiKeyStore {
    apiKeyStatus: boolean;
    setApiKeyStatus: (status: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    loginStatus: false,
    setLoginStatus: (status) => set({ loginStatus: status }),
}));

export const useApiStore = create<ApiKeyStore>((set) => ({
    apiKeyStatus: false,
    setApiKeyStatus: (status) => set({ apiKeyStatus: status }),
}));
