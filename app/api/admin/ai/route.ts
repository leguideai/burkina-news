import { NextRequest, NextResponse } from 'next/server';
import { getActiveProviderInfo, generateAIJson, generateAIChat } from '@/lib/ai/providers';
import { getAdminStore, getSubmissionsContacts, getSubmissionsNewsletter } from '@/data/admin-store';

// Interface for AI requests
interface AIRequest {
  action: 
    | 'chat'
    | 'extract_article'
    | 'extract_project'
    | 'extract_indicators'
    | 'translate'
    | 'compile_fil'
    | 'convert_signalement'
    | 'morning_brief'
    | 'generate_newsletter'
    | 'suggest_quote';
  payload: any;
}

// GET endpoint to discover currently active AI engine (Gemini, Claude, ChatGPT, or Local)
export async function GET() {
  const info = getActiveProviderInfo();
  return NextResponse.json({
    provider: info.provider,
    modelName: info.modelName,
    isLive: info.isLive
  });
}

function buildScreenContext({
  pathname,
  sectionTitle,
  canInsert,
  activeEditorData,
  store,
  contacts,
  newsletter
}: {
  pathname: string;
  sectionTitle?: string;
  canInsert?: boolean;
  activeEditorData?: any;
  store: any;
  contacts: any[];
  newsletter: any[];
}): string {
  const articles = store?.articles || [];
  const projects = store?.projects || [];
  const indicators = store?.indicators || [];
  const briefs = store?.briefs || [];
  const categories = store?.categories || [];
  const corrections = store?.corrections || [];
  const homepageConfig = store?.homepageConfig;
  const users = store?.users || [];

  let context = `=== ÉCRAN ACTUEL SUR LE BACKOFFICE ===\n`;
  context += `Route : ${pathname}\n`;
  context += `Titre de l'écran : ${sectionTitle || 'Desk Administration'}\n`;
  context += `Capacité d'insertion directe : ${canInsert ? 'OUI (un formulaire de saisie est actif sur cet écran)' : 'NON (écran de consultation, audit ou pilotage)'}\n\n`;

  // 1. If in an active editor
  if (canInsert && activeEditorData) {
    context += `=== DONNÉES DU FORMULAIRE EN COURS DE RÉDACTION ===\n`;
    if (activeEditorData.title) context += `- Titre actuel : ${activeEditorData.title}\n`;
    if (activeEditorData.excerpt) context += `- Chapô actuel : ${activeEditorData.excerpt}\n`;
    if (activeEditorData.category) context += `- Rubrique : ${activeEditorData.category}\n`;
    if (activeEditorData.type) context += `- Format : ${activeEditorData.type}\n`;
    if (activeEditorData.sourceCount) context += `- Nombre de sources : ${activeEditorData.sourceCount}\n`;
    if (activeEditorData.tags && activeEditorData.tags.length > 0) context += `- Tags : ${activeEditorData.tags.join(', ')}\n`;
    if (activeEditorData.body) {
      context += `- Corps de texte actuel (extrait) :\n${activeEditorData.body.slice(0, 1500)}${activeEditorData.body.length > 1500 ? '... [tronqué]' : ''}\n`;
    }
    context += `\nCONSIGNE D'INSERTION : Si le journaliste te demande de rédiger, titrer, corriger ou proposer un texte, formule d'abord ton analyse puis ajoute à la fin de ta réponse un bloc JSON strict pour permettre l'insertion immédiate dans le formulaire :\n`;
    context += `\`\`\`json\n{\n  "title": "Titre proposé",\n  "excerpt": "Chapô proposé",\n  "content": "Texte complet en Markdown avec ## intertitres et citations >",\n  "titleEn": "English Title",\n  "excerptEn": "English Excerpt"\n}\n\`\`\`\n`;
    return context;
  }

  // 2. Specific Screen context based on pathname
  if (pathname === '/admin/rubriques') {
    context += `=== DONNÉES DE L'ÉCRAN : RUBRIQUES & SECTION HISTOIRE ===\n`;
    context += `Rubriques configurées (${categories.length}) :\n`;
    for (const cat of categories) {
      const count = articles.filter((a: any) => a.category === cat.id || a.category === cat.slug).length;
      context += `- [${cat.id}] ${cat.label} (Slug: ${cat.slug}) · ${count} article(s) publié(s). Description: ${cat.description || 'N/A'}\n`;
    }
    const historyArticles = articles.filter((a: any) => a.category === 'histoire' || a.tags?.includes('Histoire'));
    context += `\nArticles rattachés à la Section Histoire (${historyArticles.length}) :\n`;
    for (const art of historyArticles) {
      context += `  * « ${art.title} » (${art.publishedAt?.slice(0, 10) || 'Date inconnue'}) - Sources: ${art.sourceCount || 1}\n`;
    }
    context += `\nRÔLE ATTENDU DE MICUM : Conseiller la rédaction sur l'organisation des rubriques, la politique d'archives et de mémoire historique de Burkina News, et vérifier la bonne catégorisation des articles.\n`;
    return context;
  }

  if (pathname === '/admin/articles') {
    context += `=== DONNÉES DE L'ÉCRAN : CATALOGUE DES ARTICLES ===\n`;
    context += `Total d'articles enregistrés : ${articles.length}\n`;
    const byCat: Record<string, number> = {};
    for (const a of articles) {
      byCat[a.category] = (byCat[a.category] || 0) + 1;
    }
    context += `Répartition par rubrique : ${Object.entries(byCat).map(([k, v]) => `${k} (${v})`).join(', ')}\n\n`;
    context += `Articles récents en base de données :\n`;
    for (const a of articles.slice(0, 25)) {
      context += `- [${a.id}] « ${a.title} » | Rubrique: ${a.category} | Type: ${a.type || 'decryptage'} | Sources: ${a.sourceCount || 0} | Date: ${a.publishedAt?.slice(0, 10) || 'N/A'}\n`;
    }
    context += `\nRÔLE ATTENDU DE MICUM : Analyser la couverture éditoriale, vérifier les angles non encore couverts, évaluer la solidité des sources et répondre aux questions de recherche sur le catalogue.\n`;
    return context;
  }

  if (pathname === '/admin/une') {
    context += `=== DONNÉES DE L'ÉCRAN : PILOTAGE DE LA UNE ===\n`;
    const leadArt = articles.find((a: any) => a.id === homepageConfig?.leadArticleId);
    const secArts = articles.filter((a: any) => homepageConfig?.secondaryArticleIds?.includes(a.id));
    context += `- Article d'ouverture (Lead) : ${leadArt ? `« ${leadArt.title} » (${leadArt.category})` : 'Non défini'}\n`;
    context += `- Articles secondaires en Une (${secArts.length}) :\n`;
    for (const sa of secArts) {
      context += `  * « ${sa.title} » (${sa.category})\n`;
    }
    if (homepageConfig?.featuredQuote) {
      context += `- Citation éditoriale en Une : « ${homepageConfig.featuredQuote.quoteFr} » — ${homepageConfig.featuredQuote.author}\n`;
    }
    context += `\nRÔLE ATTENDU DE MICUM : Auditer la hiérarchie de l'information, l'équilibre thématique de la Une et proposer des optimisations d'impact.\n`;
    return context;
  }

  if (pathname === '/admin/projets') {
    context += `=== DONNÉES DE L'ÉCRAN : TRACKER DES CHANTIERS PUBLICS ===\n`;
    context += `Total de chantiers suivis : ${projects.length}\n`;
    for (const p of projects) {
      context += `- [${p.id}] ${p.name} | Secteur: ${p.sector} | Budget: ${p.budget || 'N/A'} | Avancement: ${p.progress || 0}% | Statut: ${p.status} | Prestataire: ${p.contractor || 'Non précisé'}\n`;
    }
    context += `\nRÔLE ATTENDU DE MICUM : Analyser l'avancement des grands chantiers, identifier les retards ou blocages, vérifier la cohérence des budgets en FCFA et les maîtres d'œuvre.\n`;
    return context;
  }

  if (pathname.startsWith('/admin/indicateurs')) {
    context += `=== DONNÉES DE L'ÉCRAN : BAROMÈTRE RELANCE (INDICATEURS ÉCONOMIQUES) ===\n`;
    context += `Nombre d'indicateurs : ${indicators.length}\n`;
    for (const ind of indicators) {
      context += `- ${ind.name} : ${ind.value} ${ind.unit || ''} (Cible: ${ind.target || 'N/A'}) | Tendance: ${ind.trend || 'N/A'} | Source: ${ind.source || 'N/A'} | MàJ: ${ind.updatedAt || 'N/A'}\n`;
    }
    context += `\nRÔLE ATTENDU DE MICUM : Expliquer les indicateurs, calculer des corrélations factuelles, comparer les valeurs aux objectifs stratégiques de souveraineté économique (PND 2026-2030).\n`;
    return context;
  }

  if (pathname.startsWith('/admin/fil')) {
    context += `=== DONNÉES DE L'ÉCRAN : FIL D'ACTUALITÉ CERTIFIÉ (DÉPÊCHES) ===\n`;
    context += `Nombre de dépêches : ${briefs.length}\n`;
    for (const b of briefs.slice(0, 15)) {
      context += `- [${b.time || ''} ${b.date || ''}] « ${b.title} » | Source: ${b.source || 'N/A'} | Contenu: ${b.content?.slice(0, 100) || ''}...\n`;
    }
    context += `\nRÔLE ATTENDU DE MICUM : Rédiger ou calibrer des faits certifiés 1 minute, vérifier la source primaire et l'exactitude factuelle.\n`;
    return context;
  }

  if (pathname.startsWith('/admin/corrections')) {
    context += `=== DONNÉES DE L'ÉCRAN : REGISTRE DES CORRECTIONS ET TRANSPARENCE ===\n`;
    context += `Corrections publiées (${corrections.length}) :\n`;
    for (const c of corrections) {
      context += `- ${c.date} | Article : « ${c.articleTitle} » | Motif : ${c.reason} | Validé par : ${c.validatedBy}\n  * Initial : ${c.previousText}\n  * Rectifié : ${c.correctedText}\n`;
    }
    context += `\nRÔLE ATTENDU DE MICUM : Assister l'auditeur déontologique pour formuler des rectificatifs précis, sans altération clandestine d'historique.\n`;
    return context;
  }

  if (pathname.startsWith('/admin/signalements')) {
    context += `=== DONNÉES DE L'ÉCRAN : SIGNALEMENTS LECTEURS ET ALERTES CITOYENNES ===\n`;
    context += `Messages / Signalements reçus (${contacts.length}) :\n`;
    for (const c of contacts.slice(0, 10)) {
      context += `- ${c.date || c.createdAt || 'N/A'} | De: ${c.name} (${c.email || ''}) | Sujet: ${c.subject || 'N/A'} | Message: ${c.message?.slice(0, 120) || ''}...\n`;
    }
    context += `\nRÔLE ATTENDU DE MICUM : Évaluer la crédibilité des pistes d'enquête, proposer des vérifications de recoupement et rédiger des réponses déontologiques.\n`;
    return context;
  }

  if (pathname.startsWith('/admin/newsletter')) {
    context += `=== DONNÉES DE L'ÉCRAN : ABONNÉS NEWSLETTER ===\n`;
    context += `Total d'inscrits : ${newsletter.length}\n`;
    context += `RÔLE ATTENDU DE MICUM : Analyser la dynamique d'abonnement et formuler les résumés pour l'envoi de la lettre hebdomadaire.\n`;
    return context;
  }

  if (pathname.startsWith('/admin/utilisateurs')) {
    context += `=== DONNÉES DE L'ÉCRAN : ÉQUIPE RÉDACTIONNELLE & ACCÈS ===\n`;
    context += `Membres enregistrés (${users.length}) :\n`;
    for (const u of users) {
      context += `- ${u.name} (${u.email}) - Rôle: ${u.role} - Statut: ${u.status}\n`;
    }
    context += `\nRÔLE ATTENDU DE MICUM : Rappeler les devoirs déontologiques et les droits d'accès selon les fonctions.\n`;
    return context;
  }

  // General dashboard
  context += `=== DONNÉES DE L'ÉCRAN : TABLEAU DE BORD GÉNÉRAL ===\n`;
  context += `- Articles publiés/en cours : ${articles.length}\n`;
  context += `- Chantiers suivis : ${projects.length}\n`;
  context += `- Indicateurs économiques : ${indicators.length}\n`;
  context += `- Dépêches au fil : ${briefs.length}\n`;
  context += `- Corrections déontologiques : ${corrections.length}\n`;
  context += `- Signalements citoyens : ${contacts.length}\n`;
  context += `- Abonnés newsletter : ${newsletter.length}\n`;
  context += `\nRÔLE ATTENDU DE MICUM : Donner une vision panoramique de l'activité éditoriale, prioriser les tâches d'enquête et répondre à toute question sur la rédaction.\n`;

  return context;
}

// Built-in multi-provider intelligent engine (Gemini, Claude, OpenAI)
export async function POST(req: NextRequest) {
  try {
    const body: AIRequest = await req.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action requise' }, { status: 400 });
    }

    switch (action) {
      case 'chat': {
        const message = payload?.message || payload?.text || '';
        const history = payload?.history || [];
        const screen = payload?.screen || { pathname: '/admin', sectionTitle: "Desk Rédaction", canInsert: false };
        const activeEditorData = payload?.activeEditorData || payload?.currentContext;
        const attachments = (payload?.attachments || []) as Array<{ name: string; url?: string; type?: string; size?: number }>;

        const providerInfo = getActiveProviderInfo();
        if (!providerInfo.isLive) {
          return NextResponse.json({
            error: "Aucune clé API d'IA en direct n'est configurée (GEMINI_API_KEY requise dans .env.local)."
          }, { status: 503 });
        }

        const store = getAdminStore();
        const contacts = getSubmissionsContacts();
        const newsletter = getSubmissionsNewsletter();

        const screenContext = buildScreenContext({
          pathname: screen.pathname || '/admin',
          sectionTitle: screen.sectionTitle,
          canInsert: Boolean(screen.canInsert),
          activeEditorData,
          store,
          contacts,
          newsletter
        });

        const systemPrompt = `Tu es Micum, le Desk IA et assistant d'investigation journalistique de la rédaction de "Burkina News" (média d'investigation burkinabè axé sur la rigueur factuelle, la traçabilité des chiffres officiels et la souveraineté économique).

RÈGLES D'OR :
1. Tu as sous les yeux les DONNÉES RÉELLES de l'écran sur lequel se trouve le journaliste (détaillées ci-dessous).
2. Toutes tes réponses doivent être rigoureuses, précises, étayées et adaptées à cet écran spécifique.
3. Ne produis JAMAIS de réponses factices ou de textes mocks préenregistrés : réponds authentiquement en analysant les données réelles fournies et la demande du journaliste.
4. Si l'utilisateur est sur un formulaire d'article ou de chantier (${screen.canInsert ? 'OUI' : 'NON'}), et qu'il demande de rédiger, améliorer, titrer ou traduire un contenu, réponds en expliquant ton travail puis ajoute à la fin un bloc JSON strict :
\`\`\`json
{
  "title": "Titre proposé...",
  "excerpt": "Chapô proposé...",
  "content": "Corps rédigé en Markdown...",
  "titleEn": "Titre en anglais...",
  "excerptEn": "Chapô en anglais...",
  "contentEn": "Corps en anglais..."
}
\`\`\`
5. Rédige toujours en français d'un niveau journalistique irréprochable (ou en anglais si demandé).

${screenContext}
`;

        let userPrompt = message;
        if (attachments.length > 0) {
          userPrompt += `\n\n[Pièces jointes fournies : ${attachments.map(a => `${a.name} (${a.type || 'fichier'})`).join(', ')}]`;
        }

        const messagesForAi = [
          ...history.map((h: any) => ({
            role: (h.role === 'assistant' || h.role === 'model') ? ('assistant' as const) : ('user' as const),
            content: h.content || ''
          })),
          { role: 'user' as const, content: userPrompt }
        ];

        try {
          const aiRes = await generateAIChat({
            systemPrompt,
            messages: messagesForAi,
            temperature: 0.3
          });

          return NextResponse.json({
            success: true,
            model: aiRes.model,
            provider: aiRes.provider,
            text: aiRes.text,
            data: aiRes.rawData || undefined
          });
        } catch (err: any) {
          console.error('Gemini chat execution error:', err);
          return NextResponse.json({
            error: `Erreur du modèle IA (${providerInfo.modelName}) : ${err.message || 'Échec de génération'}`
          }, { status: 502 });
        }
      }

      case 'extract_article': {
        const text = payload?.text || '';
        const instructions = payload?.instructions?.trim() || '';
        const attachments = (payload?.attachments || []) as Array<{ name: string; url?: string; type?: string; size?: number }>;
        const isEditing = Boolean(payload?.isEditing);
        const currentContext = payload?.currentContext || {};
        const editMode = payload?.editMode || 'enrich'; // 'enrich' | 'append_update' | 'refine_chapo' | 'rewrite'

        const providerInfo = getActiveProviderInfo();
        if (!providerInfo.isLive) {
          return NextResponse.json({
            error: "Le fournisseur d'IA en direct n'est pas configuré. Veuillez renseigner GEMINI_API_KEY."
          }, { status: 503 });
        }

        try {
          const aiRes = await generateAIJson({
            systemPrompt: `Tu es le Desk IA et assistant d'investigation journalistique de "Burkina News" (média d'investigation burkinabè axé sur la rigueur factuelle, la traçabilité des chiffres officiels et la souveraineté économique).
RÈGLES DÉONTOLOGIQUES STRICTES :
1. Tu ne dois JAMAIS mentionner ton nom ("Micum") ni faire de méta-commentaires ("Selon votre demande", "Voici l'article", etc.) dans les textes générés.
2. Tout le contenu (titre, chapô, corps) doit être formulé avec le sérieux, l'élégance et la rigueur d'une rédaction d'investigation.
3. Le corps ("content") doit être en Markdown propre avec des intertitres (## 1. Contexte...), citations (>) et listes à puces factuelles (*).
4. Le champ "changesSummary" doit lister 2 ou 3 points synthétiques sur le travail effectué.
5. Tu réponds UNIQUEMENT sous forme d'un objet JSON strict avec cette structure :
{
  "title": string,
  "titleEn": string,
  "subtitle": string,
  "subtitleEn": string,
  "excerpt": string,
  "excerptEn": string,
  "content": string,
  "contentEn": string,
  "category": "economie" | "securite" | "chantiers" | "agriculture" | "societe" | "idees",
  "type": "decryptage" | "terrain" | "document" | "analyse",
  "readTime": string,
  "sourcesCount": number,
  "confidenceLevel": "A" | "B" | "C",
  "tags": string[],
  "changesSummary": string[]
}`,
            userPrompt: `DEMANDE ÉDITORIALE BURKINA NEWS :
Mode révision/édition : ${isEditing ? 'OUI (un article existe déjà)' : 'NON (création)'}
Stratégie de révision : ${editMode}
${isEditing ? `
CONTEXTE ACTUEL DE L'ARTICLE :
- Titre actuel : ${currentContext.title || ''}
- Chapô actuel : ${currentContext.excerpt || ''}
- Corps actuel : ${currentContext.body || ''}
- Rubrique : ${currentContext.category || ''}
` : ''}
${attachments.length > 0 ? `- Pièces jointes / documents officiels fournis : ${attachments.map(a => a.name).join(', ')}` : ''}
${text ? `- Documents bruts / Communiqué officiel / Notes :\n${text}` : ''}
${instructions ? `- Directives éditoriales particulières du journaliste :\n${instructions}` : ''}

Génère l'objet JSON complet.`
          });

          if (aiRes?.data && (aiRes.data.content || aiRes.data.title)) {
            return NextResponse.json({
              success: true,
              model: aiRes.model,
              isEditMode: isEditing,
              data: {
                ...aiRes.data,
                appliedInstructions: instructions || undefined,
                appliedAttachments: attachments.map(a => a.name)
              }
            });
          } else {
            throw new Error("L'IA n'a pas retourné de structure d'article valide");
          }
        } catch (aiErr: any) {
          console.error('Live AI call encountered an issue in extract_article:', aiErr);
          return NextResponse.json({
            error: `Erreur IA en direct (${providerInfo.modelName}) : ${aiErr.message || 'Échec de traitement'}`
          }, { status: 502 });
        }
      }

      case 'extract_project': {
        const text = payload?.text || '';
        const instructions = payload?.instructions?.trim() || '';
        const attachments = (payload?.attachments || []) as Array<{ name: string; url?: string; type?: string; size?: number }>;
        const isEditing = Boolean(payload?.isEditing);
        const currentContext = payload?.currentContext || {};

        const providerInfo = getActiveProviderInfo();
        if (!providerInfo.isLive) {
          return NextResponse.json({
            error: "Le fournisseur d'IA en direct n'est pas configuré. Veuillez renseigner GEMINI_API_KEY."
          }, { status: 503 });
        }

        try {
          const aiRes = await generateAIJson({
            systemPrompt: `Tu es le Desk IA et analyste de projets d'infrastructure pour le "Tracker" de Burkina News (plateforme de monitoring citoyen des chantiers et politiques publiques au Burkina Faso).
RÈGLES STRICTES :
1. Ne mentionne JAMAIS "Micum" dans les descriptions ou champs générés.
2. Tout doit être rédigé avec rigueur documentaire (secteur, région burkinabè réelle, budget en FCFA, calendrier réaliste).
3. Tu réponds UNIQUEMENT sous forme d'un objet JSON strict :
{
  "name": string,
  "nameEn": string,
  "sector": string,
  "region": string,
  "status": "annonce" | "engage" | "en-construction" | "inaugure" | "operationnel" | "impact-mesure",
  "currentBudget": string,
  "startDate": string,
  "estimatedEndDate": string,
  "description": string,
  "descriptionEn": string,
  "confidence": "A" | "B" | "C",
  "actors": [{"name": string, "role": string}]
}`,
            userPrompt: `DEMANDE D'ANALYSE DE CHANTIER :
Mode révision : ${isEditing ? 'OUI' : 'NON'}
${isEditing ? `Projet en cours : ${currentContext.title || currentContext.name || ''}\nStatut : ${currentContext.currentStatus || currentContext.status || ''}\nBudget : ${currentContext.amount || currentContext.currentBudget || ''}\nDescription existante : ${currentContext.description || ''}` : ''}
${attachments.length > 0 ? `Documents / décrets / PV joints : ${attachments.map(a => a.name).join(', ')}` : ''}
${text ? `Texte officiel / Décret / Données brutes :\n${text}` : ''}
${instructions ? `Consignes particulières :\n${instructions}` : ''}

Génère le JSON complet.`
          });

          if (aiRes?.data && (aiRes.data.name || aiRes.data.description)) {
            return NextResponse.json({
              success: true,
              model: aiRes.model,
              isEditMode: isEditing,
              data: {
                ...aiRes.data,
                appliedInstructions: instructions || undefined,
                appliedAttachments: attachments.map(a => a.name)
              }
            });
          } else {
            throw new Error("L'IA n'a pas retourné de structure de chantier valide");
          }
        } catch (e: any) {
          console.error('Live AI call for project failed:', e);
          return NextResponse.json({
            error: `Erreur IA en direct (${providerInfo.modelName}) : ${e.message || 'Échec de traitement'}`
          }, { status: 502 });
        }
      }

      case 'translate': {
        const { fields, targetLang = 'en' } = payload || {};
        if (!fields || typeof fields !== 'object') {
          return NextResponse.json({ error: 'Champs à traduire manquants' }, { status: 400 });
        }

        const sourceLang = targetLang === 'en' ? 'français' : 'anglais';
        const destLang = targetLang === 'en' ? 'anglais' : 'français';

        try {
          const aiRes = await generateAIJson({
            systemPrompt: `Tu es le Desk Traduction journalistique de Burkina News.
Traduis fidèlement chaque texte du ${sourceLang} vers le ${destLang}.
RÈGLES STRICTES :
1. Conserve le style journalistique exigeant, factuel et rigoureux de Burkina News.
2. Respecte la terminologie économique, institutionnelle et burkinabè (FCFA, ministères, institutions).
3. Conserve les clés de l'objet d'entrée exactement à l'identique.
4. Réponds UNIQUEMENT avec l'objet JSON associant chaque clé d'entrée à sa traduction.`,
            userPrompt: `Champs à traduire :\n${JSON.stringify(fields, null, 2)}`
          });

          if (!aiRes?.data || typeof aiRes.data !== 'object') {
            throw new Error("Échec de la traduction par l'IA");
          }

          return NextResponse.json({
            success: true,
            model: aiRes.model,
            provider: aiRes.provider,
            data: aiRes.data
          });
        } catch (err: any) {
          console.error('Erreur traduction Micum:', err);
          return NextResponse.json({ error: err.message || 'Échec de la traduction' }, { status: 502 });
        }
      }

      case 'compile_fil': {
        const text = payload?.text || '';
        const week = payload?.week || 35;

        try {
          const aiRes = await generateAIJson({
            systemPrompt: `Tu es le Desk IA éditorial de Burkina News.
Ta mission est de compiler une liste de faits vérifiés pour le fil d'actualité hebdomadaire (Le Fil - Semaine ${week}).
Chaque fait doit être rigoureusement sourcé, vérifiable et pertinent pour le Burkina Faso (économie, chantiers, agriculture, sécurité, société, politique, histoire).

Structure JSON attendue :
{
  "facts": [
    {
      "time": "08:30",
      "text": "Synthèse factuelle précise en français...",
      "textEn": "Journalistic translation in English...",
      "source": "Nom de la source officielle ou institutionnelle...",
      "sourceUrl": "URL de la source (ex: https://www.sig.bf)",
      "category": "chantiers" | "economie" | "agriculture" | "securite" | "societe" | "politique" | "histoire",
      "whyWatch": "Pourquoi ce fait compte pour le lecteur...",
      "whyWatchEn": "Why this matters in English..."
    }
  ]
}`,
            userPrompt: `Génère entre 5 et 10 faits marquants vérifiés pour la semaine ${week}.
${text ? `Dépêches, notes officielles ou textes bruts fournis :\n${text}` : `Base-toi sur l'actualité institutionnelle, économique et sociale vérifiable du Burkina Faso.`}`
          });

          if (!aiRes?.data?.facts || !Array.isArray(aiRes.data.facts)) {
            throw new Error("L'IA n'a pas pu compiler les faits du fil.");
          }

          return NextResponse.json({
            success: true,
            model: aiRes.model,
            provider: aiRes.provider,
            data: {
              weekNumber: week,
              factsCount: aiRes.data.facts.length,
              facts: aiRes.data.facts
            }
          });
        } catch (err: any) {
          console.error('Erreur compile_fil Micum:', err);
          return NextResponse.json({ error: err.message || 'Échec de compilation du fil' }, { status: 502 });
        }
      }

      case 'convert_signalement': {
        const report = payload?.report || {};
        const url = report.url || '';
        const description = report.description || report.message || report.content || '';
        const source = report.source || '';
        const email = report.email || 'Source anonymisée';

        try {
          const aiRes = await generateAIJson({
            systemPrompt: `Tu es le Desk Déontologie et Vérification des Faits de Burkina News.
Un lecteur ou une source a soumis un signalement d'erreur ou d'inexactitude factuelle sur un article.
Ta mission est d'analyser ce signalement et de générer une proposition de rectification journalistique transparente et rigoureuse pour notre registre public de transparence.

Structure JSON attendue :
{
  "articleTitle": "Titre probable ou identifié de l'article concerné",
  "previousText": "Passage ou chiffre erroné initialement publié",
  "correctedText": "Passage ou chiffre rectifié avec précision et traçabilité",
  "reason": "Explication déontologique détaillée de la correction et du croisement de sources",
  "validator": "Direction de la Rédaction"
}`,
            userPrompt: `Détails du signalement reçu :
- URL de l'article : ${url}
- Type de signalement : ${report.type || 'Erreur factuelle'}
- Description / Remarque du lecteur : ${description}
- Source citée par le lecteur : ${source}
- Contact : ${email}`
          });

          if (!aiRes?.data) {
            throw new Error("Échec de l'analyse du signalement par l'IA");
          }

          return NextResponse.json({
            success: true,
            model: aiRes.model,
            provider: aiRes.provider,
            data: aiRes.data
          });
        } catch (err: any) {
          console.error('Erreur convert_signalement Micum:', err);
          return NextResponse.json({ error: err.message || 'Échec de conversion du signalement' }, { status: 502 });
        }
      }

      case 'extract_indicators': {
        const text = payload?.text || '';
        const store = getAdminStore();
        const currentIndicators = store?.indicators || [];

        try {
          const aiRes = await generateAIJson({
            systemPrompt: `Tu es le Desk Données & Indicateurs Macro-économiques de Burkina News.
Ta mission est d'extraire d'un rapport ou communiqué officiel les évolutions récentes des indicateurs socio-économiques clés du Burkina Faso.

Indicateurs actuellement enregistrés dans notre baromètre :
${currentIndicators.map((ind: any) => `- ${ind.code} : ${ind.name} (valeur actuelle : ${ind.currentValue} ${ind.unit})`).join('\n')}

Structure JSON attendue :
{
  "updates": [
    {
      "code": "CODE_INDICATEUR",
      "name": "Nom de l'indicateur",
      "previousValue": 57.6,
      "newValue": 58.4,
      "unit": "tonnes | MW | % | milliards FCFA",
      "trend": "up" | "down" | "stable",
      "source": "Nom officiel de la source (ex: Rapport DGMG)",
      "sourceDate": "YYYY-MM-DD"
    }
  ]
}`,
            userPrompt: `Texte officiel ou données à analyser :\n${text || 'Analyse les dernières statistiques officielles disponibles pour le Burkina Faso (or, énergie, croissance PIB, production cotonnière).'}`
          });

          if (!aiRes?.data?.updates || !Array.isArray(aiRes.data.updates)) {
            throw new Error("L'IA n'a pas pu extraire d'indicateurs du document.");
          }

          return NextResponse.json({
            success: true,
            model: aiRes.model,
            provider: aiRes.provider,
            data: {
              detectedIndicators: aiRes.data.updates.length,
              updates: aiRes.data.updates
            }
          });
        } catch (err: any) {
          console.error('Erreur extract_indicators Micum:', err);
          return NextResponse.json({ error: err.message || "Échec d'extraction des indicateurs" }, { status: 502 });
        }
      }

      case 'morning_brief': {
        const store = getAdminStore();
        const articles = store?.articles || [];
        const projects = store?.projects || [];
        const indicators = store?.indicators || [];
        const corrections = store?.corrections || [];

        try {
          const aiRes = await generateAIJson({
            systemPrompt: `Tu es le Desk IA en chef de Burkina News.
Chaque matin, tu prépares le briefing stratégique de la rédaction ("Morning Briefing") à l'attention de l'équipe éditoriale.
Ce briefing doit être percutant, synthétique, basé sur l'état réel des données du desk et orienté sur les actions prioritaires.

Structure JSON attendue :
{
  "greeting": "Bonjour à l'équipe de la rédaction. Voici le tour d'horizon ce matin :",
  "highlights": [
    "Point marquant 1 (sur les chantiers, signalements ou indicateurs)...",
    "Point marquant 2...",
    "Point marquant 3..."
  ],
  "recommendation": "Recommandation éditoriale claire (ex: quel sujet mettre en Une, quelle enquête approfondir)...",
  "timestamp": "HH:mm"
}`,
            userPrompt: `État actuel des contenus et du desk Burkina News :
- Articles publiés : ${articles.length} (Derniers : ${articles.slice(0, 3).map((a: any) => `« ${a.title} »`).join(', ')})
- Grands chantiers suivis : ${projects.length} (Exemples : ${projects.slice(0, 3).map((p: any) => `${p.title || p.name} (${p.currentStatus || p.status})`).join(', ')})
- Indicateurs économiques : ${indicators.length}
- Rectifications/corrections déontologiques : ${corrections.length}

Rédige le Morning Briefing d'aujourd'hui.`
          });

          const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

          if (!aiRes?.data) {
            throw new Error("Échec de génération du Morning Briefing");
          }

          return NextResponse.json({
            success: true,
            model: aiRes.model,
            provider: aiRes.provider,
            data: {
              ...aiRes.data,
              timestamp: aiRes.data.timestamp || timeStr
            }
          });
        } catch (err: any) {
          console.error('Erreur morning_brief Micum:', err);
          return NextResponse.json({ error: err.message || 'Échec de génération du briefing' }, { status: 502 });
        }
      }

      case 'generate_newsletter': {
        const store = getAdminStore();
        const articles = store?.articles || [];
        const projects = store?.projects || [];
        const recentArticles = articles.slice(0, 5);

        try {
          const aiRes = await generateAIJson({
            systemPrompt: `Tu es le Desk Éditorial de Burkina News.
Ta mission est de composer le brouillon de la lettre d'information hebdomadaire (newsletter) destinée à nos abonnés.
La lettre doit refléter notre ADN : indépendance, faits vérifiés, traçabilité des chiffres, pas de sensationnalisme.

Structure JSON attendue :
{
  "subjectOptions": [
    "Option d'objet 1",
    "Option d'objet 2",
    "Option d'objet 3"
  ],
  "intro": "Texte d'introduction chaleureux et professionnel...",
  "leadTitle": "Titre du Grand Décryptage à la une de la lettre",
  "briefHighlights": [
    "Point clé 1...",
    "Point clé 2...",
    "Point clé 3..."
  ],
  "trackerStatus": "Synthèse sur l'avancement des grands chantiers...",
  "fullText": "Texte complet prêt à l'envoi formaté avec les sections..."
}`,
            userPrompt: `Compose la newsletter hebdomadaire à partir des actualités récentes de notre rédaction :
${recentArticles.map((a: any) => `- [${a.category}] « ${a.title} » : ${a.excerpt || ''}`).join('\n')}
Chantiers majeurs : ${projects.slice(0, 3).map((p: any) => `${p.title || p.name} (${p.amount || p.currentBudget || 'Budget non précisé'})`).join(', ')}`
          });

          if (!aiRes?.data) {
            throw new Error("Échec de composition de la newsletter par l'IA");
          }

          return NextResponse.json({
            success: true,
            model: aiRes.model,
            provider: aiRes.provider,
            data: aiRes.data
          });
        } catch (err: any) {
          console.error('Erreur generate_newsletter Micum:', err);
          return NextResponse.json({ error: err.message || 'Échec de composition de la newsletter' }, { status: 502 });
        }
      }

      case 'suggest_quote': {
        const store = getAdminStore();
        const articles = store?.articles || [];

        try {
          const aiRes = await generateAIJson({
            systemPrompt: `Tu es le Directeur éditorial de Burkina News (média d'investigation et d'analyse axé sur la rigueur factuelle, la transparence et la souveraineté économique au Burkina Faso).
Propose une citation éditoriale forte, inspirante et bilingue (français et anglais) pour la vitrine de la page d'accueil (Une).
Elle doit porter sur la rigueur de l'information, le travail, la transformation du Faso, le devoir de vérité ou la reconstruction nationale.

Structure JSON attendue :
{
  "quoteFr": "Citation en français...",
  "quoteEn": "Citation traduite en anglais...",
  "author": "Nom de l'auteur (personnalité historique burkinabè, penseur africain ou Alfred Ouédraogo - Directeur éditorial)",
  "contextFr": "Fonction ou contexte en français...",
  "contextEn": "Fonction ou contexte en anglais..."
}`,
            userPrompt: `Suggère une nouvelle citation éditoriale pour la Une. Sujets récents traités : ${articles.slice(0, 3).map((a: any) => a.title).join(', ')}.`
          });

          if (!aiRes?.data) {
            throw new Error("Échec de la génération de citation par l'IA");
          }

          return NextResponse.json({
            success: true,
            model: aiRes.model,
            provider: aiRes.provider,
            data: aiRes.data
          });
        } catch (err: any) {
          console.error('Erreur suggest_quote Micum:', err);
          return NextResponse.json({ error: err.message || 'Échec de génération de citation' }, { status: 502 });
        }
      }

      default:
        return NextResponse.json({ error: `Action inconnue: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Erreur Micum API:', error);
    return NextResponse.json({ error: error.message || 'Erreur interne du serveur' }, { status: 500 });
  }
}
