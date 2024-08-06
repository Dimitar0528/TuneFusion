import { Navigate } from "react-router-dom";

export default function ProtectedRouteGuard({
  children,
  user,
  isNotAdminRoute = false,
}) {
  if (isNotAdminRoute)
    return !user.userUUID ? children : <Navigate to="/" replace />;
  if (user)
    return user.role === "admin" ? children : <Navigate to="/" replace />;
}
