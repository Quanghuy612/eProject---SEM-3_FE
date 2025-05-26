import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    Username: string;
    FullName: string;
    UserId: string;
}

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    Username: string | null;
    FullName: string | null;
    UserId: string | null;
    setToken: (token: string | null) => void;
    setRefreshToken: (refreshToken: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem("token"),
    refreshToken: localStorage.getItem("refreshToken"),
    Username: null,
    FullName: null,
    UserId: null,

    setToken: (token) =>
        set(() => {
            if (token) {
                localStorage.setItem("token", token);

                try {
                    const decoded = jwtDecode<DecodedToken>(token);
                    return {
                        token,
                        Username: decoded.Username,
                        FullName: decoded.FullName,
                        UserId: decoded.UserId,
                    };
                } catch {
                    return {
                        token,
                        Username: null,
                        FullName: null,
                        UserId: null,
                    };
                }
            } else {
                localStorage.removeItem("token");
                return {
                    token: null,
                    Username: null,
                    FullName: null,
                    UserId: null,
                };
            }
        }),

    setRefreshToken: (refreshToken) =>
        set(() => {
            if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
            else localStorage.removeItem("refreshToken");
            return { refreshToken };
        }),

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        set({ token: null, refreshToken: null, Username: null, FullName: null, UserId: null });
    },
}));
