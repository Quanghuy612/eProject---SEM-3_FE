import { Route, Routes } from "react-router-dom";
//================================================
import ProtectedRoute from "../components/ProtectedRoute";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import OtherRoute from "../components/OtherRoute";
//================================================
import Home from "../pages/home/Home";
import Error from "../pages/others/Error";
import Login from "../pages/auth/login/Login";
import SignUp from "../pages/auth/signup/SignUp";
import AboutUs from "../pages/others/AboutUs";
import ContactUs from "../pages/others/ContactUs";
import Index from "../pages/admin/Index";
//================================================
import OnlineRecharges from "../pages/onlineRecharges/OnlineRecharges";
import SpecialRecharges from "../pages/user/specialRecharges/SpecialRecharges";
import SpecialServices from "../pages/user/specialServices/SpecialServices";
import UserBills from "../pages/user/bills/Bills";
import UserTransactions from "../pages/user/transactions/Transactions";
import Account from "../pages/user/account/Account";
import Feedback from "../pages/feedback/Feedback";
//================================================
import AccountManagement from "../pages/admin/accountManagement/AccountManagement";
import TransactionManagement from "../pages/admin/transactionManagement/TransactionManagement";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="user" element={<ProtectedRoute />}>
                    <Route path="special-recharges" element={<SpecialRecharges />} />
                    <Route path="special-services" element={<SpecialServices />} />
                    <Route path="bills" element={<UserBills />} />
                    <Route path="transactions" element={<UserTransactions />} />
                    <Route path="account" element={<Account />} />
                    <Route path="feedback" element={<Feedback />} />
                </Route>
                <Route path="/" element={<OtherRoute />}>
                    <Route index element={<Home />} />
                    <Route path="online-recharges" element={<OnlineRecharges />} />
                    <Route path="about-us" element={<AboutUs />} />
                    <Route path="contact-us" element={<ContactUs />} />
                </Route>
            </Route>
            <Route element={<AdminLayout />}>
                <Route path="admin" element={<ProtectedAdminRoute />}>
                    <Route index element={<Index />}></Route>
                    <Route path="account-management" element={<AccountManagement />}></Route>
                    <Route path="transaction-management" element={<TransactionManagement />}></Route>
                </Route>
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="*" element={<Error />}></Route>
        </Routes>
    );
};

export default AppRoutes;
