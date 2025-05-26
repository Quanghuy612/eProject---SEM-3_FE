import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useApiStore from "../../../stores/useApiStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type ApiResponse from "../../../types/ApiResponse";

const signupSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    fullname: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
});

type SignupInputs = {
    username: string;
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function SignUp() {
    const { request, loading, error } = useApiStore();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupInputs>({
        resolver: yupResolver(signupSchema),
    });

    const onSubmit = async (data: SignupInputs) => {
        try {
            const response = await request<ApiResponse<null>>({
                method: "POST",
                url: "/auth/signup",
                data,
            });

            if (response.statusCode == 200) {
                toast.success(response.message);
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block mb-1 font-medium">
                        Username
                    </label>
                    <input id="username" type="text" {...register("username")} className="w-full border px-3 py-2 rounded" autoComplete="off" />
                    {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>}
                </div>

                <div>
                    <label htmlFor="fullname" className="block mb-1 font-medium">
                        Full Name
                    </label>
                    <input id="fullname" type="text" {...register("fullname")} className="w-full border px-3 py-2 rounded" autoComplete="off" />
                    {errors.fullname && <p className="text-red-600 text-sm mt-1">{errors.fullname.message}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block mb-1 font-medium">
                        Email
                    </label>
                    <input id="email" type="email" {...register("email")} className="w-full border px-3 py-2 rounded" autoComplete="off" />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block mb-1 font-medium">
                        Password
                    </label>
                    <input id="password" type="password" {...register("password")} className="w-full border px-3 py-2 rounded" autoComplete="off" />
                    {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block mb-1 font-medium">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        className="w-full border px-3 py-2 rounded"
                        autoComplete="off"
                    />
                    {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
                </div>
                {error && (
                    <div>
                        <b className="text-red-500">{error}</b>
                    </div>
                )}
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
            <p className="mt-4 text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-green-600 hover:underline">
                    Login
                </Link>
            </p>
        </motion.div>
    );
}
