"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/components/admin/AuthGuard';
import { useToast } from '@/components/admin/Toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('diop@burkinanews.bf');
  const [password, setPassword] = useState('faso2026');
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
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPass })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Identifiants incorrects');
      }

      success(`Connexion réussie`, `Bienvenue sur le Desk, ${data.user.name}.`);
      login(data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de la connexion.');
      error('Échec de connexion', err.message);
      setIsSubmitting(false);
    }
  };

  const fillAndSubmit = (quickEmail: string) => {
    setEmail(quickEmail);
    setPassword('faso2026');
    handleLogin(undefined, quickEmail, 'faso2026');
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
            Réservé aux membres de la rédaction et du comité éditorial.
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
                  placeholder="nom@burkinanews.bf"
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

        {/* Quick Demo Access Buttons */}
        <div className="pt-4 border-t border-[#e6dfd5] space-y-2">
          <div className="text-[10px] font-mono uppercase text-[#737373] text-center font-semibold">
            Accès Rapide Démo Rédaction :
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">

            <button
              type="button"
              onClick={() => fillAndSubmit('diop@burkinanews.bf')}
              className="p-2 bg-[#faf8f5] hover:bg-[#f4eee3] border border-[#e6dfd5] text-center rounded text-[11px] font-mono transition-colors"
            >
              <span className="font-bold text-[#141414] block">Samba Diop</span>
              <span className="text-[9px] font-bold text-[#c2410c] uppercase">Superadmin</span>
            </button>
          </div>
        </div>

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
