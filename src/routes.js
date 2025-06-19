// @mui material components
import Icon from "@mui/material/Icon";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";

// Pages
import AboutUs from "pages/LandingPages/AboutUs";
import ContactUs from "pages/LandingPages/ContactUs";
import SignIn from "pages/LandingPages/SignIn";
import SignUp from "pages/LandingPages/SignUp";
import Account from "pages/LandingPages/Account";
import OnlineRecharges from "pages/RechargeServices/OnlineRecharges";
import SpecialRechares from "pages/RechargeServices/SpecialRecharges";
import SpecialServices from "pages/RechargeServices/SpecialServices";
import FeedBacks from "pages/FeedBacks";
import Bills from "pages/Bills";
import Transactions from "pages/Transactions";
import LogOut from "pages/LandingPages/LogOut";

import { isAuthenticated } from "utils/auth";

const getRoutes = () => {
  const loggedIn = isAuthenticated();

  const routes = [
    {
      name: "online recharge",
      icon: <InfoIcon />,
      route: "/services/online-recharge",
      component: <OnlineRecharges />,
    },
    {
      name: "about us",
      icon: <InfoIcon />,
      route: "/about-us",
      component: <AboutUs />,
    },
    {
      name: "contact us",
      icon: <InfoIcon />,
      route: "/contact-us",
      component: <ContactUs />,
    },
    {
      name: "feedbacks",
      icon: <ContactMailIcon />,
      route: "/feedback",
      component: <FeedBacks />,
    },
    loggedIn && {
      name: "other services",
      icon: <Icon>dashboard</Icon>,
      columns: 1,
      rowsPerColumn: 2,
      collapse: [
        {
          name: "services",
          collapse: [
            {
              name: "special recharge",
              route: "/services/special-recharge",
              component: <SpecialRechares />,
              access: ["User"],
            },
            {
              name: "special services",
              route: "/services/special-service",
              component: <SpecialServices />,
              access: ["User"],
            },
          ],
        },
        {
          name: "bills & transactions",
          collapse: [
            {
              name: "bills",
              route: "/bill",
              component: <Bills />,
              access: ["User"],
            },
            {
              name: "transactions",
              route: "/transaction",
              component: <Transactions />,
              access: ["User"],
            },
          ],
        },
      ],
    },
    !loggedIn && {
      name: "sign in",
      icon: <LoginIcon />,
      route: "/authentication/sign-in",
      component: <SignIn />,
    },
    !loggedIn && {
      name: "sign up",
      icon: <LoginIcon />,
      route: "/authentication/sign-up",
      component: <SignUp />,
    },
    loggedIn && {
      name: "user",
      icon: <PersonIcon />,
      columns: 1,
      rowsPerColumn: 2,
      collapse: [
        {
          name: "account",
          collapse: [
            {
              name: "manage account",
              route: "/user/manage-account",
              component: <Account />,
              access: ["User"],
            },
            {
              name: "logout",
              route: "/logout",
              component: <LogOut />,
              access: ["User"],
            },
          ],
        },
      ],
    },
  ];

  return routes.filter(Boolean);
};

export default getRoutes;
