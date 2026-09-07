"use client";

import React, { useState } from 'react';
import { Menu, LogOut, Globe } from 'lucide-react';
import { useAdminAuth } from './AuthGuard';
import { useToast } from './Toast';
import Tooltip from '@/components/ui/Tooltip';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
}

export default function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  const { user, logout } = useAdminAuth();
  const { info, success } = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    success('Déconnexion effectuée', 'À bientôt sur le Desk Burkina News.');
    await logout();
  };

  const isSuperadmin = user?.role === 'Superadmin';

  return (
    <>
      <header className="h-16 bg-white border-b border-[#e6dfd5] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        
        {/* Left: Hamburger (mobile) + Toggle (desktop) & breadcrumb title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile hamburger */}
          <Tooltip position="bottom" content="Ouvrir le menu de navigation">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-[#141414] hover:bg-[#faf8f5] rounded border border-[#e6dfd5] cursor-pointer shrink-0"
              aria-label="Ouvrir le menu mobile"
            >
              <Menu size={19} />
            </button>
          </Tooltip>

          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#087443] inline-block animate-pulse shrink-0" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
              Plateforme Éditoriale
            </span>
          </div>
        </div>

        {/* Right: Quick actions & User profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Public site link */}
          <Tooltip position="bottom" content="Consulter le site public dans un nouvel onglet">
            <a
              href="/fr"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#087443] hover:bg-[#faf8f5] border border-[#e6dfd5] rounded transition-colors cursor-pointer"
            >
              <Globe size={13} />
              <span>Site public (FR)</span>
            </a>
          </Tooltip>

          {/* User profile capsule */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#e6dfd5]">
            <img
              src={user?.avatar || 'https://avatars.githubusercontent.com/u/88273908?v=4'}
              alt={user?.name || 'Admin'}
              className={`w-8 h-8 rounded-full object-cover border-2 ${
                isSuperadmin ? 'border-[#c2410c] ring-1 ring-[#c2410c]/40' : 'border-[#087443]'
              }`}
            />
            <div className="hidden sm:block text-left font-mono leading-tight">
              <div className="text-xs font-bold text-[#141414]">{user?.name || 'Samba Diop'}</div>
              {isSuperadmin ? (
                <span className="inline-block px-1.5 py-0.2 bg-[#c2410c] text-white text-[9px] font-extrabold uppercase rounded tracking-wider shadow-xs">
                  ★ Superadmin
                </span>
              ) : (
                <div className="text-[10px] text-[#087443] font-medium">{user?.role || 'Directeur éditorial'}</div>
              )}
            </div>
          </div>

          {/* Logout button */}
          <Tooltip position="bottom" content="Se déconnecter de l'administration">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2 text-[#737373] hover:text-red-700 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors cursor-pointer"
              title="Se déconnecter"
              aria-label="Se déconnecter"
            >
              <LogOut size={16} />
            </button>
          </Tooltip>

        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-2 border-[#141414] max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#141414]">
              Confirmer la déconnexion
            </h3>
            <p className="text-xs font-serif text-[#555555] leading-relaxed">
              Êtes-vous certain de vouloir quitter le Desk d'administration de Burkina News ?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-3 py-1.5 border border-[#e6dfd5] text-xs font-mono text-[#141414] hover:bg-[#faf8f5]"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-mono font-bold uppercase tracking-wider"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
