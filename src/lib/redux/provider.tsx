"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { hydrateAuth } from "@/lib/redux/features/auth/authSlice";

interface ReduxProviderProps {
  children: React.ReactNode;
}

const AUTH_STORAGE_KEY = "prototype-auth";

export default function ReduxProvider({ children }: ReduxProviderProps) {
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        const parsedAuth = JSON.parse(savedAuth) as {
          username?: string;
          fullName?: string;
          email?: string;
          phoneNumber?: string;
          companyName?: string;
          isAuthenticated?: boolean;
        };
        store.dispatch(hydrateAuth(parsedAuth));
      } else {
        store.dispatch(hydrateAuth({ isAuthenticated: false }));
      }
    } catch {
      store.dispatch(hydrateAuth({ isAuthenticated: false }));
    }

    const unsubscribe = store.subscribe(() => {
      const { auth } = store.getState();
      const authToPersist = {
        username: auth.username,
        fullName: auth.fullName,
        email: auth.email,
        phoneNumber: auth.phoneNumber,
        companyName: auth.companyName,
        isAuthenticated: auth.isAuthenticated,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authToPersist));
    });

    return () => unsubscribe();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
