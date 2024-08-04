/*
  Warnings:

  - Made the column `oldTurnOrder` on table `game_state` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `game_state` MODIFY `oldTurnOrder` VARCHAR(191) NOT NULL DEFAULT '1234';
