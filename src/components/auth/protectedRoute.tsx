import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

const ProtectedRoute = () => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [resolvedToken, setResolvedToken] = useState<string | null>(accessToken);

  useEffect(() => {
    let active = true;

    const init = async () => {
      const token = accessToken ?? (await refresh());

      if (token && !user) {
        await fetchMe(token);
      }

      if (active) {
        setResolvedToken(token ?? null);
        setChecking(false);
      }
    };

    init();

    return () => {
      active = false;
    };
  }, [accessToken, refresh, fetchMe, user]);

  if (checking || loading) {
    return <div className="flex h-screen">Dang tai trang...</div>;
  }

  if (!resolvedToken) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: location.pathname, user }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
