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

import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "pages/Error";

// react-router components
import { Routes, Route, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 React themes
import theme from "assets/theme";
import Presentation from "pages/Presentation";
// Material Kit 2 React routes
import getRoutes from "routes";

export default function App() {
  const { pathname } = useLocation();
  const routes = getRoutes();

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const renderRoutes = (allRoutes) =>
    allRoutes.flatMap((route) => {
      if (route.collapse) {
        return renderRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route key={route.key || route.route} path={route.route} element={route.component} />
        );
      }

      return [];
    });

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} toastClassName="custom-toast" />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {renderRoutes(routes)}
          <Route path="/" element={<Presentation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}
