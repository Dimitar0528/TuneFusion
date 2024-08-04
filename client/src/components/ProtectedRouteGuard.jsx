import { Navigate } from "react-router-dom";

export default function ProtectedRouteGuard({ children, role }) {
  return role === "admin" ? children : <Navigate to="/" replace />;
}
