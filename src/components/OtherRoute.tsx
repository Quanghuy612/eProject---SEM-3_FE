import { Outlet, useLocation } from "react-router-dom";

const OtherRoute = () => {
    const location = useLocation();

    localStorage.setItem("returnURL", location.pathname + location.search);

    return <Outlet />;
};

export default OtherRoute;
