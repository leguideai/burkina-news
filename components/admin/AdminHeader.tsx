"use client";

import React, { useState } from 'react';
import { Menu, LogOut, Globe, Edit3, X, Key, Mail, ShieldCheck, Loader2, User } from 'lucide-react';
import { useAdminAuth } from './AuthGuard';
import { useToast } from './Toast';
import Tooltip from '@/components/ui/Tooltip';
import ImageUploader from './ImageUploader';
import { authApi } from '@/lib/api/auth';
import { ApiClientError } from '@/lib/api/client';
import { normalizeRoleCode, getRoleLabel } from '@/lib/api/types';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
}

export default function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  const { user, logout, updateUserSession } = useAdminAuth();
  const { info, success, error } = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Profile Edit State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState('');

  const handleOpenProfile = () => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setTitle(user.title || '');
      setAvatar(user.avatar || '');
      setPassword('');
      setProfileError('');
      setShowProfileModal(true);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setProfileError('Le nom et l\'adresse email sont requis.');
      return;
    }

    setIsSaving(true);
    setProfileError('');

    try {
      const payload: any = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        title: title.trim(),
        avatar: avatar.trim(),
      };
      if (password.trim()) {
        payload.password = password.trim();
      }

      const updated = await authApi.updateMe(payload);

      // Met à jour la session dans AuthGuard immédiatement
      updateUserSession({
        name: updated.name,
        email: updated.email,
        title: updated.title,
        avatar: updated.avatar,
      });

      success('Profil mis à jour', 'Vos informations ont été enregistrées avec succès.');
      setShowProfileModal(false);
    } catch (err: any) {
      const msg =
        err instanceof ApiClientError
          ? err.getLocalizedMessage('fr')
          : err.message || 'Erreur lors de la mise à jour du profil.';
      setProfileError(msg);
      error('Erreur', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    success('Déconnexion effectuée', 'À bientôt sur le Desk Burkina News.');
    await logout();
  };

  const isSuperadmin = normalizeRoleCode(user?.role || '') === 'superadmin';

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

          {/* User profile capsule (Clickable to edit own profile) */}
          <Tooltip position="bottom" content="Mon Profil : Cliquez pour modifier vos informations">
            <button
              type="button"
              onClick={handleOpenProfile}
              className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#e6dfd5] hover:bg-[#faf8f5] p-1.5 rounded transition-colors cursor-pointer text-left group"
            >
              <div className="relative">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'}
                  alt={user?.name || 'Admin'}
                  className={`w-8 h-8 rounded-full object-cover border-2 ${
                    isSuperadmin ? 'border-[#c2410c] ring-1 ring-[#c2410c]/40' : 'border-[#087443]'
                  }`}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80';
                  }}
                />
                <span className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full border border-[#e6dfd5] text-[#555] group-hover:text-[#087443]">
                  <Edit3 size={10} />
                </span>
              </div>
              <div className="hidden sm:block text-left font-mono leading-tight">
                <div className="text-xs font-bold text-[#141414] group-hover:text-[#087443] transition-colors">
                  {user?.name || 'Samba'}
                </div>
                {isSuperadmin ? (
                  <span className="inline-block px-1.5 py-0.2 bg-[#c2410c] text-white text-[9px] font-extrabold uppercase rounded tracking-wider shadow-xs">
                    ★ Superadmin
                  </span>
                ) : (
                  <div className="text-[10px] text-[#087443] font-medium">
                    {getRoleLabel(user?.role || '', 'fr')}
                  </div>
                )}
              </div>
            </button>
          </Tooltip>

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

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-2 border-[#141414] max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#087443]/10 text-[#087443] rounded">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#141414]">
                    Mon Profil Rédactionnel
                  </h3>
                  <div className="text-[10px] font-mono text-[#666]">
                    {isSuperadmin ? '★ Compte Superadministrateur' : getRoleLabel(user?.role || '', 'fr')}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="text-[#737373] hover:text-[#141414] p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {profileError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs font-mono text-rose-700">
                {profileError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                  Adresse email *
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-2.5 text-[#736c62]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                  Fonction / Titre
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Superadministrateur & Fondateur"
                  className="w-full px-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                />
              </div>

              <div>
                <ImageUploader
                  label="Photo de profil (Avatar)"
                  value={avatar}
                  onChange={setAvatar}
                  folder="avatars"
                  helperText="Importez une photo depuis votre appareil ou collez une URL."
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                  Nouveau mot de passe (laisser vide pour conserver l'actuel)
                </label>
                <div className="relative">
                  <Key size={14} className="absolute left-3 top-2.5 text-[#736c62]" />
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••• (min 8 caractères)"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e6dfd5]">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 border border-[#e6dfd5] text-xs font-mono font-bold text-[#141414] hover:bg-[#faf8f5] rounded cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#087443] hover:bg-[#0a5c36] text-white text-xs font-mono font-bold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>Enregistrer</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-2 border-[#141414] max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#141414]">Confirmer la déconnexion</h3>
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
