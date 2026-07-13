// src/components/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/my-todo" replace />;
  }

  return <>{children}</>;
}