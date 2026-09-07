"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Shield, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  UserX, 
  UserCheck, 
  Key, 
  Mail, 
  Briefcase, 
  Clock, 
  Info,
  Lock,
  Sparkles
} from 'lucide-react';
import { AdminUser, AdminRole } from '@/data/admin-store';
import { useToast } from '@/components/admin/Toast';
import { SkeletonTable } from '@/components/admin/Skeleton';
import Tooltip from '@/components/ui/Tooltip';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminUsersPage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);

  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState<AdminUser | null>(null);
  const [showRoleGuide, setShowRoleGuide] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<AdminRole>('Rédacteur / Enquêteur');
  const [formTitle, setFormTitle] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formPassword, setFormPassword] = useState('faso2026');
  const [formStatus, setFormStatus] = useState<'active' | 'suspended'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load users from API
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Impossible de charger la liste des utilisateurs.');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err: any) {
      error('Erreur', err.message);
    } finally {
      setTimeout(() => setLoading(false), 250);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormRole('Rédacteur / Enquêteur');
    setFormTitle('');
    setFormAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80');
    setFormPassword('faso2026');
    setFormStatus('active');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormTitle(user.title || '');
    setFormAvatar(user.avatar || '');
    setFormPassword(user.password || 'faso2026');
    setFormStatus(user.status);
    setIsModalOpen(true);
  };

  // Submit User Create or Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      warning('Champs requis', 'Veuillez renseigner au minimum le nom et l\'adresse email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isEdit = !!editingUser;
      const action = isEdit ? 'update_user' : 'create_user';
      const payload = isEdit
        ? {
            id: editingUser.id,
            name: formName.trim(),
            email: formEmail.trim().toLowerCase(),
            role: formRole,
            title: formTitle.trim(),
            avatar: formAvatar,
            password: formPassword.trim(),
            status: formStatus
          }
        : {
            name: formName.trim(),
            email: formEmail.trim().toLowerCase(),
            role: formRole,
            title: formTitle.trim(),
            avatar: formAvatar,
            password: formPassword.trim(),
            status: formStatus
          };

      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur lors de l\'enregistrement.');

      success(
        isEdit ? 'Profil mis à jour' : 'Compte créé avec succès',
        result.message || `Le compte de ${formName} est opérationnel.`
      );

      setIsModalOpen(false);
      loadUsers();
    } catch (err: any) {
      error('Erreur', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle User Status (Active / Suspended)
  const handleToggleStatus = async (user: AdminUser) => {
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_user_status',
          payload: { id: user.id }
        })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur lors du changement de statut.');

      if (result.user && result.user.status === 'active') {
        success('Compte réactivé', `L'accès pour ${user.name} a été rétabli.`);
      } else {
        warning('Compte suspendu', `L'accès pour ${user.name} a été verrouillé.`);
      }

      loadUsers();
    } catch (err: any) {
      error('Action impossible', err.message);
    }
  };

  // Delete User
  const handleDelete = async (user: AdminUser) => {
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_user',
          payload: { id: user.id }
        })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur de suppression.');

      success('Compte supprimé', `Le compte de ${user.name} a été retiré.`);
      setIsDeletingUser(null);
      loadUsers();
    } catch (err: any) {
      error('Suppression impossible', err.message);
    }
  };

  // Helper to render role badge
  const renderRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'Superadmin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#c2410c] text-white text-[10px] font-mono font-bold uppercase rounded tracking-wider shadow-xs">
            <ShieldCheck size={11} />
            <span>★ Superadmin</span>
          </span>
        );
      case 'Directeur éditorial':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#087443] text-white text-[10px] font-mono font-bold uppercase rounded tracking-wider">
            <Shield size={11} />
            <span>Directeur éditorial</span>
          </span>
        );
      case 'Rédacteur / Enquêteur':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#1e3a8a] text-white text-[10px] font-mono font-bold uppercase rounded tracking-wider">
            <Briefcase size={11} />
            <span>Enquêteur</span>
          </span>
        );
      case 'Desk Données & Tracker':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#d97706] text-white text-[10px] font-mono font-bold uppercase rounded tracking-wider">
            <Sparkles size={11} />
            <span>Desk Tracker</span>
          </span>
        );
      case 'Desk IA & Veille':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#7c3aed] text-white text-[10px] font-mono font-bold uppercase rounded tracking-wider">
            <Sparkles size={11} />
            <span>Desk IA</span>
          </span>
        );
      case 'Auditeur Déontologique':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#475569] text-white text-[10px] font-mono font-bold uppercase rounded tracking-wider">
            <Info size={11} />
            <span>Auditeur</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-200 text-neutral-800 text-[10px] font-mono font-bold uppercase rounded">
            <span>{role}</span>
          </span>
        );
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.title && u.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;
  const superadminCount = users.filter(u => u.role === 'Superadmin').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#087443] font-bold uppercase tracking-wider">
            <ShieldCheck size={16} />
            <span>Gestion des Accès & Sécurité Éditoriale</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Équipe & Comptes du Desk
          </h1>
          <p className="text-sm font-mono text-[#5a554e] mt-0.5">
            Administration des permissions, des rôles déontologiques et des comptes autorisés.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip position="bottom" content="Consulter le guide des permissions et des rôles">
            <button
              type="button"
              onClick={() => setShowRoleGuide(!showRoleGuide)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e6dfd5] text-xs font-mono font-bold text-[#141414] hover:bg-[#faf8f5] rounded transition-colors cursor-pointer"
            >
              <Info size={14} className="text-[#087443]" />
              <span>Guide des Rôles</span>
            </button>
          </Tooltip>

          <Tooltip position="bottom" content="Créer un nouveau compte utilisateur">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#087443] hover:bg-[#0a5c36] text-white text-xs font-mono font-bold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs"
            >
              <UserPlus size={15} />
              <span>Nouvel Utilisateur</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Role Guide Collapsible Panel */}
      {showRoleGuide && (
        <div className="bg-[#f4eee3] border border-[#e6dfd5] p-5 rounded-lg space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-2">
            <h3 className="font-serif font-bold text-sm text-[#141414] flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#087443]" />
              <span>Matrice Déontologique des Rôles sur Burkina News</span>
            </h3>
            <button
              onClick={() => setShowRoleGuide(false)}
              className="text-[#736c62] hover:text-[#141414] cursor-pointer"
              aria-label="Fermer le guide"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-serif text-[#333333]">
            <div className="bg-white p-3 rounded border border-[#e6dfd5] space-y-1">
              <div className="font-mono font-bold text-[11px] text-[#c2410c] uppercase flex items-center gap-1">
                <ShieldCheck size={12} />
                <span>★ Superadmin</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#555]">
                Accès sans restriction. Création, modification et suspension des comptes. Validation des corrections publiques et supervision de la sécurité.
              </p>
            </div>

            <div className="bg-white p-3 rounded border border-[#e6dfd5] space-y-1">
              <div className="font-mono font-bold text-[11px] text-[#087443] uppercase flex items-center gap-1">
                <Shield size={12} />
                <span>Directeur Éditorial</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#555]">
                Validation finale des enquêtes et de la vitrine (Slot 1 & Analyses). Publication des Numéros mensuels et engagement de la signature de la rédaction.
              </p>
            </div>

            <div className="bg-white p-3 rounded border border-[#e6dfd5] space-y-1">
              <div className="font-mono font-bold text-[11px] text-[#1e3a8a] uppercase flex items-center gap-1">
                <Briefcase size={12} />
                <span>Rédacteur / Enquêteur</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#555]">
                Rédaction, téléversement de preuves et documentation des sources primaires. Proposition de nouveaux faits pour Le Fil hebdomadaire.
              </p>
            </div>

            <div className="bg-white p-3 rounded border border-[#e6dfd5] space-y-1">
              <div className="font-mono font-bold text-[11px] text-[#d97706] uppercase flex items-center gap-1">
                <Sparkles size={12} />
                <span>Desk Données & Tracker</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#555]">
                Suivi des 6 jalons des chantiers nationaux (PND 2026-2030) et actualisation des 20 métriques stratégiques du Baromètre RELANCE.
              </p>
            </div>

            <div className="bg-white p-3 rounded border border-[#e6dfd5] space-y-1">
              <div className="font-mono font-bold text-[11px] text-[#7c3aed] uppercase flex items-center gap-1">
                <Sparkles size={12} />
                <span>Desk IA & Veille</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#555]">
                Veille continue des arrêtés et conseils des ministres. Synthèse des rapports volumineux et préparation des brouillons de dépêches.
              </p>
            </div>

            <div className="bg-white p-3 rounded border border-[#e6dfd5] space-y-1">
              <div className="font-mono font-bold text-[11px] text-[#475569] uppercase flex items-center gap-1">
                <Info size={12} />
                <span>Auditeur Déontologique</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#555]">
                Audit indépendant en lecture seule. Vérification croisée des sources, examen des signalements lecteurs et traçabilité des rectifications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-[#e6dfd5] p-4 rounded-lg shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#736c62] text-xs font-mono">
            <span>Comptes Rédaction</span>
            <Users size={15} />
          </div>
          <div className="text-2xl font-serif font-bold text-[#141414]">
            {loading ? '-' : totalUsers}
          </div>
          <div className="text-[10px] font-mono text-[#087443] font-semibold">
            {superadminCount} Superadmin(s)
          </div>
        </div>

        <div className="bg-white border border-[#e6dfd5] p-4 rounded-lg shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#736c62] text-xs font-mono">
            <span>Accès Actifs</span>
            <UserCheck size={15} className="text-[#087443]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#087443]">
            {loading ? '-' : activeUsers}
          </div>
          <div className="text-[10px] font-mono text-[#736c62]">
            Opérationnels sur le Desk
          </div>
        </div>

        <div className="bg-white border border-[#e6dfd5] p-4 rounded-lg shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#736c62] text-xs font-mono">
            <span>Accès Suspendus</span>
            <UserX size={15} className="text-[#c2410c]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#c2410c]">
            {loading ? '-' : suspendedUsers}
          </div>
          <div className="text-[10px] font-mono text-[#736c62]">
            Verrouillés temporairement
          </div>
        </div>

        <div className="bg-white border border-[#e6dfd5] p-4 rounded-lg shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#736c62] text-xs font-mono">
            <span>Sécurité Session</span>
            <Lock size={15} className="text-[#087443]" />
          </div>
          <div className="text-base font-serif font-bold text-[#141414] pt-1 truncate">
            Cookie HTTP-Lax
          </div>
          <div className="text-[10px] font-mono text-[#087443] font-semibold">
            Expiration 7 jours
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e6dfd5] p-3 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-2.5 text-[#736c62]" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou fonction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
          />
          {searchTerm && (
            <Tooltip position="left" content="Effacer la recherche">
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-[#736c62] hover:text-[#141414] cursor-pointer"
              >
                <X size={14} />
              </button>
            </Tooltip>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded bg-white focus:outline-none focus:border-[#087443] cursor-pointer"
          >
            <option value="all">Tous les rôles</option>
            <option value="Superadmin">★ Superadmin</option>
            <option value="Directeur éditorial">Directeur éditorial</option>
            <option value="Rédacteur / Enquêteur">Rédacteur / Enquêteur</option>
            <option value="Desk Données & Tracker">Desk Tracker</option>
            <option value="Desk IA & Veille">Desk IA</option>
            <option value="Auditeur Déontologique">Auditeur</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded bg-white focus:outline-none focus:border-[#087443] cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="suspended">Suspendus</option>
          </select>
        </div>
      </div>

      {/* Users Table / Grid */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white border border-[#e6dfd5] p-12 text-center rounded-lg space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#f4eee3] flex items-center justify-center mx-auto text-[#087443]">
            <Users size={24} />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#141414]">
            Aucun utilisateur trouvé
          </h3>
          <p className="text-xs font-mono text-[#736c62] max-w-sm mx-auto">
            Aucun compte ne correspond aux filtres appliqués. Essayez d'élargir votre recherche.
          </p>
          {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="inline-flex items-center gap-1 text-xs font-mono text-[#087443] hover:underline font-bold cursor-pointer"
            >
              <span>Réinitialiser les filtres</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-[#e6dfd5] rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#faf8f5] border-b border-[#e6dfd5] text-[10px] font-mono uppercase text-[#736c62] tracking-wider">
                  <th className="py-3 px-4">Membre du Desk</th>
                  <th className="py-3 px-4">Rôle & Permissions</th>
                  <th className="py-3 px-4 hidden md:table-cell">Fonction & Titre</th>
                  <th className="py-3 px-4 text-center">Statut</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Dernière Connexion</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd5] font-mono">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                    
                    {/* User Identity (Avatar + Name + Email) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#e6dfd5] shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-[#141414] truncate flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.role === 'Superadmin' && (
                              <span className="text-[9px] text-[#c2410c] font-bold">★</span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#736c62] truncate flex items-center gap-1">
                            <Mail size={11} />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3 px-4">
                      {renderRoleBadge(user.role)}
                    </td>

                    {/* Editorial Title */}
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-[11px] text-[#444] font-serif">
                        {user.title || 'Membre de la rédaction'}
                      </span>
                    </td>

                    {/* Status Pill with 1-click toggle */}
                    <td className="py-3 px-4 text-center">
                      <Tooltip
                        position="top"
                        content={user.status === 'active' ? 'Cliquer pour suspendre l\'accès' : 'Cliquer pour réactiver l\'accès'}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                            user.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                          <span>{user.status === 'active' ? 'Actif' : 'Suspendu'}</span>
                        </button>
                      </Tooltip>
                    </td>

                    {/* Last Login */}
                    <td className="py-3 px-4 text-[11px] text-[#736c62] hidden lg:table-cell">
                      {user.lastLogin ? (
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-[#087443]" />
                          <span>{new Date(user.lastLogin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">Jamais connecté</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Tooltip position="top" content="Modifier le profil & rôle">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 text-[#555] hover:text-[#087443] hover:bg-[#faf8f5] rounded border border-[#e6dfd5] transition-colors cursor-pointer"
                            aria-label={`Modifier ${user.name}`}
                          >
                            <Edit3 size={14} />
                          </button>
                        </Tooltip>

                        <Tooltip position="top" content="Supprimer définitivement ce compte">
                          <button
                            type="button"
                            onClick={() => setIsDeletingUser(user)}
                            disabled={user.role === 'Superadmin' && users.filter(u => u.role === 'Superadmin').length <= 1}
                            className="p-1.5 text-[#555] hover:text-[#d32f2f] hover:bg-rose-50 rounded border border-[#e6dfd5] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label={`Supprimer ${user.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-2 border-[#141414] max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#087443]/10 text-[#087443] rounded">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#141414]">
                  {editingUser ? 'Modifier le Compte Desk' : 'Créer un Nouvel Utilisateur'}
                </h3>
              </div>
              <Tooltip position="left" content="Fermer la fenêtre">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#737373] hover:text-[#141414] p-1 cursor-pointer"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
              </Tooltip>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                    Nom complet <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="ex: Aminata Traoré"
                    className="w-full px-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                    Email professionnel <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="nom@burkinanews.bf"
                    className="w-full px-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                  />
                </div>
              </div>

              {/* Title / Function */}
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                  Fonction / Titre rédactionnel
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="ex: Reporter Énergie & Chantiers Nationaux"
                  className="w-full px-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                  Rôle Déontologique & Droits d'Accès <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443] font-bold cursor-pointer"
                >
                  <option value="Superadmin">★ Superadmin — Accès total & sécurité (Samba Diop)</option>
                  <option value="Directeur éditorial">Directeur éditorial — Validation, Une, Numéros (Alfred Ouédraogo)</option>
                  <option value="Rédacteur / Enquêteur">Rédacteur / Enquêteur — Articles d'enquêtes & faits du Fil</option>
                  <option value="Desk Données & Tracker">Desk Données & Tracker — Chantiers PND & Baromètre RELANCE</option>
                  <option value="Desk IA & Veille">Desk IA & Veille — Synthèses & veille automatisée</option>
                  <option value="Auditeur Déontologique">Auditeur Déontologique — Contrôle qualité (Lecture seule)</option>
                </select>
                <p className="text-[10px] font-mono text-[#736c62] mt-1">
                  Chaque rôle délimite les actions de publication, modification et suppression autorisées.
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                  Mot de passe de session
                </label>
                <div className="relative">
                  <Key size={14} className="absolute left-3 top-2.5 text-[#736c62]" />
                  <input
                    type="text"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="faso2026"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                  />
                </div>
                <p className="text-[10px] font-mono text-[#736c62] mt-1">
                  Mot de passe par défaut : <code className="bg-[#f4eee3] px-1 py-0.5 rounded">faso2026</code> ou <code className="bg-[#f4eee3] px-1 py-0.5 rounded">admin</code>.
                </p>
              </div>

              {/* Avatar Uploader (Local Computer or URL) */}
              <div>
                <ImageUploader
                  label="Photo de profil / Avatar"
                  value={formAvatar}
                  onChange={setFormAvatar}
                  helperText="Importez un fichier local depuis votre ordinateur (PNG, JPG, WebP) ou collez une URL."
                />
              </div>

              {/* Account Status Switch */}
              <div className="flex items-center justify-between p-3 bg-[#faf8f5] border border-[#e6dfd5] rounded">
                <div>
                  <div className="text-xs font-mono font-bold text-[#141414]">Statut du compte</div>
                  <div className="text-[10px] font-mono text-[#736c62]">
                    Un compte suspendu ne peut plus se connecter au back-office.
                  </div>
                </div>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'active' | 'suspended')}
                  className="px-2.5 py-1 text-xs font-mono font-bold border border-[#e6dfd5] rounded bg-white cursor-pointer"
                >
                  <option value="active">Actif (Autorisé)</option>
                  <option value="suspended">Suspendu (Bloqué)</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[#e6dfd5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#e6dfd5] text-xs font-mono font-bold text-[#141414] hover:bg-[#faf8f5] rounded cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#087443] hover:bg-[#0a5c36] text-white text-xs font-mono font-bold uppercase tracking-wider rounded transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Enregistrement...' : editingUser ? 'Mettre à jour' : 'Créer le compte'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-2 border-rose-700 max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-serif font-bold text-lg">
              <AlertCircle size={20} />
              <span>Confirmer la suppression</span>
            </div>
            <p className="text-xs font-serif text-[#444] leading-relaxed">
              Êtes-vous certain de vouloir supprimer définitivement le compte de <strong>{isDeletingUser.name}</strong> ({isDeletingUser.email}) ?
            </p>
            <p className="text-[11px] font-mono text-[#c2410c] bg-rose-50 p-2 rounded border border-rose-200">
              Cette action est irréversible. Toutes les sessions actives associées seront closes.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeletingUser(null)}
                className="px-3 py-1.5 border border-[#e6dfd5] text-xs font-mono text-[#141414] hover:bg-[#faf8f5] rounded cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(isDeletingUser)}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-mono font-bold uppercase tracking-wider rounded cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
