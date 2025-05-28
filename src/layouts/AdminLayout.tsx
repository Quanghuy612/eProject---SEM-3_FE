import { Outlet } from "react-router-dom";

function AdminLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            <main className="flex-grow container mx-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
