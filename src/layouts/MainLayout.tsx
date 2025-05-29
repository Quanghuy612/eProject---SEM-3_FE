import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import useApiStore from "../stores/useApiStore";
import { useEffect } from "react";
import type { RoleMenuDTO } from "../types/MenuResponse";
import { toast } from "react-toastify";
import type ApiResponse from "../types/ApiResponse";
import { useMenuStore } from "../stores/useMenuStore";
import { ChevronRight } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

function MainLayout() {
    const { request, reset } = useApiStore();
    const { token } = useAuthStore();
    const { menus, setMenus, sidebarOpen, setSidebarOpen, openMenus, toggleMenu } = useMenuStore();
    const location = useLocation();
    const role = useAuthStore((state) => state.Role);

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

    const renderMenu = (menu: (typeof menus)[number], location: ReturnType<typeof useLocation>, index: number) => {
        const isActive = location.pathname === menu.url;
        const isOpen = openMenus.includes(menu.menuId);
        const hasChildren = menu.childMenus?.length > 0;

        return (
            <li key={menu.menuId} className={`mb-1 ${index !== 0 ? "border-t border-gray-200 pt-2 mt-2" : ""}`}>
                {hasChildren ? (
                    <button
                        onClick={() => toggleMenu(menu.menuId)}
                        className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-gray-100 text-gray-800 transition-colors duration-200"
                    >
                        <span>{menu.name}</span>
                        <ChevronRight size={16} className={`transform transition-transform duration-200 ${isOpen ? "rotate-90" : "rotate-0"}`} />
                    </button>
                ) : (
                    <Link
                        to={menu.url}
                        className={`block px-4 py-2 rounded-md transition-colors duration-200 ${
                            isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100 text-gray-800"
                        }`}
                    >
                        {menu.name}
                    </Link>
                )}

                {isOpen && hasChildren && (
                    <ul className="pl-3 mt-1 ml-2">{menu.childMenus.map((child, childIndex) => renderMenu(child, location, childIndex))}</ul>
                )}
            </li>
        );
    };

    if (role === "Admin") {
        return <Navigate to="*" replace />;
    }

    return (
        <div className="flex flex-col h-full text-gray-900 overflow-x-hidden">
            <Header />
            <main className="flex-grow relative flex px-4 md:px-16 lg:px-64">
                <div className="flex-grow-0 h-auto w-full">
                    <Outlet />
                </div>
                {token && (
                    <aside
                        className={`fixed md:absolute top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30
                        ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-full"} md:translate-x-0`}
                    >
                        <div
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 bg-blue-600 text-white p-2 rounded-l-md cursor-pointer shadow-lg hover:bg-blue-700 transition-transform duration-300 ease-in-out ${
                                sidebarOpen ? "translate-x-0" : "-translate-x-1/2"
                            }`}
                        >
                            <ChevronRight
                                size={20}
                                className={`transition-transform duration-300 ease-in-out ${sidebarOpen ? "rotate-0" : "rotate-180"}`}
                            />
                        </div>

                        <div className="p-4 overflow-y-auto h-full">
                            <h2 className="text-xl font-bold mb-4">Menu</h2>
                            <ul>{menus.map((menu, index) => renderMenu(menu, location, index))}</ul>
                        </div>
                    </aside>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
