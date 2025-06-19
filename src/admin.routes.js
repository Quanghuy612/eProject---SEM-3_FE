// Material Dashboard 2 React layouts
import Dashboard from "pages/Admin/dashboard";
import Billing from "pages/Admin/billing";
import Logout from "pages/LandingPages/LogOut";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Home",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/admin",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Bills",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Log out",
    key: "logout",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/logout",
    component: <Logout />,
  },
];

export default routes;
