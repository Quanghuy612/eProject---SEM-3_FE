import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import API from "../../../api/api";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  UserId: string;
  Username: string;
  FullName?: string;
  Password?: string;
  PhoneNumber?: string;
  // role?: string;
};

type FormData = {
  userId: number;
  username: string;
  phoneNumber: string;
  fullname: string;
  password?: string;
  currentPassword: string;
  email: string;
};

export default function Account() {
  const token = localStorage.getItem("token") || "";

  const [formData, setFormData] = useState<FormData>({
    userId: -1,
    username: "",
    phoneNumber: "",
    fullname: "",
    password: "",
    currentPassword: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let userIdFromToken: number | null = null;

    if (token) {
      try {
        const decoded: TokenPayload = jwtDecode(token);
        userIdFromToken = parseInt(decoded.UserId);
      } catch (err) {
        console.error("Token decode failed", err);
        setLoading(false);
        return;
      }
    }

    const fetchUser = async () => {
      try {
        const response = await API.get(`users/${userIdFromToken}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData((prev) => ({
          ...prev,
          ...response.data,
        }));
      } catch (error) {
        console.error("Failed to fetch user info", error);
        setMessage("Failed to load user information.");
      } finally {
        setLoading(false);
      }
    };

    if (userIdFromToken !== null) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Please fix the errors in the form");
      return;
    }

    try {
      const payload = {
        ...formData,
        password: formData.password || undefined,
      };

      await API.put(`users/${formData.userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Update successful!");
      setFormData((prev) => ({
        ...prev,
        password: "",
        currentPassword: "",
      }));
    } catch (error) {
      console.error("Update failed", error);
      setMessage("Update failed. Please check your current password.");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-600">Loading information...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Account Information</h2>
            <p className="mt-1 text-sm text-gray-600">Update your personal information</p>
          </div>

          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            <div className="px-6 py-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    disabled
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    disabled
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    className={`block w-full px-3 py-2 border ${errors.fullname ? "border-red-500" : "border-gray-300"} rounded-md`}
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                  {errors.fullname && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    className={`block w-full px-3 py-2 border ${errors.currentPassword ? "border-red-500" : "border-gray-300"} rounded-md`}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password (optional)
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={`block w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md`}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`block w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {message && (
                <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {message}
                </p>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 text-right">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                disabled={!formData.fullname || !formData.email || !formData.currentPassword}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
