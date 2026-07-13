// src/hooks/useAuthCheck.ts
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../store/auth";

// Zustand's isAuthenticated resets to false on every page load, since
// there's no persistence. This hook asks the server "is my cookie still
// valid?" once on mount, and repopulates the store if so. Until that
// check resolves, `isChecking` stays true so route guards can show a
// loading state instead of prematurely redirecting to /login.
export function useAuthCheck() {
  const [isChecking, setIsChecking] = useState(true);
  const login = useAuth((state) => state.login);
  const logout = useAuth((state) => state.logout);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await api.get("/me");

        if (!cancelled) {
          login(res.data.user);
        }
      } catch {
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [login, logout]);

  return { isChecking };
}

