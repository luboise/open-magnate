/*
  Warnings:

  - Added the required column `gameStateId` to the `Lobby` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "GameState" (
    "lobbyId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "GameState_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lobby" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "playerCount" INTEGER NOT NULL,
    "gameStateId" INTEGER NOT NULL
);
INSERT INTO "new_Lobby" ("id", "name", "password", "playerCount") SELECT "id", "name", "password", "playerCount" FROM "Lobby";
DROP TABLE "Lobby";
ALTER TABLE "new_Lobby" RENAME TO "Lobby";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
