import React from "react";
import { Navigate } from "react-router-dom";

export default function RutaProtegida({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}
