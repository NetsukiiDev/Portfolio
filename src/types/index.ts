export type Locale = "en" | "it";

export type TranslatedField = Record<Locale, string>;

export type TranslatedContent = Record<Locale, Record<string, string>>;

export * from "./project";
export * from "./blog";
export * from "./skill";
export * from "./experience";
export * from "./ai-gallery";
export * from "./settings";
