/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Kit 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Navbar.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `name` key is used for the name of the route on the Navbar.
  2. The `icon` key is used for the icon of the route on the Navbar.
  3. The `collapse` key is used for making a collapsible item on the Navbar that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  4. The `route` key is used to store the route location which is used for the react router.
  5. The `href` key is used to store the external links location.
  6. The `component` key is used to store the component of its route.
  7. The `dropdown` key is used to define that the item should open a dropdown for its collapse items .
  8. The `description` key is used to define the description of
          a route under its name.
  9. The `columns` key is used to define that how the content should look inside the dropdown menu as columns,
          you can set the columns amount based on this key.
  10. The `rowsPerColumn` key is used to define that how many rows should be in a column.
*/

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
      icon: <ContactMailIcon />,
      route: "/contact-us",
      component: <ContactUs />,
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
          name: "feedback",
          collapse: [
            {
              name: "feedbacks",
              route: "/feedback",
              component: <FeedBacks />,
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
