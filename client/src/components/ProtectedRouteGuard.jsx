import { Navigate } from "react-router-dom";

export default function ProtectedRouteGuard({ children, user }) {
  return user.role === "admin" ? children : <Navigate to="/" replace />;
}
