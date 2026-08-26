// First-time setup: seeds a minimal set of placeholder content so the site
// isn't empty. Safe to re-run — every upsert is skipped if the row already
// exists. The admin account itself is created through the in-browser setup
// wizard at /setup, not by this script.
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd(), true);

import { prisma } from "../src/lib/prisma";
import {
  DEFAULT_PERSONAL,
  DEFAULT_SOCIAL,
  DEFAULT_SEO,
  DEFAULT_CONTACT_FORM,
  DEFAULT_MAINTENANCE,
} from "../src/lib/default-settings";
import type { Prisma } from "../src/generated/prisma-sqlite/client";

function toJson<T>(value: T): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}

async function main() {
  console.log("Seeding database...");

  const existingSettings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        id: "singleton",
        personal: toJson(DEFAULT_PERSONAL),
        social: toJson(DEFAULT_SOCIAL),
        seo: toJson(DEFAULT_SEO),
        contactForm: toJson(DEFAULT_CONTACT_FORM),
        maintenance: toJson(DEFAULT_MAINTENANCE),
      },
    });
    console.log("  Settings: created (placeholder content — edit from /admin/settings).");
  } else {
    console.log("  Settings already exist, skipping.");
  }

  const skillCategoryCount = await prisma.skillCategory.count();
  if (skillCategoryCount === 0) {
    const categories = [
      { id: "frontend", order: 1, name: "Frontend" },
      { id: "backend", order: 2, name: "Backend" },
      { id: "tools", order: 3, name: "Tools & Platforms" },
    ];
    for (const category of categories) {
      await prisma.skillCategory.create({
        data: {
          id: category.id,
          order: category.order,
          translations: toJson({ en: { name: category.name }, it: { name: category.name } }),
        },
      });
    }
    console.log("  Skill categories: created 3 starter categories.");
  } else {
    console.log("  Skill categories already exist, skipping.");
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
