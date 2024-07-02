/*
  Warnings:

  - You are about to drop the column `playerCount` on the `lobby` table. All the data in the column will be lost.
  - You are about to drop the column `host` on the `lobby_player` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameId,restaurantId]` on the table `game_player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gameStateId,playerNumber]` on the table `lobby_player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `restaurantId` to the `game_player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerCount` to the `game_state` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameStateId` to the `lobby_player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerNumber` to the `lobby_player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `lobby_player` DROP FOREIGN KEY `lobby_player_restaurantId_fkey`;

-- DropIndex
DROP INDEX `lobby_player_restaurantId_lobbyId_key` ON `lobby_player`;

-- AlterTable
ALTER TABLE `game_player` ADD COLUMN `restaurantId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `game_state` ADD COLUMN `playerCount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `lobby` DROP COLUMN `playerCount`;

-- AlterTable
ALTER TABLE `lobby_player` DROP COLUMN `host`,
    ADD COLUMN `gameStateId` INTEGER NOT NULL,
    ADD COLUMN `isHost` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `playerNumber` INTEGER NOT NULL,
    MODIFY `restaurantId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `game_player_gameId_restaurantId_key` ON `game_player`(`gameId`, `restaurantId`);

-- CreateIndex
CREATE UNIQUE INDEX `lobby_player_gameStateId_playerNumber_key` ON `lobby_player`(`gameStateId`, `playerNumber`);

-- AddForeignKey
ALTER TABLE `lobby_player` ADD CONSTRAINT `lobby_player_gameStateId_playerNumber_fkey` FOREIGN KEY (`gameStateId`, `playerNumber`) REFERENCES `game_player`(`gameId`, `player_number`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lobby_player` ADD CONSTRAINT `lobby_player_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`restaurant_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_player` ADD CONSTRAINT `game_player_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`restaurant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
