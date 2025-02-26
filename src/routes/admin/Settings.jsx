import React from "react";
import { Outlet } from "react-router";

const Settings = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </React.Suspense>
  );
};
export default React.memo(Settings);
