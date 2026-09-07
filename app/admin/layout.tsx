"use client";

import React, { useState, useEffect } from 'react';
import { ToastProvider } from '@/components/admin/Toast';
import { AuthGuard } from '@/components/admin/AuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import MicumSidePanel from '@/components/admin/MicumSidePanel';
import { usePathname } from 'next/navigation';

import { MicumProvider } from '@/components/admin/MicumContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Load saved sidebar state from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bn_admin_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('bn_admin_sidebar_collapsed', String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // If on login page, don't show the dashboard shell
  const isLoginPage = pathname === '/admin/login';

  return (
    <ToastProvider>
      <AuthGuard>
        <MicumProvider>
          {isLoginPage ? (
            children
          ) : (
            <div className="min-h-screen bg-[#faf8f5] flex relative">
              {/* Fixed & Togglable Sidebar */}
              <AdminSidebar 
                mobileOpen={mobileMenuOpen} 
                onCloseMobile={() => setMobileMenuOpen(false)}
                isCollapsed={isCollapsed}
                onToggleCollapse={handleToggleCollapse}
              />

              {/* Main Content Pane with dynamic left padding for fixed sidebar */}
              <div 
                className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${
                  isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
                }`}
              >
                <AdminHeader 
                  onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
                />
                
                <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                  {children}
                </main>
              </div>

              {/* Universal Floating Micum Assistant (Always on FAB) */}
              <MicumSidePanel />
            </div>
          )}
        </MicumProvider>
      </AuthGuard>
    </ToastProvider>
  );
}
