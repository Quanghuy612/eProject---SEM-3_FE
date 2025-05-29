import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const ProtectedAdminRoute = () => {
    const token = useAuthStore((state) => state.token);
    const role = useAuthStore((state) => state.Role);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role !== "Admin") {
        return <Navigate to="*" replace />;
    }

    console.log("returnURL");
    localStorage.setItem("returnURL", location.pathname + location.search);

    return <Outlet />;
};

export default ProtectedAdminRoute;
