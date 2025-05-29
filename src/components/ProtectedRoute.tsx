import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const ProtectedRoute = () => {
    const token = useAuthStore((state) => state.token);
    const role = useAuthStore((state) => state.Role);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role !== "User") {
        return <Navigate to="*" replace />;
    }

    localStorage.setItem("returnURL", location.pathname + location.search);

    return <Outlet />;
};

export default ProtectedRoute;
