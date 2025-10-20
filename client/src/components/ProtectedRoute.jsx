import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { refreshAccessToken } from "../features/auth/authThunks";

const ProtectedRoute = () => {
  const accessToken = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const [hasTriedRefresh, setHasTriedRefresh] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!accessToken && !hasTriedRefresh) {
      const tryRefresh = async () => {
        await dispatch(refreshAccessToken());
        setHasTriedRefresh(true);
      };
      tryRefresh();
    } else if (accessToken && !hasTriedRefresh) {
      setHasTriedRefresh(true);
    }
  }, [accessToken, dispatch, hasTriedRefresh]);

  if (!hasTriedRefresh || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Authenticating...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
