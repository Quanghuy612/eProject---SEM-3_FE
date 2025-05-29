import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useApiStore from "../../../stores/useApiStore";
import type ApiResponse from "../../../types/ApiResponse";
import { useAuthStore } from "../../../stores/useAuthStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const loginSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

type LoginInputs = {
    username: string;
    password: string;
};

interface RoleToken {
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
}

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export default function Login() {
    const { request, loading, error, reset } = useApiStore();
    const { setToken, setRefreshToken } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        reset();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInputs>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInputs) => {
        try {
            const response = await request<ApiResponse<TokenResponse>>({
                method: "POST",
                url: "/auth/login",
                data,
            });

            if (response.statusCode == 200 && response.data) {
                setToken(response.data.accessToken);
                setRefreshToken(response.data.refreshToken);
                toast.success(response.message);
                const decoded = jwtDecode<RoleToken>(response.data.accessToken);
                const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                const returnURL = localStorage.getItem("returnURL") || "/";

                if (role === "Admin") {
                    navigate("/admin", { replace: true });
                } else {
                    navigate(returnURL, { replace: true });
                }

                localStorage.removeItem("returnURL");
            }
        } catch (error) {
            toast.success("Login failed");
            console.error("Login failed", error);
        } finally {
            reset();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-md mx-auto h-full flex flex-col justify-center p-4 md:p-0"
        >
            <div className="p-6 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block mb-1 font-medium">
                            Username
                        </label>
                        <input
                            id="username"
                            type="username"
                            {...register("username")}
                            className="w-full border px-3 py-2 rounded"
                            autoComplete="off"
                        />
                        {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-1 font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password")}
                            className="w-full border px-3 py-2 rounded"
                            autoComplete="off"
                        />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    {error && (
                        <div>
                            <b className="text-red-500">{error}</b>
                        </div>
                    )}
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}
