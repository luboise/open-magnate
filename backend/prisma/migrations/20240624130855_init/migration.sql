-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lobby" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "playerCount" INTEGER NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "gameStateId" INTEGER
);
INSERT INTO "new_Lobby" ("gameStateId", "id", "inviteCode", "name", "password", "playerCount") SELECT "gameStateId", "id", "inviteCode", "name", "password", "playerCount" FROM "Lobby";
DROP TABLE "Lobby";
ALTER TABLE "new_Lobby" RENAME TO "Lobby";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
