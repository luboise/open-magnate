/*
  Warnings:

  - Added the required column `reserve` to the `game_state` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `game_state` ADD COLUMN `reserve` JSON NOT NULL;
