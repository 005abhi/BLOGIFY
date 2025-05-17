import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
export const Layout = () => {
  let user = sessionStorage.getItem("user");
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Layout;
