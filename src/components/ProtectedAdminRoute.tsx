import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const ProtectedAdminRoute = ({ children }: { children: React.ReactElement }) => {
    const token = useAuthStore((state) => state.token);
    const role = useAuthStore((state) => state.Role);
    const location = useLocation();

    if (!token) {
        return <Navigate to={`/login?returnURL=${encodeURIComponent(location.pathname)}`} replace />;
    }

    if (role !== "Admin") {
        return <Navigate to="*" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
