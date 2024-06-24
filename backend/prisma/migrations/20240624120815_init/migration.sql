/*
  Warnings:

  - Added the required column `name` to the `Lobby` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lobby" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT
);
INSERT INTO "new_Lobby" ("id", "password") SELECT "id", "password" FROM "Lobby";
DROP TABLE "Lobby";
ALTER TABLE "new_Lobby" RENAME TO "Lobby";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
