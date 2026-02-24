import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

const ProtectedRoute = () => {
  const { user, loading, refresh, fetchMe } = useAuthStore();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Luôn thử refresh token đầu tiên để verify token còn hợp lệ
        const newToken = await refresh();

        // Nếu refresh thành công, lấy user info
        if (newToken) {
          await fetchMe(newToken);
        }
        // Nếu refresh fail, clearState() đã được gọi trong refresh()
      } catch (error) {
        console.log("Auth check error:", error);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []); // Empty dependency array - chỉ chạy 1 lần khi mount

  if (checking || loading) {
    return <div className="flex h-screen">Đang tải trang...</div>;
  }

  // Nếu không có user sau khi check, redirect to signin
  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
