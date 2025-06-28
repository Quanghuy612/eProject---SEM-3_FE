import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "utils/auth";

const AdminPrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/authentication/sign-in" replace />;
};

AdminPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminPrivateRoute;
