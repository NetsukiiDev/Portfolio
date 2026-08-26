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

export const DEFAULT_CONTACT_FORM = { enabled: true };

// Mirrors the placeholder copy that used to live in translations.ts, now
// editable from /admin/portfolio. Stats start at zero rather than invented
// figures — see StatsSection.
export const DEFAULT_HOME = {
  translations: {
    en: {
      kicker: "Your status or availability",
      title: "Your headline here\non two lines",
      subtitle: "One short sentence about what you do and who you do it for.",
      ctaPrimary: "View my work",
      ctaSecondary: "Get in touch",
    },
    it: {
      kicker: "Il tuo stato o la tua disponibilità",
      title: "Il tuo titolo qui\nsu due righe",
      subtitle: "Una frase breve su cosa fai e per chi lo fai.",
      ctaPrimary: "Guarda i miei lavori",
      ctaSecondary: "Contattami",
    },
  },
  statsEnabled: true,
  stats: [
    { value: 0, translations: { en: { label: "Projects shipped" }, it: { label: "Progetti realizzati" } } },
    { value: 0, translations: { en: { label: "Years of experience" }, it: { label: "Anni di esperienza" } } },
    { value: 0, translations: { en: { label: "Happy clients" }, it: { label: "Clienti soddisfatti" } } },
    { value: 0, translations: { en: { label: "Cups of coffee" }, it: { label: "Tazze di caffè" } } },
  ],
};

export const DEFAULT_MAINTENANCE = {
  enabled: false,
  translations: {
    en: { message: "Site under maintenance" },
    it: { message: "Sito in manutenzione" },
  },
};
