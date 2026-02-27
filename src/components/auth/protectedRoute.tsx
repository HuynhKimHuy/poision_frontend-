import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";

const ProtectedRoute = () => {
  const { accessToken , user, refresh, fetchMe } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
