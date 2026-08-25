"use client";

import { useCallback, useEffect, useState } from "react";

export function useAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/verify")
      .then((res) => res.json())
      .then((data: { authenticated?: boolean }) => {
        if (active) setIsAuthenticated(Boolean(data?.authenticated));
      })
      .catch(() => {
        if (active) setIsAuthenticated(false);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }, []);

  return { isLoading, isAuthenticated, logout };
}
