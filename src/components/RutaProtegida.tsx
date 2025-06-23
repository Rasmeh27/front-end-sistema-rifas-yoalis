import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function RutaProtegida({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}
