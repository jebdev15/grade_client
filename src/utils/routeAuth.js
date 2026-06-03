import { redirect } from "react-router-dom";
import { AuthUtil } from "@/utils/authUtil";

const parseCookies = () => {
  if (typeof document === "undefined") {
    return {};
  }

  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .reduce((accumulator, cookie) => {
      const separatorIndex = cookie.indexOf("=");
      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = cookie.slice(0, separatorIndex);
      const value = cookie.slice(separatorIndex + 1);
      accumulator[key] = decodeURIComponent(value);
      return accumulator;
    }, {});
};

export const getProtectedRouteRedirect = (allowedAccessLevels) => {
  const cookies = parseCookies();

  if (!AuthUtil.isTokenValid(cookies.token)) {
    return "/";
  }

  if (!allowedAccessLevels.includes(cookies.accessLevel)) {
    return AuthUtil.getInitialPath(cookies);
  }

  return null;
};

export const protectLoader = (allowedAccessLevels, loader) => async (args) => {
  const redirectPath = getProtectedRouteRedirect(allowedAccessLevels);

  if (redirectPath) {
    throw redirect(redirectPath);
  }

  return loader ? loader(args) : null;
};