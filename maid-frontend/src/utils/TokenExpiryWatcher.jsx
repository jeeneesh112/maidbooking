import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TokenExpiryWatcher = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();
  const { tokenIssuedAt, isAuthenticated } = useSelector((state) => state.auth);
  console.log("TokenExpiryWatcher - tokenIssuedAt:", tokenIssuedAt);
    console.log("TokenExpiryWatcher - isAuthenticated:", isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !tokenIssuedAt) return;

    const oneHour = 1 * 60 * 1000;
    const expiryTime = tokenIssuedAt + oneHour;
    const now = Date.now();
    const remainingTime = expiryTime - now;

    console.log("TokenExpiryWatcher - remainingTime:", remainingTime);

    if (remainingTime <= 0) {
        console.log("Token expired, logging out...");
      dispatch(logout());
      navigate("/auth/login");
      return;
    }

    const timeout = setTimeout(() => {
        // console.log("Token expired, logging out...");
      dispatch(logout());
      navigate("/auth/login");
    }, remainingTime);

    return () => clearTimeout(timeout);
  }, [tokenIssuedAt, isAuthenticated, dispatch,navigate]);

  return null;
};

export default TokenExpiryWatcher;
