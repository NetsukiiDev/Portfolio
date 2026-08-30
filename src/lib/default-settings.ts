import type {
  HomeSettings,
  LanguageSettings,
  PagesSettings,
  SectionsSettings,
  ToolsSettings,
} from "@/types/settings";

export const DEFAULT_PERSONAL = {
  translations: {
    en: {
      name: "Your Name",
      title: "Your role",
      bio: "One short line about what you do.",
      longBio: "Write a short introduction about yourself here — edit it from /admin/settings.",
      location: "Your City",
    },
    it: {
      name: "Il Tuo Nome",
      title: "Il tuo ruolo",
      bio: "Una riga breve su cosa fai.",
      longBio: "Scrivi qui una breve presentazione — modificala da /admin/settings.",
      location: "La Tua Città",
    },
  },
  avatar: "",
  email: "you@example.com",
  resumeUrl: "",
};

export const DEFAULT_SOCIAL = {
  github: null,
  linkedin: null,
  twitter: null,
  instagram: null,
  dribbble: null,
  youtube: null,
};

export const DEFAULT_SEO = {
  translations: {
    en: { siteTitle: "Your Name — Portfolio", siteDescription: "A short description of your site." },
    it: { siteTitle: "Il Tuo Nome — Portfolio", siteDescription: "Una breve descrizione del tuo sito." },
  },
  ogImage: "",
  siteUrl: "http://localhost:3000",
};

export const DEFAULT_LANGUAGE: LanguageSettings = {
  defaultLocale: "en",
  autoDetect: true,
  allowSwitch: true,
};

export const DEFAULT_CONTACT_FORM = { enabled: true };

// Mirrors the placeholder copy that used to live in translations.ts, now
// editable from /admin/portfolio. Stats start at zero rather than invented
// figures — see StatsSection.
export const DEFAULT_HOME: HomeSettings = {
  translations: {
    en: {
      kicker: "Your status or availability",
      title: "Your headline here\non two lines",
      subtitle: "One short sentence about what you do and who you do it for.",
      intro: "A paragraph with more of it — what you build, who for, and with what.",
      availability: "Available for work",
      ctaPrimary: "View my work",
      ctaSecondary: "Get in touch",
    },
    it: {
      kicker: "Il tuo stato o la tua disponibilità",
      title: "Il tuo titolo qui\nsu due righe",
      subtitle: "Una frase breve su cosa fai e per chi lo fai.",
      intro: "Un paragrafo con qualche dettaglio in più: cosa costruisci, per chi, e con cosa.",
      availability: "Disponibile per lavori",
      ctaPrimary: "Guarda i miei lavori",
      ctaSecondary: "Contattami",
    },
  },
  statsEnabled: true,
  stats: [
    { key: "repos", translations: { en: { label: "Public repositories" }, it: { label: "Repository pubblici" } } },
    { key: "followers", translations: { en: { label: "Followers" }, it: { label: "Follower" } } },
    { key: "stars", translations: { en: { label: "Stars earned" }, it: { label: "Stelle ricevute" } } },
    { key: "years", translations: { en: { label: "Years on GitHub" }, it: { label: "Anni su GitHub" } } },
  ],
};

export const DEFAULT_MAINTENANCE = {
  enabled: false,
  translations: {
    en: { message: "Site under maintenance" },
    it: { message: "Sito in manutenzione" },
  },
};

// The intro under each public page's title. Editable from /admin/portfolio →
// Pagine; these are only the starting point.
export const DEFAULT_PAGES: PagesSettings = {
  translations: {
    en: {
      projects: "A selection of your work.",
      skills: "The tools and technologies you work with.",
      experience: "Where you've worked and studied.",
      blog: "Notes, articles and ideas.",
      aiGallery: "AI-generated images with their full generation metadata.",
      contact: "Get in touch — I read everything that arrives.",
    },
    it: {
      projects: "Una selezione dei tuoi lavori.",
      skills: "Gli strumenti e le tecnologie con cui lavori.",
      experience: "Dove hai lavorato e studiato.",
      blog: "Appunti, articoli e idee.",
      aiGallery: "Immagini generate dall'AI con i metadati completi di generazione.",
      contact: "Scrivimi pure — leggo tutto quello che arriva.",
    },
  },
};

// The headings between the home page's sections. Editable from
// /admin/portfolio → Sezioni; these are only the starting point.
export const DEFAULT_SECTIONS: SectionsSettings = {
  translations: {
    en: {
      featuredProjects: "Featured projects",
      viewAll: "View all",
      tools: "Built with",
      recentPosts: "Recent posts",
      ctaHeading: "Need a hand?",
    },
    it: {
      featuredProjects: "Progetti in evidenza",
      viewAll: "Vedi tutti",
      tools: "Con cosa lavoro",
      recentPosts: "Ultimi articoli",
      ctaHeading: "Hai bisogno?",
    },
  },
};

// "auto" keeps a short list still and lets a long one scroll — see
// ToolsSection for where the line is drawn.
export const DEFAULT_TOOLS: ToolsSettings = { display: "auto" };
