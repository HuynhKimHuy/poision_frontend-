import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

const ProtectedRoute = () => {
  const { accessToken, refresh } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!accessToken) await refresh();
      if (active) setChecking(false);
    };
    run();
    return () => {
      active = false;
    };
  }, [accessToken, refresh]);

  if (checking) return null;
  if (!accessToken) return <Navigate to="/signin" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
