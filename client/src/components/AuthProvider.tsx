// src/components/AuthProvider.tsx
import { useAuthCheck } from "../hooks/useAuthCheck";

interface AuthProviderProps {
  children: React.ReactNode;
}

// Runs the /me session check exactly once, at the top of the app.
// ProtectedRoute and PublicRoute both read the already-resolved
// isAuthenticated/isChecking state from Zustand instead of each
// firing their own request.
export default function AuthProvider({ children }: AuthProviderProps) {
  const { isChecking } = useAuthCheck();

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}