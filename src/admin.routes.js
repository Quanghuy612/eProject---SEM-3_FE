// Material Dashboard 2 React layouts
import Dashboard from "pages/Admin/dashboard";
import Bill from "pages/Admin/bill";
import Logout from "pages/LandingPages/LogOut";
import SignIn from "pages/Admin/authentication/sign-in";
import AdminPrivateRoute from "examples/Admin/ProtectedRoute/Admin.ProtectedRoute";
import Transactions from "pages/Admin/transactions";
import Packages from "pages/Admin/packages";
import Users from "pages/Admin/user";
import Profile from "pages/Admin/profile";
import Feedback from "pages/Admin/feedback";

// @mui icons
import Icon from "@mui/material/Icon";
import { isAuthenticated } from "utils/auth";

const getAdminRoutes = () => {
  const loggedIn = isAuthenticated();

  return [
    {
      type: "collapse",
      name: "Home",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: "/admin",
      component: (
        <AdminPrivateRoute>
          <Dashboard />
        </AdminPrivateRoute>
      ),
    },
    {
      type: "collapse",
      name: "Bills",
      key: "bill",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/admin/bills",
      component: (
        <AdminPrivateRoute>
          <Bill />
        </AdminPrivateRoute>
      ),
    },
    {
      type: "collapse",
      name: "Transactions",
      key: "transaction",
      icon: <Icon fontSize="small">paid</Icon>,
      route: "/admin/transactions",
      component: (
        <AdminPrivateRoute>
          <Transactions />
        </AdminPrivateRoute>
      ),
    },
    {
      type: "collapse",
      name: "Packages",
      key: "package",
      icon: <Icon fontSize="small">local_offer</Icon>,
      route: "/admin/packages",
      component: (
        <AdminPrivateRoute>
          <Packages />
        </AdminPrivateRoute>
      ),
    },
    {
      type: "collapse",
      name: "Feedbacks",
      key: "feedback",
      icon: <Icon fontSize="small">feedback</Icon>,
      route: "/admin/feedbacks",
      component: (
        <AdminPrivateRoute>
          <Feedback />
        </AdminPrivateRoute>
      ),
    },
    {
      type: "collapse",
      name: "Users",
      key: "user",
      icon: <Icon fontSize="small">people</Icon>,
      route: "/admin/users",
      component: (
        <AdminPrivateRoute>
          <Users />
        </AdminPrivateRoute>
      ),
    },
    {
      type: "collapse",
      name: "Profile",
      key: "profile",
      icon: <Icon fontSize="small">person</Icon>,
      route: "/admin/profile",
      component: (
        <AdminPrivateRoute>
          <Profile />
        </AdminPrivateRoute>
      ),
    },
    !loggedIn && {
      type: "collapse",
      name: "Sign In",
      key: "sign-in",
      icon: <Icon fontSize="small">login</Icon>,
      route: "/authentication/sign-in",
      component: <SignIn />,
    },
    {
      type: "collapse",
      name: "Log out",
      key: "logout",
      icon: <Icon fontSize="small">logout</Icon>,
      route: "/logout",
      component: <Logout />,
    },
  ].filter(Boolean);
};

export default getAdminRoutes;
