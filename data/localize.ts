import { Article, Project, Indicator, Issue, Brief } from './types';

export function localizeArticle(art: Article, lang: 'fr' | 'en' = 'fr'): Article {
  if (lang === 'fr') return art;
  return {
    ...art,
    title: art.titleEn || art.title,
    excerpt: art.excerptEn || art.excerpt,
    body: art.bodyEn || art.body,
  };
}

export function localizeProject(proj: Project, lang: 'fr' | 'en' = 'fr'): Project {
  if (lang === 'fr') return proj;
  return {
    ...proj,
    title: proj.titleEn || proj.title,
    description: proj.descriptionEn || proj.description,
    statusHistory: proj.statusHistory.map(sh => ({
      ...sh,
      note: sh.noteEn || sh.note,
    })),
    actors: proj.actors.map(act => ({
      ...act,
      role: act.roleEn || act.role,
    })),
  };
}

export function localizeIndicator(ind: Indicator, lang: 'fr' | 'en' = 'fr'): Indicator {
  if (lang === 'fr') return ind;
  return {
    ...ind,
    name: ind.nameEn || ind.name,
    definition: ind.definitionEn || ind.definition,
    program: ind.programEn || ind.program,
  };
}

export function localizeIssue(iss: Issue, lang: 'fr' | 'en' = 'fr'): Issue {
  if (lang === 'fr') return iss;
  return {
    ...iss,
    title: iss.titleEn || iss.title,
    summary: iss.summaryEn || iss.summary,
  };
}

export function localizeBrief(br: Brief, lang: 'fr' | 'en' = 'fr'): Brief {
  if (lang === 'fr') return br;
  return {
    ...br,
    title: br.titleEn || br.title,
    summary: br.summaryEn || br.summary,
    facts: br.facts.map(f => ({
      ...f,
      text: f.textEn || f.text,
      whyWatch: f.whyWatchEn || f.whyWatch,
    })),
  };
}
