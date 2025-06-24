import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "pages/Error";
import { Navigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 React themes
import Presentation from "pages/Presentation";

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, useLocation } from "react-router-dom";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/Admin/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Admin/Sidenav";
import Configurator from "examples/Admin/Configurator";
import Dashboard from "pages/Admin/dashboard";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React themes
import theme from "assets/admin/theme";
import themeRTL from "assets/admin/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/admin/theme-dark";
import themeDarkRTL from "assets/admin/theme-dark/theme-rtl";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/admin/images/logo-ct.png";
import brandDark from "assets/admin/images/logo-ct-dark.png";

import getRoutes from "routes";
import getAdminRoutes from "admin.routes";

function AdminApp() {
  const { pathname } = useLocation();
  const adminRoutes = getAdminRoutes();

  const getRoutesAdmin = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutesAdmin(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  const content = (
    <>
      <ToastContainer position="top-right" autoClose={3000} toastClassName="custom-toast" />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Material Dashboard 2"
            routes={adminRoutes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutesAdmin(adminRoutes)}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </>
  );

  if (direction === "rtl") {
    return (
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
          <CssBaseline />
          {content}
        </ThemeProvider>
      </CacheProvider>
    );
  }

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {content}
    </ThemeProvider>
  );
}

function UserApp() {
  const { pathname } = useLocation();
  const routes = getRoutes();

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

export default function App() {
  const ROLE = process.env.REACT_APP_MODE;

  if (ROLE === "admin") {
    return <AdminApp />;
  }

  return <UserApp />;
}
