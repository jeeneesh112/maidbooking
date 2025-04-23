// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   console.log("isAuthenticated:", isAuthenticated);

//   return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
// };

// export default PrivateRoute;


import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated,user } = useSelector((state) => state.auth);
  // const { userData } = useSelector((state) => state.profile);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  console.log("isAuthenticated:", isAuthenticated);
  console.log("userData:", user);
  const userRoles = user?.roles || [];
  const isSuperAdmin = user?.userType === "superadmin";

  console.log("userRoles:", userRoles);

  console.log("allowedRoles:", allowedRoles);

  const hasAccess =
    isSuperAdmin || allowedRoles?.some((role) => userRoles.includes(role));

  return hasAccess ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;

