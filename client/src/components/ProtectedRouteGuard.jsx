import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRouteGuard({
  user,
  isNotAdminRouteFlag = false,
}) {
  if (isNotAdminRouteFlag)
    return !user.userUUID ? <Outlet /> : <Navigate to="/" replace />;
  if (user)
    return user.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
}
