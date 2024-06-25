/*
  Warnings:

  - A unique constraint covering the columns `[restaurantId,lobbyId]` on the table `LobbyPlayer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LobbyPlayer_restaurantId_lobbyId_key" ON "LobbyPlayer"("restaurantId", "lobbyId");
