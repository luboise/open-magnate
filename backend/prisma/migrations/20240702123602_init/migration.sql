/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `lobby_player` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `lobby_player` DROP FOREIGN KEY `lobby_player_restaurantId_fkey`;

-- AlterTable
ALTER TABLE `lobby_player` DROP COLUMN `restaurantId`;
