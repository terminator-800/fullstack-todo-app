// src/components/RoleRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const user = useAuth((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}