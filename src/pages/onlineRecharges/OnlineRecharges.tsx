import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnlineReChargeStore } from "../../stores/useOnlineReChargeStore";
import useApiStore from "../../stores/useApiStore";
import type ApiResponse from "../../types/ApiResponse";
import { toast } from "react-toastify";
import { useAuthStore } from "../../stores/useAuthStore";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "../../components/Modal";
import type TopUpPackage from "../../types/RechargeResponse";

type vertifyOtp = {
    otp: string;
};

type FormData = {
    phoneNumber: string;
};

const schema = yup.object().shape({
    phoneNumber: yup
        .string()
        .required("Mobile number is required")
        .matches(/^\d{10}$/, "Mobile number must be 10 digits"),
});

const steps = ["Verify Number", "Select Plan", "Payment", "Receipt"];

interface OtpInputsProps {
    submitOtp: (otp: string) => void;
}

const OtpInputs: React.FC<OtpInputsProps> = ({ submitOtp }) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return;

        const newDigits = [...otpDigits];
        newDigits[index] = value;
        setOtpDigits(newDigits);

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullOtp = otpDigits.join("");
        if (fullOtp.length === 6) {
            submitOtp(fullOtp);
        } else {
            toast.error("Please enter all 6 digits of the OTP.");
        }
    };

    return (
        <div className="flex items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                <h5>Enter OTP</h5>
                <div className="flex space-x-2">
                    {[...Array(6)].map((_, i) => (
                        <input
                            key={i}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            className="w-10 h-10 text-center border rounded text-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                            ref={(el) => {
                                inputRefs.current[i] = el;
                            }}
                            value={otpDigits[i]}
                            onChange={(e) => handleChange(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                        />
                    ))}
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    Confirm
                </button>
            </form>
        </div>
    );
};

const OnlineRecharge: React.FC = () => {
    const { step, setStep, mobile, setMobile, selectedPlan, setSelectedPlan, reset: resetOnlineCharge } = useOnlineReChargeStore();
    const { request, loading, error, reset } = useApiStore();
    const { token } = useAuthStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [otp, setOtp] = useState<string | null>(null);
    const [onlineRecharges, setOnlineRecharges] = useState<TopUpPackage[] | []>([]);

    useEffect(() => {
        reset();
    }, []);

    const stepVariants = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
    };

    const goToStep = (index: number) => {
        if (index <= step) {
            setStep(index);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const getOnlineRecharges = async () => {
        try {
            const response = await request<ApiResponse<TopUpPackage[]>>({
                method: "GET",
                url: "/recharge/online-recharge",
            });
            if (response.statusCode === 200 && response.data) {
                setOnlineRecharges(response.data);
            }
        } catch (error) {
            console.log(error);
            toast.error("Đã có lỗi xảy ra ");
        } finally {
            reset();
        }
    };

    const verifyPhoneNumber = async () => {
        try {
            const data = {
                Phone: mobile,
            };

            let response: ApiResponse<null> | ApiResponse<vertifyOtp>;

            if (token) {
                response = await request<ApiResponse<null>>({
                    method: "POST",
                    url: "/recharge/vertify-user",
                    data,
                });
                if (response.statusCode === 200 && response.data) {
                    setStep(2);
                    getOnlineRecharges();
                }
            } else {
                response = await request<ApiResponse<vertifyOtp>>({
                    method: "POST",
                    url: "/recharge/get-otp",
                    data,
                });
                if (response.statusCode === 200 && response.data) {
                    const data = response.data;
                    setTimeout(() => {
                        setOtp(data.otp);
                    }, 1500);
                    setModalOpen(true);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Đã có lỗi xảy ra ");
        }
    };

    const vertifyOtp = async (otp: string) => {
        setOtp(null);
        try {
            const data = {
                Phone: mobile,
                Otp: otp,
            };

            const response = await request<ApiResponse<null>>({
                method: "POST",
                url: "/recharge/vertify-otp",
                data,
            });

            if (response.statusCode === 200) {
                setStep(2);
                getOnlineRecharges();
            }
        } catch (e) {
            console.log(e);
        } finally {
            setModalOpen(false);
        }
    };

    return (
        <>
            <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
                <h2 className="text-2xl font-semibold text-center mb-6">📱 Online Recharge</h2>

                <div className="flex items-center justify-between mb-8">
                    {steps.map((label, index) => {
                        const current = step - 1;
                        const isCompleted = index < current;
                        const isActive = index === current;

                        return (
                            <React.Fragment key={index}>
                                <div className="flex flex-col items-center text-xs cursor-pointer" onClick={() => goToStep(index + 1)}>
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                        ${isCompleted ? "bg-green-500 text-white" : isActive ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"}
                      `}
                                    >
                                        {isCompleted ? "✓" : index + 1}
                                    </div>
                                    <span className="mt-1 text-center">{label}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="flex-1 h-1 bg-gray-300 mx-2 relative">
                                        <div
                                            className={`absolute top-0 left-0 h-1 transition-all duration-300 
                          ${index < current ? "bg-green-500 w-full" : "bg-gray-300 w-full"}
                        `}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="space-y-4"
                    >
                        {step === 1 && (
                            <form
                                onSubmit={handleSubmit(({ phoneNumber }) => {
                                    setMobile(phoneNumber);
                                    verifyPhoneNumber();
                                })}
                            >
                                <label className="block text-sm font-medium mb-1">Enter Mobile Number:</label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="10-digit mobile number"
                                    {...register("phoneNumber")}
                                    autoComplete="off"
                                />
                                {errors.phoneNumber && <p className="text-red-500 my-1">{errors.phoneNumber.message}</p>}
                                {error && <b className="my-1 text-red-500 text-sm">{error} Please try again</b>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2"
                                >
                                    {loading ? "Verifying..." : "Process"}
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <>
                                <h3 className="text-lg font-medium mb-2">Select a Top-Up Plan</h3>
                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-4 py-2 text-left">Select</th>
                                            <th className="border px-4 py-2 text-left">Plan</th>
                                            <th className="border px-4 py-2 text-left">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {onlineRecharges.map((plan) => (
                                            <tr key={plan.topUpId}>
                                                <td className="border px-4 py-2">
                                                    <input
                                                        type="radio"
                                                        name="plan"
                                                        checked={selectedPlan === plan.topUpId}
                                                        onChange={() => setSelectedPlan(plan.topUpId)}
                                                    />
                                                </td>
                                                <td className="border px-4 py-2">{plan.topUpName}</td>
                                                <td className="border px-4 py-2">{plan.price} $</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-between">
                                    <button onClick={() => setStep(1)} className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400">
                                        Back
                                    </button>
                                    <button onClick={() => setStep(3)} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                                        Submit
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <h3 className="text-lg font-medium mb-2">Payment Details</h3>
                                <input type="text" placeholder="Card Number" className="w-full border px-3 py-2 rounded" />
                                <input type="text" placeholder="Expiry (MM/YY)" className="w-full border px-3 py-2 rounded" />
                                <input type="text" placeholder="CVV" className="w-full border px-3 py-2 rounded" />
                                <div className="flex justify-between">
                                    <button onClick={() => setStep(2)} className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400">
                                        Back
                                    </button>
                                    <button onClick={() => setStep(4)} className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
                                        Pay Now
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 4 && (
                            <>
                                <h3 className="text-lg font-semibold text-green-600">✅ Transaction Successful!</h3>
                                <div className="bg-gray-100 p-4 rounded">
                                    <p>
                                        <strong>Transaction ID:</strong> TXN123456
                                    </p>
                                    <p>
                                        <strong>Mobile:</strong> {mobile}
                                    </p>
                                    <p>
                                        <strong>Plan:</strong> Talktime ₹{selectedPlan}
                                    </p>
                                    <p>
                                        <strong>Date:</strong> {new Date().toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <button onClick={() => window.print()} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                                        Print Receipt
                                    </button>
                                    <button onClick={resetOnlineCharge} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="flex gap-8 p-6 justify-center items-center min-h-[400px]">
                    <div className="relative w-60 h-[400px] rounded-3xl bg-black flex flex-col items-center shadow-xl border-4 border-gray-800">
                        <div className="w-24 h-6 bg-gray-900 rounded-b-xl mt-2 relative flex items-center justify-center">
                            <div className="w-12 h-1 bg-gray-700 rounded-full"></div>
                            <div className="absolute left-4 w-3 h-3 bg-gray-700 rounded-full"></div>
                        </div>
                        <div className="bg-white w-[200px] h-72 rounded-xl p-4 mt-4 flex flex-col space-y-4 overflow-auto shadow-inner">
                            <h3 className="text-center font-semibold mb-2 text-gray-700">Messages</h3>

                            <div className="bg-blue-100 text-blue-800 px-2 py-3 rounded-2xl max-w-full self-start shadow-md break-words font-mono">
                                Your otp: {otp}
                            </div>
                        </div>
                        <div className="my-auto w-10 h-10 bg-gray-800 rounded-full shadow-inner border-4 border-gray-700 flex items-center justify-center cursor-pointer">
                            <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                        </div>
                    </div>
                    <OtpInputs submitOtp={vertifyOtp} />
                </div>
            </Modal>
        </>
    );
};

export default OnlineRecharge;
