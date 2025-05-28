import { toast } from "react-toastify";
import useApiStore from "../stores/useApiStore";
import { useAuthStore } from "../stores/useAuthStore";
import type ApiResponse from "../types/ApiResponse";
import { Link } from "react-router-dom";

type LogoutRequest = {
    refreshToken: string;
};

function Header() {
    const { FullName, logout, token, refreshToken } = useAuthStore();
    const { request } = useApiStore();

    const logOut = async () => {
        if (!refreshToken) return;

        const data: LogoutRequest = { refreshToken };

        try {
            const response = await request<ApiResponse<null>>({
                method: "POST",
                url: "/auth/logout",
                data,
            });

            logout();
            toast.success(response.message || "Logged out successfully");
        } catch (error) {
            console.error("Logout failed", error);
            toast.error("Failed to logout.");
        }
    };

    return (
        <div className="header-container flex justify-between items-center p-2 bg-gray-100">
            <div className="text-sm text-gray-800 w-1/3">{token && `Welcome, ${FullName}`}</div>

            <div className="flex justify-evenly w-1/3">
                <div className="text-lg font-bold text-blue-600">
                    <Link to="/">Home</Link>
                </div>
                <div className="text-lg font-bold text-blue-600">
                    <Link to="/">Online Recharge</Link>
                </div>
                <div className="text-lg font-bold text-blue-600">
                    <Link to="/">About Us</Link>
                </div>
                <div className="text-lg font-bold text-blue-600">
                    <Link to="/">Contact Us</Link>
                </div>
            </div>

            <div className="w-1/3 text-end">
                {token && (
                    <button onClick={logOut} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
}

export default Header;
