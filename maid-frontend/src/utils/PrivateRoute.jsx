import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated,user } = useSelector((state) => state.auth);
  // const { userData } = useSelector((state) => state.profile);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  const userRoles = user?.roles || [];
  const isSuperAdmin = user?.userType === "superadmin";
  const hasAccess =
    isSuperAdmin || allowedRoles?.some((role) => userRoles.includes(role));

  return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;

