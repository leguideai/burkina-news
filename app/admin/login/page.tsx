"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAdminAuth } from '@/components/admin/AuthGuard';
import { useToast } from '@/components/admin/Toast';
import { authApi } from '@/lib/api/auth';
import { ApiClientError } from '@/lib/api/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('samba@leguideai.com');
  const [password, setPassword] = useState('BurkinaAdmin2026!');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAdminAuth();
  const { success, error } = useToast();
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const targetEmail = customEmail || email;
    const targetPass = customPass || password;

    try {
      const authData = await authApi.login(targetEmail, targetPass);

      success('Connexion réussie', `Bienvenue sur le Desk, ${authData.user.name}.`);
      login({
        id: authData.user.id,
        name: authData.user.name,
        email: authData.user.email,
        role: authData.user.role,
        avatar: authData.user.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        title: authData.user.title,
        status: authData.user.status,
        loggedInAt: new Date().toISOString(),
      });
    } catch (err: any) {
      const msg =
        err instanceof ApiClientError
          ? err.getLocalizedMessage('fr')
          : err.message || 'Erreur lors de la connexion au serveur.';
      setErrorMessage(msg);
      error('Échec de connexion', msg);
      setIsSubmitting(false);
    }
  };

  const fillAndSubmit = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    handleLogin(undefined, quickEmail, quickPass);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Brand Card */}
      <div className="w-full max-w-md bg-white border-2 border-[#141414] shadow-xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 pb-6 border-b border-[#e6dfd5]">
          <div className="inline-block p-2 bg-[#faf8f5] border border-[#e6dfd5] rounded mb-1">
            <img src="/images/logo.png" alt="Burkina News" className="h-9 w-auto object-contain mx-auto" />
          </div>
          <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#0b4627]">
            <ShieldCheck size={14} />
            <span>Desk Rédactionnel & Données</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#141414]">
            Espace d'Administration
          </h1>
          <p className="text-xs font-serif text-[#666666]">
            Connecté à l'API officielle Golang & PostgreSQL 16.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-300 p-3 text-xs font-serif text-red-800 rounded">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-mono uppercase text-[10px] text-[#555555] font-bold mb-1">
              Adresse Email Rédactionnelle
            </label>
            <div className="relative">
              <input
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@leguideai.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-xs font-mono text-[#141414] focus:outline-none focus:border-[#0b4627] disabled:opacity-60"
              />
              <Mail size={15} className="absolute left-3 top-3 text-[#777777]" />
            </div>
          </div>

          <div>
            <label className="block font-mono uppercase text-[10px] text-[#555555] font-bold mb-1">
              Mot de Passe Sécurisé
            </label>
            <div className="relative">
              <input
                type="password"
                required
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-xs font-mono text-[#141414] focus:outline-none focus:border-[#0b4627] disabled:opacity-60"
              />
              <Lock size={15} className="absolute left-3 top-3 text-[#777777]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin text-[#ffd8a8]" />
                <span>Vérification des accès en cours...</span>
              </>
            ) : (
              <>
                <span>Accéder au Dashboard</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Quick Access Buttons */}
        {/* <div className="pt-4 border-t border-[#e6dfd5] space-y-2">
          <div className="text-[10px] font-mono uppercase text-[#737373] text-center font-semibold flex items-center justify-center gap-1">
            <Sparkles size={11} className="text-[#0b4627]" />
            <span>Accès Rapide Superadmin Go :</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => fillAndSubmit('samba@leguideai.com', 'BurkinaAdmin2026!')}
              className="p-2.5 bg-[#faf8f5] hover:bg-[#f4eee3] border border-[#e6dfd5] text-center rounded text-[11px] font-mono transition-colors"
            >
              <div className="font-bold text-[#141414] flex items-center justify-center gap-2">
                <span>Samba (Fondateur)</span>
                <span className="text-[9px] font-bold text-[#b91c1c] uppercase bg-red-100 px-1.5 py-0.5 rounded">
                  Superadmin
                </span>
              </div>
              <span className="text-[10px] text-[#666666] block mt-0.5">samba@leguideai.com</span>
            </button>
          </div>
        </div> */}
      </div>

      {/* Back to public site link */}
      <div className="mt-6 text-center">
        <a href="/fr" className="text-xs font-mono text-[#0b4627] hover:underline">
          ← Retourner au site public Burkina News
        </a>
      </div>
    </div>
  );
}
