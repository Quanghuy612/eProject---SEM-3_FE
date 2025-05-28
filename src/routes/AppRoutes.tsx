import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/home/Home";
import Error from "../pages/others/Error";
import Login from "../pages/auth/login/Login";
import SignUp from "../pages/auth/signup/SignUp";
import AboutUs from "../pages/others/AboutUs";
import ContactUs from "../pages/others/ContactUs";
import Admin from "../pages/admin/Admin";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <ProtectedRoute>
                    <Route path="/" element={<Home />} />
                </ProtectedRoute>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />
            </Route>
            <Route element={<AdminLayout />}>
                <ProtectedAdminRoute>
                    <Route path="/admin" element={<Admin />}></Route>
                </ProtectedAdminRoute>
            </Route>
            <Route path="*" element={<Error />}></Route>
        </Routes>
    );
};

export default AppRoutes;
