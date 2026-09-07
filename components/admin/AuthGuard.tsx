"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SkeletonForm } from './Skeleton';

export interface AdminUserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  loggedInAt: string;
}

interface AuthContextValue {
  user: AdminUserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: AdminUserSession) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthGuard({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Check authentication from session API or cookie
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            if (isLoginPage) {
              router.push('/admin');
            }
          } else {
            setUser(null);
            if (!isLoginPage) {
              router.push('/admin/login');
            }
          }
        } else {
          setUser(null);
          if (!isLoginPage) {
            router.push('/admin/login');
          }
        }
      } catch (e) {
        setUser(null);
        if (!isLoginPage) {
          router.push('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const login = (userData: AdminUserSession) => {
    setUser(userData);
    router.push('/admin');
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-[#e6dfd5] p-8 shadow-sm">
          <div className="mb-6 flex justify-center">
            <div className="h-10 w-44 bg-neutral-200 rounded animate-pulse" />
          </div>
          <SkeletonForm />
        </div>
      </div>
    );
  }

  // If on login page, render login page
  if (isLoginPage) {
    return (
      <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // If not authenticated and not on login page, don't flash content
  if (!user) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: true, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AuthGuard');
  }
  return context;
}
