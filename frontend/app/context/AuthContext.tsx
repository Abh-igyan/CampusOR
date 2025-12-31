"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (jwt: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("campusor_jwt");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = (jwt: string) => {
    localStorage.setItem("campusor_jwt", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("campusor_jwt");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
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
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
