import type { Locale } from "./index";

export interface AiLora {
  name: string;
  weight: number;
  source?: string;
}

export interface AiImageTranslation {
  title: string;
  description: string;
  prompt: string;
}

export interface AiImage {
  id: string;
  image: string;
  thumbnail: string;
  tags: string[];
  model: string;
  sampler: string;
  steps: number;
  cfgScale: number;
  seed: number;
  negativePrompt: string;
  loras: AiLora[];
  createdAt: string;
  translations: Record<Locale, AiImageTranslation>;
}
