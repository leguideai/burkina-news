"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Sparkles, 
  FileText, 
  Landmark, 
  Construction, 
  TrendingUp, 
  Zap, 
  BookOpen, 
  Scale, 
  AlertCircle, 
  Mail,
  Users,
  X,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
  FolderTree
} from 'lucide-react';
import Tooltip from '@/components/ui/Tooltip';
import MicumIcon from '@/components/admin/MicumIcon';
import { useAdminAuth } from './AuthGuard';
import { normalizeRoleCode } from '@/lib/api';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  unreadReportsCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function AdminSidebar({ 
  mobileOpen = false, 
  onCloseMobile = () => {},
  unreadReportsCount = 2,
  isCollapsed = false,
  onToggleCollapse = () => {}
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { user } = useAdminAuth();
  const roleCode = normalizeRoleCode(user?.role || '');
  const canManageUsers = roleCode === 'superadmin' || roleCode === 'editorial_director';

  const navItems = [
    { label: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
    { label: "Pilotage de la Une", href: "/admin/une", icon: Sparkles, badge: "Vitrine" },
    { label: "Articles & Enquêtes", href: "/admin/articles", icon: FileText },
    { label: "Rubriques & Sous-rubriques", href: "/admin/rubriques", icon: FolderTree, badge: "Structure" },
    { label: "Tracker des Chantiers", href: "/admin/projets", icon: Construction },
    { label: "Baromètre RELANCE", href: "/admin/indicateurs", icon: TrendingUp },
    { label: "Le Fil Hebdo", href: "/admin/fil", icon: Zap },
    { label: "Numéros Mensuels", href: "/admin/numeros", icon: BookOpen },
    { label: "Registre Corrections", href: "/admin/corrections", icon: Scale },
    { label: "Signalements Lecteurs", href: "/admin/signalements", icon: AlertCircle, count: unreadReportsCount },
    { label: "Abonnés Newsletter", href: "/admin/newsletter", icon: Mail },
    ...(canManageUsers
      ? [{ label: "Équipe & Accès", href: "/admin/utilisateurs", icon: Users, badge: "Sécurité" }]
      : []),
  ];

  // Sidebar internal content
  const renderSidebarContent = (inDrawer: boolean = false) => {
    const collapsed = !inDrawer && isCollapsed;

    return (
      <div className="flex flex-col h-full bg-[#072e1a] text-white">
        {/* Brand Header with toggle icon right next to the logo */}
        <div className={`border-b border-[#1b4d32] ${
          collapsed 
            ? 'p-3 flex flex-col items-center gap-2 justify-center' 
            : 'p-3.5 flex items-center justify-between gap-2'
        }`}>
          <div className={`flex items-center gap-2.5 min-w-0 ${collapsed ? 'justify-center' : ''}`}>
            <div className="bg-white p-1 rounded shrink-0 shadow-xs">
              <img src="/images/logo.png" alt="Burkina News" className={`${collapsed ? 'h-5' : 'h-6'} w-auto object-contain`} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-white truncate">
                  Desk Rédaction
                </div>
                <div className="text-[10px] font-mono text-[#a7c5b6] truncate">
                  Administration V3
                </div>
              </div>
            )}
          </div>

          {/* Desktop Toggle Icon placed at top next to the logo */}
          {!inDrawer && (
            <Tooltip
              position={collapsed ? "right" : "bottom"}
              content={collapsed ? "Déployer la barre latérale" : "Réduire la barre latérale"}
            >
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1.5 text-[#a7c5b6] hover:text-[#ffd8a8] hover:bg-[#0b4627] rounded transition-colors shrink-0 cursor-pointer"
                aria-label={collapsed ? "Déployer la barre latérale" : "Réduire la barre latérale"}
              >
                {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              </button>
            </Tooltip>
          )}

          {/* Mobile close button in drawer */}
          {inDrawer && (
            <Tooltip position="left" content="Fermer le menu">
              <button 
                onClick={onCloseMobile}
                className="p-1 text-[#a7c5b6] hover:text-white cursor-pointer"
                aria-label="Fermer le menu"
              >
                <X size={20} />
              </button>
            </Tooltip>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-[#ffd8a8] font-bold">
              Navigation Éditoriale
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            const linkContent = (
              <Link
                href={item.href}
                onClick={onCloseMobile}
                className={`relative flex items-center w-full ${
                  collapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-2.5'
                } text-xs font-mono rounded transition-all ${
                  isActive
                    ? 'bg-[#0b4627] text-white font-bold border-l-4 border-[#ffd8a8]'
                    : 'text-[#d1e3d9] hover:bg-[#0b4627]/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon size={18} className={isActive ? 'text-[#ffd8a8]' : 'text-[#a7c5b6]'} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {/* Badges / Counts */}
                {!collapsed ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-[#ffd8a8] text-[#072e1a] rounded">
                        {item.badge}
                      </span>
                    )}

                    {item.count !== undefined && item.count > 0 && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-[#c2410c] text-white rounded-full">
                        {item.count}
                      </span>
                    )}
                  </div>
                ) : (
                  item.count !== undefined && item.count > 0 && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#c2410c] rounded-full ring-2 ring-[#072e1a]" />
                  )
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip
                  key={item.href}
                  position="right"
                  content={`${item.label}${item.count ? ` (${item.count} signalements)` : ''}`}
                  className="w-full"
                >
                  {linkContent}
                </Tooltip>
              );
            }

            return <React.Fragment key={item.href}>{linkContent}</React.Fragment>;
          })}
        </div>

        {/* Footer info & public link */}
        <div className={`border-t border-[#1b4d32] bg-[#052213] text-xs font-mono ${collapsed ? 'p-2.5 text-center' : 'p-3 space-y-1'}`}>
          <Tooltip position={collapsed ? "right" : "top"} content="Consulter le site public dans un nouvel onglet" className="w-full">
            <a
              href="/fr"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center w-full ${collapsed ? 'justify-center p-2' : 'justify-between p-2'} text-[#a7c5b6] hover:text-white hover:bg-[#072e1a] rounded transition-colors`}
            >
              {!collapsed && <span>Voir le site public</span>}
              <ExternalLink size={14} />
            </a>
          </Tooltip>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Fixed & Togglable Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col fixed top-0 bottom-0 left-0 z-40 h-screen transition-all duration-300 border-r border-[#1b4d32] ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
