import { NextResponse } from 'next/server';
import { 
  getAdminStore, 
  getSubmissionsContacts, 
  getSubmissionsNewsletter,
  saveHomepageConfig,
  saveAdminUsers 
} from '@/data/admin-store';
import { Article, Project, ProjectStatus, Indicator, Brief, Issue, Correction } from '@/data/types';

export async function GET(request: Request) {
  const store = getAdminStore();
  const contacts = getSubmissionsContacts();
  const newsletter = getSubmissionsNewsletter();

  return NextResponse.json({
    articles: store.articles,
    projects: store.projects,
    indicators: store.indicators,
    briefs: store.briefs,
    issues: store.issues,
    categories: store.categories,
    corrections: store.corrections,
    homepageConfig: store.homepageConfig,
    users: store.users,
    contacts,
    newsletter,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    const store = getAdminStore();

    switch (action) {
      // ── ARTICLES ──────────────────────────────────────────
      case 'create_article': {
        const newArticle: Article = {
          id: `art-${Date.now()}`,
          publishedAt: new Date().toISOString(),
          readTime: '6 min',
          sourceCount: 5,
          tags: [],
          ...payload,
        };
        store.articles.unshift(newArticle);
        return NextResponse.json({ success: true, message: 'Article créé avec succès.', item: newArticle });
      }

      case 'update_article': {
        const index = store.articles.findIndex(a => a.id === payload.id);
        if (index === -1) {
          return NextResponse.json({ error: 'Article introuvable.' }, { status: 404 });
        }
        store.articles[index] = { ...store.articles[index], ...payload };
        return NextResponse.json({ success: true, message: 'Article mis à jour.', item: store.articles[index] });
      }

      case 'delete_article': {
        store.articles = store.articles.filter(a => a.id !== payload.id);
        return NextResponse.json({ success: true, message: 'Article supprimé.' });
      }

      // ── PROJECTS ──────────────────────────────────────────
      case 'create_project': {
        const newProject: Project = {
          id: `proj-${Date.now()}`,
          lastVerifiedAt: new Date().toISOString(),
          statusHistory: [
            {
              status: payload.currentStatus || 'annonce',
              date: new Date().toISOString().split('T')[0],
              source: payload.initialSource || 'Conseil des Ministres',
              note: 'Création initiale de la fiche documentaire.'
            }
          ],
          actors: [],
          sources: [],
          linkedArticleIds: [],
          ...payload,
        };
        store.projects.unshift(newProject);
        return NextResponse.json({ success: true, message: 'Chantier ajouté au Tracker.', item: newProject });
      }

      case 'update_project': {
        const index = store.projects.findIndex(p => p.id === payload.id);
        if (index === -1) {
          return NextResponse.json({ error: 'Chantier introuvable.' }, { status: 404 });
        }
        store.projects[index] = { ...store.projects[index], ...payload };
        return NextResponse.json({ success: true, message: 'Fiche chantier mise à jour.', item: store.projects[index] });
      }

      case 'update_project_status': {
        const { projectId, newStatus, source, date, note, noteEn } = payload;
        const project = store.projects.find(p => p.id === projectId);
        if (!project) {
          return NextResponse.json({ error: 'Chantier introuvable.' }, { status: 404 });
        }

        project.currentStatus = newStatus as ProjectStatus;
        project.lastVerifiedAt = date || new Date().toISOString().split('T')[0];

        // Add to history
        project.statusHistory.push({
          status: newStatus as ProjectStatus,
          date: date || new Date().toISOString().split('T')[0],
          source: source || 'Observation terrain',
          note: note || `Passage au statut ${newStatus}`,
          noteEn: noteEn || `Status updated to ${newStatus}`
        });

        return NextResponse.json({ 
          success: true, 
          message: `Statut du chantier mis à jour : ${newStatus.toUpperCase()}`, 
          item: project 
        });
      }

      case 'delete_project': {
        store.projects = store.projects.filter(p => p.id !== payload.id);
        return NextResponse.json({ success: true, message: 'Chantier retiré du Tracker.' });
      }

      // ── INDICATORS ────────────────────────────────────────
      case 'update_indicator': {
        const index = store.indicators.findIndex(i => i.id === payload.id || i.code === payload.code);
        if (index === -1) {
          return NextResponse.json({ error: 'Indicateur introuvable.' }, { status: 404 });
        }
        store.indicators[index] = { ...store.indicators[index], ...payload };
        return NextResponse.json({ success: true, message: 'Indicateur mis à jour.', item: store.indicators[index] });
      }

      // ── HOMEPAGE CURATION ─────────────────────────────────
      case 'update_homepage_config': {
        store.homepageConfig = { ...store.homepageConfig, ...payload };
        saveHomepageConfig(store.homepageConfig);
        return NextResponse.json({ success: true, message: 'Configuration de la Une mise à jour.', item: store.homepageConfig });
      }

      // ── CORRECTIONS ───────────────────────────────────────
      case 'create_correction': {
        const newCorr: Correction = {
          id: `corr-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          ...payload,
        };
        store.corrections.unshift(newCorr);
        return NextResponse.json({ success: true, message: 'Correction inscrite au registre public.', item: newCorr });
      }

      case 'delete_correction': {
        store.corrections = store.corrections.filter(c => c.id !== payload.id);
        return NextResponse.json({ success: true, message: 'Correction supprimée du registre.' });
      }

      // ── RUBRIQUES / CATEGORIES ────────────────────────────
      case 'update_category': {
        const index = store.categories.findIndex(c => c.code === payload.code);
        if (index === -1) {
          return NextResponse.json({ error: 'Rubrique introuvable.' }, { status: 404 });
        }
        store.categories[index] = { ...store.categories[index], ...payload };
        return NextResponse.json({ success: true, message: 'Cadrage de la rubrique mis à jour.', item: store.categories[index] });
      }

      // ── LE FIL HEBDO (BRIEFS) ─────────────────────────────
      case 'update_brief_fact': {
        const { briefSlug, factIndex, fact } = payload;
        const brief = store.briefs.find(b => b.slug === briefSlug);
        if (!brief || !brief.facts[factIndex]) {
          return NextResponse.json({ error: 'Fait introuvable.' }, { status: 404 });
        }
        brief.facts[factIndex] = { ...brief.facts[factIndex], ...fact };
        return NextResponse.json({ success: true, message: 'Fait du Fil mis à jour.' });
      }

      case 'add_brief_fact': {
        const { briefSlug, fact } = payload;
        const brief = store.briefs.find(b => b.slug === briefSlug);
        if (!brief) {
          return NextResponse.json({ error: 'Édition du Fil introuvable.' }, { status: 404 });
        }
        brief.facts.push(fact);
        return NextResponse.json({ success: true, message: 'Nouveau fait ajouté à l\'édition.' });
      }

      // ── ISSUES ────────────────────────────────────────────
      case 'update_issue': {
        const index = store.issues.findIndex(iss => iss.id === payload.id);
        if (index === -1) {
          return NextResponse.json({ error: 'Numéro introuvable.' }, { status: 404 });
        }
        store.issues[index] = { ...store.issues[index], ...payload };
        return NextResponse.json({ success: true, message: 'Détails du numéro enregistrés.', item: store.issues[index] });
      }

      // ── USERS & ACCESS MANAGEMENT ──────────────────────────
      case 'create_user': {
        const cleanEmail = (payload.email || '').trim().toLowerCase();
        if (!cleanEmail || !payload.name) {
          return NextResponse.json({ error: 'Le nom et l\'adresse email sont requis.' }, { status: 400 });
        }
        if (store.users.some(u => u.email.toLowerCase() === cleanEmail)) {
          return NextResponse.json({ error: 'Un compte avec cette adresse email existe déjà sur le Desk.' }, { status: 400 });
        }
        const newUser = {
          id: `usr-${Date.now()}`,
          name: payload.name.trim(),
          email: cleanEmail,
          role: payload.role || 'Rédacteur / Enquêteur',
          status: payload.status || 'active',
          title: payload.title?.trim() || 'Membre de la rédaction',
          avatar: payload.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          password: payload.password?.trim() || 'faso2026',
          createdAt: new Date().toISOString(),
          lastLogin: undefined
        };
        store.users.push(newUser);
        saveAdminUsers(store.users);
        return NextResponse.json({ success: true, message: `Compte de ${newUser.name} créé avec succès.`, item: newUser });
      }

      case 'update_user': {
        const index = store.users.findIndex(u => u.id === payload.id);
        if (index === -1) {
          return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
        }
        // Protect against demoting the last active Superadmin
        if (store.users[index].role === 'Superadmin' && payload.role && payload.role !== 'Superadmin') {
          const superadminCount = store.users.filter(u => u.role === 'Superadmin' && u.status === 'active').length;
          if (superadminCount <= 1) {
            return NextResponse.json({ error: 'Impossible de rétrograder le dernier Superadministrateur actif.' }, { status: 400 });
          }
        }
        store.users[index] = { 
          ...store.users[index], 
          ...payload,
          email: payload.email ? payload.email.trim().toLowerCase() : store.users[index].email
        };
        saveAdminUsers(store.users);
        return NextResponse.json({ success: true, message: `Profil de ${store.users[index].name} mis à jour.`, item: store.users[index] });
      }

      case 'toggle_user_status': {
        const user = store.users.find(u => u.id === payload.id);
        if (!user) {
          return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
        }
        // Protect last active superadmin
        if (user.role === 'Superadmin' && user.status === 'active') {
          const activeSuperadmins = store.users.filter(u => u.role === 'Superadmin' && u.status === 'active').length;
          if (activeSuperadmins <= 1) {
            return NextResponse.json({ error: 'Impossible de suspendre le seul Superadministrateur actif.' }, { status: 400 });
          }
        }
        user.status = user.status === 'active' ? 'suspended' : 'active';
        saveAdminUsers(store.users);
        return NextResponse.json({ 
          success: true, 
          message: user.status === 'active' ? `Compte de ${user.name} réactivé.` : `Compte de ${user.name} suspendu.`,
          user 
        });
      }

      case 'delete_user': {
        const user = store.users.find(u => u.id === payload.id);
        if (!user) {
          return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
        }
        if (user.role === 'Superadmin') {
          const totalSuperadmins = store.users.filter(u => u.role === 'Superadmin').length;
          if (totalSuperadmins <= 1) {
            return NextResponse.json({ error: 'Impossible de supprimer l\'unique Superadministrateur du système.' }, { status: 400 });
          }
        }
        store.users = store.users.filter(u => u.id !== payload.id);
        saveAdminUsers(store.users);
        return NextResponse.json({ success: true, message: `Compte de ${user.name} définitivement supprimé.` });
      }

      default:
        return NextResponse.json({ error: `Action inconnue: ${action}` }, { status: 400 });
    }

  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Erreur lors du traitement de la requête.' }, { status: 500 });
  }
}
