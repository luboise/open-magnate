/*
  Warnings:

  - You are about to drop the column `number` on the `game_marketing_campaign` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameId,marketingNumber]` on the table `game_marketing_campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gameId,player_number,employeeIndex]` on the table `game_marketing_campaign` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeIndex` to the `game_marketing_campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketingNumber` to the `game_marketing_campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_number` to the `game_marketing_campaign` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `game_marketing_campaign` DROP FOREIGN KEY `game_marketing_campaign_gameId_fkey`;

-- DropIndex
DROP INDEX `game_marketing_campaign_gameId_number_key` ON `game_marketing_campaign`;

-- AlterTable
ALTER TABLE `game_marketing_campaign` DROP COLUMN `number`,
    ADD COLUMN `employeeIndex` INTEGER NOT NULL,
    ADD COLUMN `marketingNumber` INTEGER NOT NULL,
    ADD COLUMN `player_number` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `game_marketing_campaign_gameId_marketingNumber_key` ON `game_marketing_campaign`(`gameId`, `marketingNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `game_marketing_campaign_gameId_player_number_employeeIndex_key` ON `game_marketing_campaign`(`gameId`, `player_number`, `employeeIndex`);

-- AddForeignKey
ALTER TABLE `game_marketing_campaign` ADD CONSTRAINT `game_marketing_campaign_gameId_player_number_fkey` FOREIGN KEY (`gameId`, `player_number`) REFERENCES `game_player`(`gameId`, `player_number`) ON DELETE CASCADE ON UPDATE CASCADE;
