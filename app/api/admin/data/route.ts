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
      case 'create_indicator': {
        const name = (payload.name || '').trim();
        const code = (payload.code || '').trim().toUpperCase();
        if (!name || !code) {
          return NextResponse.json({ error: 'Le nom et le code de l\'indicateur sont requis.' }, { status: 400 });
        }
        if (store.indicators.some(i => i.code === code)) {
          return NextResponse.json({ error: 'Un indicateur avec ce code existe déjà.' }, { status: 400 });
        }
        const newIndicator: Indicator = {
          id: payload.id || `ind-${Date.now()}`,
          code,
          name,
          nameEn: payload.nameEn?.trim() || '',
          definition: payload.definition || '',
          definitionEn: payload.definitionEn || '',
          unit: payload.unit || '%',
          baselineValue: Number(payload.baselineValue) || 0,
          baselineYear: Number(payload.baselineYear) || 2024,
          currentValue: Number(payload.currentValue) || 0,
          currentYear: Number(payload.currentYear) || new Date().getFullYear(),
          target2028: payload.target2028 !== undefined && payload.target2028 !== '' ? Number(payload.target2028) : undefined,
          target2030: payload.target2030 !== undefined && payload.target2030 !== '' ? Number(payload.target2030) : undefined,
          trend: (payload.trend === 'up' || payload.trend === 'down' || payload.trend === 'stable') ? payload.trend : 'stable',
          source: payload.source?.trim() || 'INSD / Ministère de l\'Économie',
          category: payload.category || 'economie',
          program: payload.program || '',
          programEn: payload.programEn || '',
          image: payload.image || '',
          history: Array.isArray(payload.history) && payload.history.length > 0 ? payload.history : [
            { year: Number(payload.baselineYear) || 2024, value: Number(payload.baselineValue) || 0, source: payload.source || 'INSD' },
            { year: Number(payload.currentYear) || new Date().getFullYear(), value: Number(payload.currentValue) || 0, source: payload.source || 'INSD' }
          ]
        };
        store.indicators.push(newIndicator);
        return NextResponse.json({ success: true, message: 'Indicateur créé dans le Baromètre RELANCE.', item: newIndicator });
      }

      case 'update_indicator': {
        const index = store.indicators.findIndex(i => i.id === payload.id || i.code === payload.code);
        if (index === -1) {
          return NextResponse.json({ error: 'Indicateur introuvable.' }, { status: 404 });
        }
        store.indicators[index] = { ...store.indicators[index], ...payload };
        return NextResponse.json({ success: true, message: 'Indicateur mis à jour.', item: store.indicators[index] });
      }

      case 'delete_indicator': {
        const { id, code } = payload;
        const initialLen = store.indicators.length;
        store.indicators = store.indicators.filter(i => (id ? i.id !== id : true) && (code ? i.code !== code : true));
        if (store.indicators.length === initialLen) {
          return NextResponse.json({ error: 'Indicateur introuvable.' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Indicateur supprimé du Baromètre.' });
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
      case 'create_brief': {
        const title = (payload.title || '').trim();
        if (!title) {
          return NextResponse.json({ error: 'Le titre de l\'édition est requis.' }, { status: 400 });
        }
        const slug = payload.slug?.trim() || title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
        if (store.briefs.some(b => b.slug === slug)) {
          return NextResponse.json({ error: 'Une édition avec cet identifiant URL (slug) existe déjà.' }, { status: 400 });
        }
        const newBrief = {
          id: payload.id || `brief-${Date.now()}`,
          title,
          titleEn: payload.titleEn?.trim() || '',
          slug,
          date: payload.date || new Date().toISOString().split('T')[0],
          weekNumber: Number(payload.weekNumber) || 1,
          image: payload.image || '',
          summary: payload.summary || '',
          summaryEn: payload.summaryEn || '',
          facts: Array.isArray(payload.facts) ? payload.facts : []
        };
        store.briefs.unshift(newBrief);
        return NextResponse.json({ success: true, message: 'Nouvelle édition du Fil créée.', item: newBrief });
      }

      case 'update_brief': {
        const index = store.briefs.findIndex(b => b.slug === payload.slug || b.id === payload.id);
        if (index === -1) {
          return NextResponse.json({ error: 'Édition du Fil introuvable.' }, { status: 404 });
        }
        store.briefs[index] = { 
          ...store.briefs[index], 
          ...payload,
          facts: payload.facts !== undefined ? payload.facts : store.briefs[index].facts
        };
        return NextResponse.json({ success: true, message: 'Édition du Fil mise à jour.', item: store.briefs[index] });
      }

      case 'delete_brief': {
        const { slug } = payload;
        const initialLen = store.briefs.length;
        store.briefs = store.briefs.filter(b => b.slug !== slug);
        if (store.briefs.length === initialLen) {
          return NextResponse.json({ error: 'Édition introuvable.' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Édition du Fil supprimée.' });
      }

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

      case 'delete_brief_fact': {
        const { briefSlug, factIndex } = payload;
        const brief = store.briefs.find(b => b.slug === briefSlug);
        if (!brief || !brief.facts[factIndex]) {
          return NextResponse.json({ error: 'Fait introuvable.' }, { status: 404 });
        }
        brief.facts.splice(factIndex, 1);
        return NextResponse.json({ success: true, message: 'Fait supprimé de l\'édition.' });
      }

      // ── ISSUES ────────────────────────────────────────────
      case 'create_issue': {
        const title = (payload.title || '').trim();
        if (!title) {
          return NextResponse.json({ error: 'Le titre du numéro est requis.' }, { status: 400 });
        }
        const number = Number(payload.number) || (store.issues.reduce((max, i) => Math.max(max, i.number || 0), 0) + 1);
        const slug = payload.slug?.trim() || `numero-${number < 10 ? `0${number}` : number}`;
        if (store.issues.some(i => i.slug === slug || i.number === number)) {
          return NextResponse.json({ error: 'Un numéro avec ce chiffre ou cet identifiant (slug) existe déjà.' }, { status: 400 });
        }
        const newIssue: Issue = {
          id: payload.id || `iss-${Date.now()}`,
          number,
          title,
          titleEn: payload.titleEn?.trim() || '',
          slug,
          coverImage: payload.coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
          publicationDate: payload.publicationDate || new Date().toISOString().split('T')[0],
          summary: payload.summary || '',
          summaryEn: payload.summaryEn || '',
          articleCount: Array.isArray(payload.articleIds) ? payload.articleIds.length : (Number(payload.articleCount) || 0),
          articleIds: Array.isArray(payload.articleIds) ? payload.articleIds : [],
          pdfUrl: payload.pdfUrl || ''
        };
        store.issues.unshift(newIssue);
        return NextResponse.json({ success: true, message: `Numéro #${newIssue.number} créé avec succès.`, item: newIssue });
      }

      case 'update_issue': {
        const index = store.issues.findIndex(iss => iss.id === payload.id);
        if (index === -1) {
          return NextResponse.json({ error: 'Numéro introuvable.' }, { status: 404 });
        }
        store.issues[index] = { 
          ...store.issues[index], 
          ...payload,
          articleCount: Array.isArray(payload.articleIds) ? payload.articleIds.length : (payload.articleCount ?? store.issues[index].articleCount)
        };
        return NextResponse.json({ success: true, message: 'Détails du numéro enregistrés.', item: store.issues[index] });
      }

      case 'delete_issue': {
        const { id, slug } = payload;
        const initialLen = store.issues.length;
        store.issues = store.issues.filter(i => (id ? i.id !== id : true) && (slug ? i.slug !== slug : true));
        if (store.issues.length === initialLen) {
          return NextResponse.json({ error: 'Numéro introuvable.' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Numéro supprimé de la collection.' });
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
