export const DEFAULT_PERSONAL = {
  translations: {
    en: {
      name: "Your Name",
      title: "Full-Stack Developer",
      bio: "Crafting fast, thoughtful digital experiences with code and creativity.",
      longBio: "Write a short introduction about yourself here — edit it from /admin/settings.",
      location: "Your City",
    },
    it: {
      name: "Il Tuo Nome",
      title: "Sviluppatore Full-Stack",
      bio: "Creo esperienze digitali veloci e curate con codice e creatività.",
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
    en: { siteTitle: "Your Name — Portfolio", siteDescription: "Full-Stack Developer Portfolio" },
    it: { siteTitle: "Il Tuo Nome — Portfolio", siteDescription: "Portfolio di Sviluppatore Full-Stack" },
  },
  ogImage: "",
  siteUrl: "http://localhost:3000",
};

export const DEFAULT_CONTACT_FORM = { enabled: true };

export const DEFAULT_MAINTENANCE = {
  enabled: false,
  translations: {
    en: { message: "Site under maintenance" },
    it: { message: "Sito in manutenzione" },
  },
};
