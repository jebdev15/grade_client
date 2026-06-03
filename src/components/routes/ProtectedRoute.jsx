import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { AuthUtil } from "@/utils/authUtil";

const ProtectedRoute = ({ allowedAccessLevels, children }) => {
  const [cookies] = useCookies(AuthUtil.siteCookies);
  const location = useLocation();

  if (!AuthUtil.isTokenValid(cookies.token)) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!allowedAccessLevels.includes(cookies.accessLevel)) {
    return <Navigate to={AuthUtil.getInitialPath(cookies)} replace state={{ from: location }} />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;