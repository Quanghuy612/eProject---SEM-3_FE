import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    Username: string;
    FullName: string;
    UserId: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    PhoneNumber: string;
}

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    Username: string | null;
    FullName: string | null;
    UserId: string | null;
    Role: string | null;
    PhoneNumber: string | null;
    setToken: (token: string | null) => void;
    setRefreshToken: (refreshToken: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            refreshToken: null,
            Username: null,
            FullName: null,
            UserId: null,
            Role: null,
            PhoneNumber: null,

            setToken: (token) => {
                if (token) {
                    try {
                        localStorage.setItem("token", token);
                        const decoded = jwtDecode<DecodedToken>(token);
                        set({
                            token,
                            Username: decoded.Username,
                            FullName: decoded.FullName,
                            UserId: decoded.UserId,
                            Role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
                            PhoneNumber: decoded.PhoneNumber,
                        });
                    } catch {
                        set({
                            token: null,
                            Username: null,
                            FullName: null,
                            UserId: null,
                            Role: null,
                            PhoneNumber: null,
                        });
                    }
                } else {
                    set({
                        token: null,
                        Username: null,
                        FullName: null,
                        UserId: null,
                        Role: null,
                        PhoneNumber: null,
                    });
                }
            },

            setRefreshToken: (refreshToken) =>
                set(() => {
                    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
                    else localStorage.removeItem("refreshToken");
                    return { refreshToken };
                }),

            logout: () => {
                localStorage.clear();
                set({ token: null, refreshToken: null, Username: null, FullName: null, UserId: null, Role: null, PhoneNumber: null });
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                token: state.token,
                refreshToken: state.refreshToken,
                Username: state.Username,
                FullName: state.FullName,
                UserId: state.UserId,
                Role: state.Role,
                PhoneNumber: state.PhoneNumber,
            }),
        }
    )
);
