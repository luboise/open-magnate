-- CreateTable
CREATE TABLE "UserSession" (
    "sessionKey" TEXT NOT NULL PRIMARY KEY,
    "browserId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "LobbyPlayer" (
    "lobbyId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "timeJoined" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurantId" INTEGER NOT NULL,
    CONSTRAINT "LobbyPlayer_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LobbyPlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserSession" ("sessionKey") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LobbyPlayer_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lobby" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_browserId_key" ON "UserSession"("browserId");

-- CreateIndex
CREATE UNIQUE INDEX "LobbyPlayer_userId_key" ON "LobbyPlayer"("userId");
