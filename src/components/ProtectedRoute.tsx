import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = useAuthStore((state) => state.token);
    const location = useLocation();

    if (!token) {
        return <Navigate to={`/login?returnURL=${encodeURIComponent(location.pathname + location.search)}`} replace />;
    }

    return children;
};

export default ProtectedRoute;
