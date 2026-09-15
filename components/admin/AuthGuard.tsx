"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SkeletonForm } from './Skeleton';
import { authApi } from '@/lib/api/auth';
import { AdminUserDTO, getRoleLabel } from '@/lib/api/types';

export interface AdminUserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  title?: string;
  status?: string;
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
    // Vérification de la session auprès du Backend Go
    const checkAuth = async () => {
      try {
        const currentUser = await authApi.getMe();
        if (currentUser) {
          const session: AdminUserSession = {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            title: currentUser.title,
            status: currentUser.status,
            loggedInAt: currentUser.last_login_at || new Date().toISOString(),
          };
          setUser(session);
          if (isLoginPage) {
            router.push('/admin');
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
      await authApi.logout();
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
