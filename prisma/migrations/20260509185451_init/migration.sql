/*
  Warnings:

  - You are about to drop the column `generatedText` on the `AIMessage` table. All the data in the column will be lost.
  - You are about to drop the column `messageType` on the `AIMessage` table. All the data in the column will be lost.
  - You are about to drop the column `apiKey` on the `AppSetting` table. All the data in the column will be lost.
  - You are about to drop the column `baseUrl` on the `AppSetting` table. All the data in the column will be lost.
  - You are about to drop the column `modelName` on the `AppSetting` table. All the data in the column will be lost.
  - You are about to drop the column `providerName` on the `AppSetting` table. All the data in the column will be lost.
  - Added the required column `content` to the `AIMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `AIMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `AppSetting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `AppSetting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN "followUpNeeded" BOOLEAN;
ALTER TABLE "Interaction" ADD COLUMN "interactionTypeAI" TEXT;
ALTER TABLE "Interaction" ADD COLUMN "relationshipSignal" TEXT;
ALTER TABLE "Interaction" ADD COLUMN "sentiment" TEXT;
ALTER TABLE "Interaction" ADD COLUMN "suggestedFollowUpDays" INTEGER;
ALTER TABLE "Interaction" ADD COLUMN "topics" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AIMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contactId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AIMessage_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AIMessage" ("contactId", "createdAt", "id") SELECT "contactId", "createdAt", "id" FROM "AIMessage";
DROP TABLE "AIMessage";
ALTER TABLE "new_AIMessage" RENAME TO "AIMessage";
CREATE INDEX "AIMessage_contactId_idx" ON "AIMessage"("contactId");
CREATE TABLE "new_AppSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AppSetting" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "AppSetting";
DROP TABLE "AppSetting";
ALTER TABLE "new_AppSetting" RENAME TO "AppSetting";
CREATE UNIQUE INDEX "AppSetting_key_key" ON "AppSetting"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
