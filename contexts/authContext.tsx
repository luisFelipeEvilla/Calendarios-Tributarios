"use client";

import { parseCookies, setCookie, destroyCookie } from "nookies";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  rol: {
    id: number;
    nombre: string;
  };
  cliente?: {
    id: number;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const COOKIE_OPTIONS = {
  maxAge: 30 * 24 * 60 * 60, // 30 días
  path: "/",
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoginPage = () => {
    if (typeof window === "undefined") return false;
    return window.location.pathname.includes("/login");
  };

  const redirectToLogin = useCallback(() => {
    if (!isLoginPage()) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const cookies = parseCookies();

    if (!cookies.user || !cookies.token) {
      setIsLoading(false);
      redirectToLogin();
      return;
    }

    try {
      const userData: User = JSON.parse(cookies.user);
      setUser(userData);
      setToken(cookies.token);
    } catch {
      redirectToLogin();
    } finally {
      setIsLoading(false);
    }
  }, [redirectToLogin]);

  const login = useCallback((userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);

    setCookie(null, "token", userToken, COOKIE_OPTIONS);
    setCookie(null, "user", JSON.stringify(userData), COOKIE_OPTIONS);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);

    destroyCookie(null, "token", { path: "/" });
    destroyCookie(null, "user", { path: "/" });

    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
