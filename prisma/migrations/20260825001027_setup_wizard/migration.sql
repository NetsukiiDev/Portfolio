/*
  Warnings:

  - Added the required column `username` to the `AdminAccount` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdminAccount" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AdminAccount" ("id", "passwordHash", "updatedAt") SELECT "id", "passwordHash", "updatedAt" FROM "AdminAccount";
DROP TABLE "AdminAccount";
ALTER TABLE "new_AdminAccount" RENAME TO "AdminAccount";
CREATE UNIQUE INDEX "AdminAccount_username_key" ON "AdminAccount"("username");
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "personal" JSONB NOT NULL,
    "social" JSONB NOT NULL,
    "seo" JSONB NOT NULL,
    "contactForm" JSONB NOT NULL,
    "maintenance" JSONB NOT NULL,
    "defaultLocale" TEXT NOT NULL DEFAULT 'en',
    "themePalette" TEXT NOT NULL DEFAULT 'violet',
    "themeMode" TEXT NOT NULL DEFAULT 'dark',
    "domain" TEXT NOT NULL DEFAULT '',
    "https" BOOLEAN NOT NULL DEFAULT true,
    "setupCompletedAt" DATETIME
);
INSERT INTO "new_Settings" ("contactForm", "id", "maintenance", "personal", "seo", "social") SELECT "contactForm", "id", "maintenance", "personal", "seo", "social" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
