// Material Dashboard 2 React layouts
import Dashboard from "pages/Admin/dashboard";
import Billing from "pages/Admin/billing";
import Logout from "pages/LandingPages/LogOut";
import SignIn from "pages/Admin/authentication/sign-in";
import AdminPrivateRoute from "examples/Admin/ProtectedRoute/Admin.ProtectedRoute";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
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
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: (
      <AdminPrivateRoute>
        <Billing />
      </AdminPrivateRoute>
    ),
  },
  {
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
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/logout",
    component: (
      <AdminPrivateRoute>
        <Logout />
      </AdminPrivateRoute>
    ),
  },
];

export default routes;
