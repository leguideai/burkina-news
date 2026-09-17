"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import { SkeletonTable } from '@/components/admin/Skeleton';
import Tooltip from '@/components/ui/Tooltip';
import ImageUploader from '@/components/admin/ImageUploader';
import { useAdminAuth } from '@/components/admin/AuthGuard';
import { 
  usersApi, 
  AdminUserDTO, 
  BackendAdminRole, 
  OFFICIAL_ROLES, 
  normalizeRoleCode, 
  getRoleLabel,
  DEFAULT_ROLE_TITLES,
  getDefaultTitleForRole,
  ApiClientError,
  PaginationMeta
} from '@/lib/api';

// Mots courts (4 à 6 lettres), familiers et sans accents (ASCII pur), faciles à mémoriser pour un humain.
const SHORT_MEMORABLE_WORDS = [
  // 5 lettres -> + 2 chiffres + 1 symbole = 8 caractères (ex: Sahel48!, Volta62#)
  "Sahel", "Volta", "Oasis", "Aigle", "Zebre", "Rubis", "Cacao", "Coton",
  "Pacte", "Union", "Plume", "Noble", "Vigie", "Silex", "Eclat", "Forge",
  // 4 lettres -> + 3 chiffres + 1 symbole = 8 caractères (ex: Faso724!, Lion482#)
  "Faso", "Lion", "Dune", "Oryx", "Echo",
  // 6 lettres -> + 2 chiffres + 1 symbole = 9 caractères (ex: Baobab39!, Soleil75!)
  "Baobab", "Savane", "Aurore", "Etoile", "Soleil", "Zenith", "Karite",
  "Faucon", "Mangue", "Saphir", "Source", "Racine", "Rameau", "Mirage",
  "Desert", "Cactus", "Argile", "Espoir", "Fierte", "Verite", "Audace",
  "Clarte", "Devoir", "Regard", "Vision", "Impact", "Presse", "Avenir",
  "Relais", "Repere", "Signal", "Viaduc", "Reseau",
];

const MEMORABLE_SYMBOLS = ["!", "#", "@", "$", "*"];

// Générateur de mot de passe mémorisable court (8 à 9 caractères) : 1 mot familier + chiffres + 1 symbole
// Exemples : Sahel48!, Faso724!, Baobab39!, Volta62#
function generateSecurePassword(): string {
  const n = SHORT_MEMORABLE_WORDS.length;
  const randInt = (max: number): number => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    }
    return Math.floor(Math.random() * max);
  };

  const word = SHORT_MEMORABLE_WORDS[randInt(n)];
  const sym = MEMORABLE_SYMBOLS[randInt(MEMORABLE_SYMBOLS.length)];

  let numStr = '';
  if (word.length <= 4) {
    numStr = String(100 + randInt(900)); // 3 chiffres pour atteindre 8 caractères
  } else {
    numStr = String(12 + randInt(87));  // 2 chiffres (8 caractères pour 5 lettres, 9 pour 6 lettres)
  }

  return `${word}${numStr}${sym}`;
}

export default function AdminUsersPage() {
  const { user: currentUser, updateUserSession } = useAdminAuth();
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUserDTO[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 20, total: 0, total_pages: 1 });

  // Règle déontologique : Déterminer si l'utilisateur connecté est Superadmin
  const isCurrentUserSuperadmin = normalizeRoleCode(currentUser?.role || '') === 'superadmin';

  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserDTO | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState<AdminUserDTO | null>(null);
  const [showRoleGuide, setShowRoleGuide] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<BackendAdminRole>('journalist');
  const [formTitle, setFormTitle] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [formStatus, setFormStatus] = useState<'active' | 'suspended'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleCopyPassword = async () => {
    if (!formPassword) return;
    try {
      await navigator.clipboard.writeText(formPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Load users from Go API
  const loadUsers = useCallback(async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await usersApi.listUsers({
        page,
        limit: 20,
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
      });
      setUsers(res.users);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (err: any) {
      const msg = err instanceof ApiClientError ? err.getLocalizedMessage('fr') : (err.message || 'Impossible de charger la liste des utilisateurs.');
      error('Erreur de chargement', msg);
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  }, [currentPage, searchTerm, roleFilter, statusFilter, error]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Gestion du changement de rôle avec auto-remplissage de la fonction / titre rédactionnel
  const handleRoleChange = (newRole: BackendAdminRole) => {
    setFormRole(newRole);
    setFormTitle(DEFAULT_ROLE_TITLES[newRole] || '');
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormRole('journalist');
    setFormTitle(DEFAULT_ROLE_TITLES['journalist']); // Auto-renseigné par défaut mais modifiable
    setFormAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80');
    setFormPassword(generateSecurePassword());
    setShowPassword(true);
    setCopiedPassword(false);
    setFormStatus('active');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user: AdminUserDTO) => {
    const userRole = normalizeRoleCode(user.role);
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(userRole);
    // Conserve le titre personnalisé existant ou propose le titre par défaut du rôle s'il était vide
    setFormTitle(user.title?.trim() || DEFAULT_ROLE_TITLES[userRole] || '');
    setFormAvatar(user.avatar || '');
    setFormPassword(''); // Empty password = keep existing
    setShowPassword(false);
    setCopiedPassword(false);
    setFormStatus(user.status);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  // Submit User Create or Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!formName.trim() || !formEmail.trim()) {
      warning('Champs requis', 'Veuillez renseigner au minimum le nom et l\'adresse email.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingUser) {
        // Mode Mise à jour
        const hasNewPassword = Boolean(formPassword.trim());
        const updatePayload: any = {
          name: formName.trim(),
          email: formEmail.trim().toLowerCase(),
          role: formRole,
          title: formTitle.trim(),
          avatar: formAvatar,
          status: formStatus,
        };
        if (hasNewPassword) {
          updatePayload.password = formPassword.trim();
        }

        await usersApi.updateUser(editingUser.id, updatePayload);

        // Si l'utilisateur modifié est l'utilisateur actuellement connecté, on synchronise sa session
        if (currentUser && editingUser.id === currentUser.id) {
          updateUserSession({
            name: formName.trim(),
            email: formEmail.trim().toLowerCase(),
            title: formTitle.trim(),
            avatar: formAvatar,
          });
        }

        if (hasNewPassword) {
          success(
            'Profil & mot de passe actualisés',
            `Le compte de ${formName} a été mis à jour et ses nouveaux accès ont été envoyés par email via Resend.`
          );
        } else {
          success('Profil mis à jour', `Le compte de ${formName} a été actualisé avec succès.`);
        }
      } else {
        // Mode Création
        const passwordToSend = formPassword.trim() || generateSecurePassword();
        await usersApi.createUser({
          name: formName.trim(),
          email: formEmail.trim().toLowerCase(),
          role: formRole,
          title: formTitle.trim(),
          avatar: formAvatar,
          password: passwordToSend,
          status: formStatus,
        });
        success(
          'Compte créé avec succès',
          `Le compte de ${formName} a été créé avec mot de passe auto-généré et ses accès ont été expédiés par email.`
        );
      }

      setIsModalOpen(false);
      loadUsers(1);
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        if (err.details && err.details.length > 0) {
          const mapped: Record<string, string> = {};
          err.details.forEach((d) => {
            mapped[d.field] = d.message_fr;
          });
          setFieldErrors(mapped);
        }
        error('Erreur d\'enregistrement', err.getLocalizedMessage('fr'));
      } else {
        error('Erreur', err.message || 'Une erreur inattendue est survenue.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle User Status (Active / Suspended)
  const handleToggleStatus = async (user: AdminUserDTO) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await usersApi.updateUserStatus(user.id, newStatus);
      if (newStatus === 'active') {
        success('Compte réactivé', `L'accès pour ${user.name} a été rétabli.`);
      } else {
        warning('Compte suspendu', `L'accès pour ${user.name} a été verrouillé.`);
      }
      loadUsers();
    } catch (err: any) {
      const msg = err instanceof ApiClientError ? err.getLocalizedMessage('fr') : (err.message || 'Action impossible.');
      error('Action impossible', msg);
    }
  };

  // Delete User
  const handleDelete = async (user: AdminUserDTO) => {
    try {
      await usersApi.deleteUser(user.id);
      success('Compte supprimé', `Le compte de ${user.name} a été définitivement retiré.`);
      setIsDeletingUser(null);
      loadUsers();
    } catch (err: any) {
      const msg = err instanceof ApiClientError ? err.getLocalizedMessage('fr') : (err.message || 'Erreur lors de la suppression.');
      error('Suppression impossible', msg);
    }
  };

  // Helper to render role badge
  const renderRoleBadge = (role: string) => {
    const code = normalizeRoleCode(role);
    switch (code) {
      case 'superadmin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#c2410c] text-white text-[10px] font-mono font-bold uppercase rounded tracking-wider shadow-xs">
            <ShieldCheck size={11} />
            <span>★ Superadmin</span>
          </span>
        );
      case 'editorial_director':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#087443] text-white text-[10px] font-mono font-bold uppercase rounded tracking-wider">
            <Shield size={11} />
            <span>Directeur éditorial</span>
          </span>
        );
      case 'journalist':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#1e3a8a] text-white text-[10px] font-mono font-bold uppercase rounded tracking-wider">
            <Briefcase size={11} />
            <span>Enquêteur</span>
          </span>
        );
      case 'tracker_data':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#d97706] text-white text-[10px] font-mono font-bold uppercase rounded tracking-wider">
            <Sparkles size={11} />
            <span>Desk Tracker</span>
          </span>
        );
      case 'desk_ai':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#7c3aed] text-white text-[10px] font-mono font-bold uppercase rounded tracking-wider">
            <Sparkles size={11} />
            <span>Desk IA</span>
          </span>
        );
      case 'auditor':
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

  // Statistics
  const totalUsers = meta.total || users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const suspendedUsers = users.filter((u) => u.status === 'suspended').length;
  const superadminCount = users.filter((u) => normalizeRoleCode(u.role) === 'superadmin').length;

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
          <p className="text-xs font-mono text-[#5a554e] mt-0.5">
            Administration des permissions, des rôles déontologiques et des comptes autorisés.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip position="bottom" content="Actualiser la liste">
            <button
              type="button"
              onClick={() => loadUsers()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e6dfd5] text-xs font-mono font-bold text-[#141414] hover:bg-[#faf8f5] rounded transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-[#087443]' : 'text-[#087443]'} />
              <span>Actualiser</span>
            </button>
          </Tooltip>

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
              <span>Matrice Déontologique des Rôles sur Burkina News (API Go)</span>
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
            {Object.entries(OFFICIAL_ROLES).map(([key, roleInfo]) => (
              <div key={key} className="bg-white p-3 rounded border border-[#e6dfd5] space-y-1">
                <div className="font-mono font-bold text-[11px] uppercase flex items-center gap-1" style={{ color: roleInfo.color }}>
                  <ShieldCheck size={12} />
                  <span>{roleInfo.labelFr}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#555]">
                  {roleInfo.descriptionFr}
                </p>
              </div>
            ))}
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
            <span>Sécurité Backend</span>
            <Lock size={15} className="text-[#087443]" />
          </div>
          <div className="text-base font-serif font-bold text-[#141414] pt-1 truncate">
            JWT Bearer + RBAC
          </div>
          <div className="text-[10px] font-mono text-[#087443] font-semibold">
            PostgreSQL 16 Sécurisé
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-8 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
          />
          {searchTerm && (
            <Tooltip position="left" content="Effacer la recherche">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
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
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded bg-white focus:outline-none focus:border-[#087443] cursor-pointer"
          >
            <option value="all">Tous les rôles</option>
            <option value="superadmin">★ Superadmin</option>
            <option value="editorial_director">Directeur éditorial</option>
            <option value="journalist">Rédacteur / Enquêteur</option>
            <option value="tracker_data">Desk Tracker</option>
            <option value="desk_ai">Desk IA</option>
            <option value="auditor">Auditeur</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded bg-white focus:outline-none focus:border-[#087443] cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="suspended">Suspendus</option>
          </select>
        </div>
      </div>

      {/* Users Table / Grid with Skeleton Support */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : users.length === 0 ? (
        <div className="bg-white border border-[#e6dfd5] p-12 text-center rounded-lg space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#f4eee3] flex items-center justify-center mx-auto text-[#087443]">
            <Users size={24} />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#141414]">
            Aucun utilisateur trouvé
          </h3>
          <p className="text-xs font-mono text-[#736c62] max-w-sm mx-auto">
            Aucun compte ne correspond aux filtres appliqués dans PostgreSQL. Essayez d'élargir votre recherche.
          </p>
          {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
                setCurrentPage(1);
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
            <table className="w-full text-left text-xs border-collapse min-w-[660px]">
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
                {users.map((user) => {
                  const isTargetSuperadmin = normalizeRoleCode(user.role) === 'superadmin';
                  const isSelf = currentUser ? currentUser.id === user.id : false;
                  // Seul le Superadmin peut modifier son propre compte
                  const canModifyThisUser = !isTargetSuperadmin || isSelf;

                  return (
                  <tr key={user.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                    {/* User Identity */}
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
                            {normalizeRoleCode(user.role) === 'superadmin' && (
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

                    {/* Status Toggle */}
                    <td className="py-3 px-4 text-center">
                      <Tooltip
                        position="top"
                        content={
                          !canModifyThisUser
                            ? "Seul ce Superadmin peut modifier son propre compte"
                            : user.status === 'active'
                            ? "Cliquer pour suspendre l'accès"
                            : "Cliquer pour réactiver l'accès"
                        }
                      >
                        <button
                          type="button"
                          disabled={!canModifyThisUser}
                          onClick={() => canModifyThisUser && handleToggleStatus(user)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${
                            !canModifyThisUser
                              ? 'opacity-60 cursor-not-allowed bg-neutral-100 text-neutral-500'
                              : user.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200 cursor-pointer'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${!canModifyThisUser ? 'bg-neutral-400' : user.status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                          <span>{user.status === 'active' ? 'Actif' : 'Suspendu'}</span>
                          {!canModifyThisUser && <Lock size={10} className="ml-0.5 text-neutral-400" />}
                        </button>
                      </Tooltip>
                    </td>

                    {/* Last Login */}
                    <td className="py-3 px-4 text-[11px] text-[#736c62] hidden lg:table-cell">
                      {user.last_login_at ? (
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-[#087443]" />
                          <span>
                            {new Date(user.last_login_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">Jamais connecté</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Tooltip
                          position="top"
                          content={
                            !canModifyThisUser
                              ? "Seul ce Superadmin peut modifier son propre compte"
                              : "Modifier le profil & rôle"
                          }
                        >
                          <button
                            type="button"
                            disabled={!canModifyThisUser}
                            onClick={() => canModifyThisUser && handleOpenEdit(user)}
                            className={`p-1.5 rounded border transition-colors ${
                              !canModifyThisUser
                                ? 'opacity-40 cursor-not-allowed text-neutral-400 border-[#e6dfd5] bg-neutral-50'
                                : 'text-[#555] hover:text-[#087443] hover:bg-[#faf8f5] border-[#e6dfd5] cursor-pointer'
                            }`}
                            aria-label={`Modifier ${user.name}`}
                          >
                            {!canModifyThisUser ? <Lock size={14} /> : <Edit3 size={14} />}
                          </button>
                        </Tooltip>

                        <Tooltip
                          position="top"
                          content={
                            !canModifyThisUser
                              ? "Seul ce Superadmin peut supprimer ou gérer son propre compte"
                              : "Supprimer définitivement ce compte"
                          }
                        >
                          <button
                            type="button"
                            disabled={!canModifyThisUser}
                            onClick={() => canModifyThisUser && setIsDeletingUser(user)}
                            className={`p-1.5 rounded border transition-colors ${
                              !canModifyThisUser
                                ? 'opacity-40 cursor-not-allowed text-neutral-400 border-[#e6dfd5] bg-neutral-50'
                                : 'text-[#555] hover:text-[#d32f2f] hover:bg-rose-50 border-[#e6dfd5] cursor-pointer'
                            }`}
                            aria-label={`Supprimer ${user.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {meta.total_pages > 1 && (
            <div className="p-3 bg-[#faf8f5] border-t border-[#e6dfd5] flex items-center justify-between text-xs font-mono">
              <span className="text-[#736c62]">
                Page {meta.page} sur {meta.total_pages} ({meta.total} membres au total)
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={meta.page <= 1}
                  onClick={() => {
                    const newP = meta.page - 1;
                    setCurrentPage(newP);
                    loadUsers(newP);
                  }}
                  className="px-2 py-1 border border-[#e6dfd5] rounded bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft size={13} />
                  <span>Précédent</span>
                </button>
                <button
                  type="button"
                  disabled={meta.page >= meta.total_pages}
                  onClick={() => {
                    const newP = meta.page + 1;
                    setCurrentPage(newP);
                    loadUsers(newP);
                  }}
                  className="px-2 py-1 border border-[#e6dfd5] rounded bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <span>Suivant</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-t-2 sm:border-2 border-[#141414] rounded-t-xl sm:rounded-none max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-5">
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
                    className={`w-full px-3 py-2 text-xs font-mono border rounded focus:outline-none ${
                      fieldErrors.name ? 'border-rose-500 bg-rose-50' : 'border-[#e6dfd5] focus:border-[#087443]'
                    }`}
                  />
                  {fieldErrors.name && (
                    <span className="text-[10px] font-mono text-rose-600 mt-1 block">{fieldErrors.name}</span>
                  )}
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
                    className={`w-full px-3 py-2 text-xs font-mono border rounded focus:outline-none ${
                      fieldErrors.email ? 'border-rose-500 bg-rose-50' : 'border-[#e6dfd5] focus:border-[#087443]'
                    }`}
                  />
                  {fieldErrors.email && (
                    <span className="text-[10px] font-mono text-rose-600 mt-1 block">{fieldErrors.email}</span>
                  )}
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                  Rôle Déontologique & Droits d'Accès <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formRole}
                  onChange={(e) => handleRoleChange(e.target.value as BackendAdminRole)}
                  className="w-full px-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443] font-bold cursor-pointer"
                >
                  {isCurrentUserSuperadmin && (
                    <option value="superadmin">★ Superadmin — Accès total & architecture système</option>
                  )}
                  <option value="editorial_director">Directeur éditorial — Validation, Une, Numéros</option>
                  <option value="journalist">Rédacteur / Enquêteur — Articles d'enquêtes & faits du Fil</option>
                  <option value="tracker_data">Desk Données & Tracker — Chantiers PND & Baromètre RELANCE</option>
                  <option value="desk_ai">Desk IA & Veille — Synthèses & veille documentaire automatisée</option>
                  <option value="auditor">Auditeur Déontologique — Contrôle qualité (Lecture seule)</option>
                </select>
                <p className="text-[10px] font-mono text-[#736c62] mt-1">
                  Chaque rôle délimite les actions autorisées par le middleware RBAC du backend Go.
                </p>
              </div>

              {/* Title / Function (Auto-renseigné selon le rôle, mais entièrement modifiable) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono uppercase font-bold text-[#141414]">
                    Fonction / Titre rédactionnel
                  </label>
                  {formTitle !== DEFAULT_ROLE_TITLES[formRole] && (
                    <button
                      type="button"
                      onClick={() => setFormTitle(DEFAULT_ROLE_TITLES[formRole])}
                      className="text-[10px] font-mono text-[#087443] hover:underline cursor-pointer flex items-center gap-1"
                      title="Rétablir l'intitulé par défaut du rôle"
                    >
                      <RefreshCw size={10} />
                      <span>Rétablir titre standard</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={DEFAULT_ROLE_TITLES[formRole]}
                  className="w-full px-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase font-bold text-[#141414]">
                    {editingUser ? 'Mot de passe du compte' : 'Mot de passe mémorisable auto-généré *'}
                  </label>
                  {editingUser ? (
                    formPassword ? (
                      <button
                        type="button"
                        onClick={() => {
                          setFormPassword('');
                          setShowPassword(false);
                        }}
                        className="text-[11px] font-mono text-neutral-500 hover:text-neutral-700 underline cursor-pointer"
                      >
                        Conserver mot de passe actuel
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setFormPassword(generateSecurePassword());
                          setShowPassword(true);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#087443] hover:text-[#065b34] cursor-pointer"
                      >
                        <Sparkles size={12} />
                        <span>Générer un mot de passe mémorisable</span>
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setFormPassword(generateSecurePassword());
                        setShowPassword(true);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#087443] hover:text-[#065b34] cursor-pointer"
                    >
                      <RefreshCw size={11} />
                      <span>Régénérer</span>
                    </button>
                  )}
                </div>

                <div className="relative flex items-center">
                  <Key size={14} className="absolute left-3 text-[#736c62] pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!editingUser}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={editingUser ? '•••••••• (laisser vide pour conserver le mot de passe actuel)' : 'Mot de passe sécurisé'}
                    className={`w-full pl-9 pr-20 py-2 text-xs font-mono border rounded focus:outline-none transition-colors ${
                      fieldErrors.password
                        ? 'border-rose-500 bg-rose-50'
                        : formPassword && editingUser
                        ? 'border-amber-400 bg-amber-50/40 focus:border-amber-600'
                        : 'border-[#e6dfd5] focus:border-[#087443]'
                    }`}
                  />
                  {formPassword && (
                    <div className="absolute right-2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-[#736c62] hover:text-[#141414] rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                        title={showPassword ? 'Masquer' : 'Afficher'}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyPassword}
                        className="p-1 text-[#736c62] hover:text-[#087443] rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                        title={copiedPassword ? 'Copié !' : 'Copier'}
                      >
                        {copiedPassword ? <Check size={14} className="text-[#087443]" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </div>

                {fieldErrors.password && (
                  <span className="text-[10px] font-mono text-rose-600 mt-1 block">{fieldErrors.password}</span>
                )}

                {editingUser && formPassword && (
                  <div className="p-2.5 bg-amber-50 border border-amber-300 rounded flex items-start gap-2 text-[11px] text-amber-900 mt-2">
                    <Mail size={15} className="shrink-0 mt-0.5 text-amber-700" />
                    <span>
                      <strong>⚡ Nouveau mot de passe mémorisable défini :</strong> Lors de l'enregistrement, un email contenant ces nouveaux identifiants sera immédiatement expédié à <strong>{formEmail || "l'utilisateur"}</strong> depuis <code>info@burkina-news.com</code> (via Resend). Toutes ses sessions actives actuelles seront automatiquement révoquées.
                    </span>
                  </div>
                )}

                {editingUser && !formPassword && (
                  <p className="text-[10px] font-mono text-[#736c62]">
                    Le mot de passe actuel de l'utilisateur sera conservé inchangé si ce champ reste vide.
                  </p>
                )}
              </div>

              {/* Avatar Uploader */}
              <div>
                <ImageUploader
                  label="Photo de profil / Avatar"
                  value={formAvatar}
                  onChange={setFormAvatar}
                  folder="avatars"
                  helperText="Importez un fichier local depuis votre ordinateur ou collez une URL d'image."
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
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t border-[#e6dfd5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-[#e6dfd5] text-xs font-mono font-bold text-[#141414] hover:bg-[#faf8f5] rounded cursor-pointer text-center"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-[#087443] hover:bg-[#0a5c36] text-white text-xs font-mono font-bold uppercase tracking-wider rounded transition-colors cursor-pointer disabled:opacity-50 text-center"
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-t-2 sm:border-2 border-rose-700 rounded-t-xl sm:rounded-none max-w-sm w-full p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-serif font-bold text-lg">
              <AlertCircle size={20} />
              <span>Confirmer la suppression</span>
            </div>
            <p className="text-xs font-serif text-[#444] leading-relaxed">
              Êtes-vous certain de vouloir supprimer définitivement le compte de <strong>{isDeletingUser.name}</strong> ({isDeletingUser.email}) ?
            </p>
            <p className="text-[11px] font-mono text-[#c2410c] bg-rose-50 p-2 rounded border border-rose-200">
              Cette action est irréversible. Toutes les sessions actives associées seront immédiatement closes.
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeletingUser(null)}
                className="w-full sm:w-auto px-3 py-2 sm:py-1.5 border border-[#e6dfd5] text-xs font-mono text-[#141414] hover:bg-[#faf8f5] rounded cursor-pointer text-center"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(isDeletingUser)}
                className="w-full sm:w-auto px-4 py-2 sm:py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-mono font-bold uppercase tracking-wider rounded cursor-pointer text-center"
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
