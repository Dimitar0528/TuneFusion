import { Navigate } from "react-router-dom";

export default function ProtectedRouteHandler({ children, role }) {
  return role === "admin" ? children : <Navigate to="/" replace />;
}
