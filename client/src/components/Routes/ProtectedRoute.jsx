import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  return role === "admin" ? children : <Navigate to="/" replace />;
};

