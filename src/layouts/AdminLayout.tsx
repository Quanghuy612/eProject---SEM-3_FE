import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useApiStore from "../stores/useApiStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect } from "react";
import type ApiResponse from "../types/ApiResponse";
import type { RoleMenuDTO, MenuDTO } from "../types/MenuResponse";
import { toast } from "react-toastify";
import { useMenuStore } from "../stores/useMenuStore";

type LogoutRequest = {
    refreshToken: string;
};

function AdminLayout() {
    const { request, reset } = useApiStore();
    const { token, logout, refreshToken } = useAuthStore();
    const { menus, setMenus } = useMenuStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        reset();
        if (token) {
            const fetchMenus = async () => {
                try {
                    const response = await request<ApiResponse<RoleMenuDTO>>({
                        method: "GET",
                        url: "/menu",
                    });

                    if (response.statusCode === 200 && response.data) {
                        setMenus(response.data.menus);
                    } else {
                        console.log(response.message);
                    }
                } catch (error) {
                    toast.error("Load menu failed");
                    console.error("Load menu error", error);
                }
            };

            fetchMenus();
        }
    }, [token]);

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
            console.log(response.message || "Logged out successfully");
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            logout();
            navigate("/login", { replace: true });
        }
    };

    const renderMenuLinks = (menuList: MenuDTO[]) => {
        return menuList.map((menu) => {
            const isActive = location.pathname === menu.url;
            const hasChildren = menu.childMenus && menu.childMenus.length > 0;

            if (hasChildren) {
                return (
                    <div key={menu.menuId} className="relative group">
                        <button className="px-3 py-2 rounded hover:bg-blue-600 transition flex items-center gap-1">
                            {menu.name}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white shadow-lg rounded z-10">
                            {menu.childMenus.map((child) => (
                                <Link
                                    key={child.menuId}
                                    to={child.url}
                                    className="block px-4 py-2 whitespace-nowrap text-sm hover:bg-blue-100 text-gray-800"
                                >
                                    {child.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                );
            }

            return (
                <Link key={menu.menuId} to={menu.url} className={`px-3 py-2 rounded hover:bg-blue-600 transition ${isActive ? "bg-blue-800" : ""}`}>
                    {menu.name}
                </Link>
            );
        });
    };

    return (
        <div className="flex flex-col h-full  text-gray-900">
            <header className="w-full bg-blue-700 text-white shadow-md">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <nav className="flex space-x-4">{renderMenuLinks(menus)}</nav>
                    <div className="space-x-4">
                        <button className="hover:underline" onClick={logOut}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
