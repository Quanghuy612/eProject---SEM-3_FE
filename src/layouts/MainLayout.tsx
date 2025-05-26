import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            <Header />
            <main className="flex-grow container mx-auto">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
